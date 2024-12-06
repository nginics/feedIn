import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                
                await dbConnect();
                
                try {
                    const user = await UserModel.findOne({
                        email: credentials.email,
                    })

                    if (!user) throw new Error("No User found with this email");
                    
                    if (!user.isVerified) throw new Error("Email not verified");

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Incorrect Password");
                    }

                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    
    pages: {
        signIn: '/signin',
    },
    
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7
    },
    
    secret: process.env.NEXTAUTH_SECRET,
    
    callbacks: {
        async jwt({ token, user }) {
            
            if(user) {
                token._id = user._id?.toString();
                token.isAcceptingMessages = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            
            if(token) {
                session.user._id = token._id?.toString();
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        }
    },
}

export default authOptions;