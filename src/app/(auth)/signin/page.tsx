'use client'

import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/schema/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignIn = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: '',
			password: '',
		}
	})

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		setIsSubmitting(true)
		//TODO: 
		// response = { error, status, ok, url }
		const response = await signIn('credentials', {
			identifier: data.identifier,
			password: data. password,
			redirect: false
		})

		if(response?.error) {
			toast({
				title: "Login Failed",
				description: "Incorrect Username or Password",
				variant: "destructive"
			})
		}

		if(response?.url) {
			router.replace("/dashboard")
		}
		
		setIsSubmitting(false);
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Sign In</h1>
                    <p className="mb-4">Sign In to start your anonymous adventure.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
						<FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} >SignIn</Button>
                    </form>
                </Form>
            </div>
		</div>
	)
}

export default SignIn;