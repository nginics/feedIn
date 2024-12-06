import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schema/signUpSchema";

const userNameValidationQuery = z.object({
    username: userNameValidation
})

export async function GET(request: Request) {
    
    await dbConnect();

    try {
        const queryParams = {
            username: new URL(request.url).searchParams.get('username'),
        }
        console.log(queryParams)
        const result = userNameValidationQuery.safeParse(queryParams)

        if(!result.success){
            
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameter",
            }, {status: 400})
        } else {
            const username = result.data.username;
            const existingVerifiedUserByUsername = await UserModel.findOne({
                username,
                isVerified: true,
            })
    
            if (existingVerifiedUserByUsername){
                return Response.json({
                    success: false,
                    message: "User with this username already exists"
                }, {status: 404})
            } else {
                return Response.json({
                    success: true,
                    message: "Username available"
                }, {status: 200})
            }
        }
    } catch (error) {
        console.error("Error fetching username ", error);
        return Response.json({
            success: false,
            message: "Error fetcing usernames"
        }, {status: 500})
    }
}