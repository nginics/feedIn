'use client'

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Example() {

	const { data: session } = useSession()

	return (
		<>
			<div className="relative isolate h-screen flex items-center">
				<div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
					<div
						style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
					/>
				</div>
				<div className="max-w-2xl mx-auto">
					<div className="text-center">
						<h1 className="text-5xl font-bold">
							Collect Anonymous Feedback
						</h1>
						<p className="mt-8 text-gray-500 text-justify">
							Allowing your audience to submit feedback anonymously encourages your friends, collegues, clients, or customers to be completely honest in their responses. More transparency in reviews will, in turn, allow your organization to make informed decisions and implement meaningful improvements.
						</p>
						<div className="mt-4">
							<Link href={session ? "/dashboard" : "/signup"}><Button>{session ? "Go to Dashboard": "Get Started"}</Button></Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
