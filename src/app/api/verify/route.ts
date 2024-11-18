import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schema/verifySchema"


export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, code} = await request.json();
        const user = await UserModel.findOne({username: username});
        
        if(!user){
            return Response.json({
                success: false,
                message: "User not found or Username is Blank."
            }, {status: 404})
        }
        
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) >= new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            
            return Response.json({
                success: true,
                message: "Email Verified Successfully"
            }, {status: 200})
        } else if (!isCodeValid) {
            return Response.json({
                success: false,
                message: "Verification Code Incorrect or is Blank"
            }, {status: 400})
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification Code Expired. Please Sign Up again."
            }, {status: 400})
        } else {
            return Response.json({
                success: false,
                message: "Error Verifying Email. Please check username or code."
            }, {status: 400})
        }        
        
    } catch (error) {
        console.error("Error while verifying user", error);
        return Response.json({
            success: false,
            message: "Error while verifying user"
        })
    }

}