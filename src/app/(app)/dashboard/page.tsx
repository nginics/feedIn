'use client'

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Clipboard } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoadig, setIsSwitchLoading] = useState(false);
    const [profileUrl, setProfileUrl] = useState('');
    const { toast } = useToast();

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }
    const {data: session} = useSession();
    const user = session?.user as User;

    const {register, watch, setValue} = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(
        async () => {
            setIsSwitchLoading(true)
            try {
                const response = await axios.get<ApiResponse>(`/api/accepting-status`)
                setValue('acceptMessages', response.data.isAcceptingMessage)
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: "Error",
                    description: axiosError.response?.data.message || "Failed to fetch message status",
                    variant: "destructive"
                })
            } finally {
                setIsSwitchLoading(false)
            }
        }, [acceptMessages]
    )

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);

        try {
            const response = await axios.get<ApiResponse>('/api/message/get-all')
            // console.log("Get-All Response Data:", response.data);
            
            setMessages(response.data.messages || [])

            if(refresh) {
                toast({
                    title: "Refreshed Messages",
                    description: "Showing Latest Messages"
                })
            }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message status",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if(!session || !session.user) return
        fetchMessages()
    }, [session, fetchMessages])

    useEffect(() => {
        if(!session || !session.user) return
        fetchAcceptMessage()
    }, [session, acceptMessages, fetchAcceptMessage])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post('/api/accepting-status', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message status",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false);
            setIsSwitchLoading(false)
        }
    }

    
    useEffect(() => {
        const baseUrl = `${window.location.protocol}//${window.location.host}`;
        setProfileUrl(`${baseUrl}/u/${user?.username}`);

    }, [user])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URL Copied!",
            description: "Profile URL copied to clipboard"
        })
    }

    if (!session || !session.user) {
        return <div>Please Login</div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 pt-14 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
            {acceptMessages && <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex justify-between">
                    <input type="text" id="profileUrl" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-5"/>
                    <Button 
                        onClick={copyToClipboard}
                    >
                        <Clipboard /> Copy 
                    </Button>
                </div>
            </div>}
            <div className="mb-4 flex">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoadig}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />
            <Button variant="outline" className="mt-4" onClick={(e) => {
                e.preventDefault();
                fetchMessages();
            }}>
                {
                    isLoading ? ( <Loader2 className="h-4 w-4 animate-spin" /> ) : 
                    ( 
                        <div className="flex space-x-2">
                            <p>Refresh</p>
                            <RefreshCcw className="h-4 w-4" /> 
                        </div>
                    )
                }
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {
                    ( messages.length > 0 ) ? (messages.map((message, index) => (
                        <MessageCard 
                            key={index} 
                            message={message} 
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))) : (<p>No Messages to Display</p>)
                }
            </div>
        </div>
    )
}

export default page;