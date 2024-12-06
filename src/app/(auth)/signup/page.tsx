'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schema/signUpSchema";
import axios, {AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const page = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isValidUsername, setIsValidUsername] = useState(false);
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	// const [canSubmit, setCanSubmit] = useState(false);
	const { toast } = useToast();
	const router = useRouter();
	const debouncedUsername = useDebounceCallback(setUsername, 800);

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: '',
			email: '',
			password: ''
		},
	})

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage('');
				setIsValidUsername(false);

				try {
					//TODO: console and study response object 
					const response = await axios.get(`/api/username/isunique?username=${username}`);
					setUsernameMessage(response.data.message);
					setIsValidUsername(true);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>
					setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
					setIsValidUsername(false);
				} finally {
					setIsCheckingUsername(false)
				}
			}
		}
		checkUsernameUnique();
	}, [username])

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => { //TODO: console "data"
		setIsSubmitting(true)
		try {
			const response = await axios.post<ApiResponse>("/api/signup", data);
			toast({
				title: 'Success',
				description: response.data.message
			})
			
			router.replace(`/verify/${username}`);
		
		} catch (error) {
			console.error("Error while signing up", error);
			const axiosError = error as AxiosError<ApiResponse>
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Sign Up failed",
				description: errorMessage,
				variant: "destructive"
			})
		
		} finally {
			setIsSubmitting(false);
		}
	}

	// const canSubmit = () => {
	//   if (!email || !password) {
	//     return false;
	//   }
	//   return true;
	// }


	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join FeedIn</h1>
					<p className="mb-4">Sign Up to start your anonymous adventure.</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
							<FormItem className="relative">
								<FormLabel className="font-bold">Username</FormLabel>
								<FormControl>
									<Input placeholder="Username" {...field} 
										value={username}
										onChange={(e) => {
											field.onChange(e)
											debouncedUsername(e.target.value)
											setUsername(e.target.value.trim())
										}}
									/>
								</FormControl>
								{isCheckingUsername && <Loader2 className="animate-spin absolute right-0"/ >}
								{username && <p className={`text-xs tracking-wide font-thin absolute right-0 ${usernameMessage === "Username is unique" ? "text-green-300" : "text-red-800"}`}>
									{ usernameMessage }
								</p>}
								<FormMessage />
							</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
							<FormItem>
								<FormLabel className="font-bold">Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="Email" {...field} disabled={!isValidUsername}
										// value={email}
										// onChange={(e) => setEmail(e.target.value)}
									/>
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
									<Input type="password" placeholder="Password" {...field} disabled={!isValidUsername}
									// value={password}
									// onChange={(e) => setPassword(e.target.value)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
							)}
						/>
						<Button type="submit" disabled={isSubmitting}>
							{
								isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
									</>
								) : ("Sign Up")
							}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Already a member?{" "}
						<Link href="/signin" className="text-blue-600 hover:text-blue-800">Sign In</Link>
					</p>
				</div>
			</div>
		</div>
	)
}

export default page;