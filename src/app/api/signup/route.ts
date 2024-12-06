import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { log } from "console";

export async function POST(req: Request): Promise<Response>{
    await dbConnect()

    try {
        const {username, email, password} = await req.json();
        let registeredUser;
        
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if(existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "Username already taken",
            }, { status: 400 })
        }
        
        const existingUserByEmail = await UserModel.findOne({email})        
        const verificationCode = Math.floor(Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Account with this email already exists",
                }, { status: 400 })
            } else {
                const hashedPass = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 24);

                existingUserByEmail.password = hashedPass;
                existingUserByEmail.verifyCode = verificationCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate

                await existingUserByEmail.save();

            }
        } else {
            const hashedPass = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 24)

            const newUser = new UserModel ({
                username,
                email,
                password: hashedPass,
                verifyCode: verificationCode, 
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })

            registeredUser = await newUser.save()
        }
        
        // ==============================
        // TODO: UnComment later
        
        //send verification email
        // const emailResponse = await sendVerificationEmail(email, username, verificationCode)

        // if (!emailResponse.success) {
        //     return Response.json({
        //         success: false,
        //         message: emailResponse.message,
        //     }, { status: 500 })
        // }
        // ================================
        
        return Response.json({
            success: true,
            message: "User Registerd Successfully. Verification Email Sent",
            id: registeredUser?._id,
        })

    } catch (error) {
        console.error("Error registering user ", error);
        return Response.json({
            success: false,
            message: "Error registering user",
        }, { status: 500 })
    }
}
