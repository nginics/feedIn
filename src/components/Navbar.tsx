"use client"

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {

    const { data: session } = useSession()
    const user: User = session?.user as User

    return (
        <header className="absolute top-0 w-full z-50">
            <nav>
                <div className="flex items-center justify-between p-6 lg:px-14">
                    <Link className="text-xl font-bold mb-4 md:mb-0" href="/">FeedIn</Link>
                    {
                        session ? (
                            <>
                                <span className="mr-4">Welcome, {user?.email}</span>
                                <div>
                                    <Button className="w-full md:w-auto" onClick={
                                        async () => {
                                            signOut({callbackUrl: "/"})
                                        } 
                                    } >Logout</Button>
                                </div>
                            </>
                        ) : (
                            
                            <Link href="/signin"><Button>Login</Button></Link>
                            
                        )
                    }
                </div>
            </nav>
        </header>
    )
}

// container mx-auto flex flex-col md:flex-row justify-between items-center
// p-4 md:p-6

export default Navbar;