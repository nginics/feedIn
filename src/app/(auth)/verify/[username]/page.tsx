'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schema/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{username: string}>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verificationCode: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post("/api/verify", {
                username: params.username,
                verificationCode: data.verificationCode
            })

            toast({
                title: "Success",
                description: response.data.message
            })

            router.replace("/signin");
        } catch (error) {
            console.error("Error while signing up", error);
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: "Verification Failed",
                description: errorMessage,
                variant: "destructive"      
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Account</h1>
                    <p className="mb-4">Enter the verification code sent to your registered email.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="verificationCode"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="verification code..." {...field} />
                                    </FormControl>
                                    <FormDescription className="inset-x-0">
                                        A 6 digit verification code.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount;