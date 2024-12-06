'use client'

import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/schema/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SignIn = ({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined}> }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const { toast } = useToast();
	const wasRedirected = use(searchParams).redirectFromMW === 'true'

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		}
	})

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		setIsSubmitting(true)		
		const response = await signIn('credentials', {
			redirect: false,
			password: data.password,
			email: data.email
		})
		
		if(response?.error){
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
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">{wasRedirected && 'To Coninue,'} Sign In</h1>
                    <p className="mb-4">Sign In to start your anonymous adventure.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Email</FormLabel>
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
                                    <FormLabel className="font-bold">Password</FormLabel>
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
                <div className="text-center mt-4">
					<p>
						Not a member?{" "}
						<Link href="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
					</p>
				</div>
            </div>
		</div>
	)
}

export default SignIn;