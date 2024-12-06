'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schema/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";

const MessagePage = () => {

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isAcceptingMessage, setIsAcceptingMessage] = useState<boolean>();
	const { username } = useParams<{ username: string }>()
	const { toast } = useToast()
	const router = useRouter()
	
	const getUserStatus = async () => {
		try {
			const response = await axios.get(`/api/accepting-status?username=${username}`)
			console.log("Response:", response)
			
			if (response.data.success) {
				setIsAcceptingMessage(response.data.isAcceptingMessage)
			}
		} catch (error) {
			setIsAcceptingMessage(false)
			const axiosError = error as AxiosError;
			if (axiosError.response && axiosError.response.status === 404) {
				console.log("Axios error response", axiosError.response)
				router.replace('/not-found')
				return
			}
			console.log(axiosError)
			toast({
				title: axiosError.code,
				description: axiosError.message,
				variant: "destructive"
			})
		}
	}
	getUserStatus()
	
	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof messageSchema>) => {
		try {
			setIsSubmitting(true)
			const payload = {
				username: username,
				content: data.content
			}
			const response = await axios.post("/api/message/send", payload)
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>
			let errorMsg = axiosError.response?.data.message
			console.log(errorMsg)
			toast({
				title: "Error occured while sending your feedback message",
				description: errorMsg,
				variant: "destructive"
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		isAcceptingMessage ?
		(
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
					<div className="text-center">
						<h1 className="text-xl font-extrabold tracking-tight mb-6">Send Your Feedback to {username}</h1>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								name="content"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea disabled={!isAcceptingMessage} placeholder="Type your message here..." {...field}/>
										</FormControl>
										<FormDescription className="inset-x-0">
											A feedback message of min 10 characters and maximum 300 characters
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button type="submit" disabled={isSubmitting || !isAcceptingMessage}>Send</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Feedback sent Anonymously 🎉🤐</AlertDialogTitle>
										<AlertDialogDescription>
											Your feedback to {username} was sent succesfully.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<Link href={"/"}><AlertDialogAction>Home</AlertDialogAction></Link>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</form>
					</Form>
				</div>
			</div>
		)
        :
		(
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
					<div className="text-center">
						<h1 className="text-xl font-extrabold tracking-tight mb-6">{username} is not accepting feedback anymore!!</h1>
					</div>
				</div>
			</div>
		)
  	)
}

export default MessagePage;

