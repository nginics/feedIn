import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import ApiResponse from "@/helpers/apiResponse";

export async function POST(request: Request){

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new ApiResponse(false, "Not Authenticated", 401).send();
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        await dbConnect();
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, {new: true}).select('isAcceptingMessage').exec();
        
        if(!updatedUser) {
            return new ApiResponse(false, "Error updating user", 401).send();
        }
        
        return new ApiResponse(true, "User accepting status updated successfully", 200).add("user", updatedUser).send();
    } catch (error) {
        console.error("Error updating user ", error);
        return new ApiResponse(false, "Error updating user", 500).send();
    }
}

export async function GET(request: Request){

    try {
        await dbConnect();
        
        const queryParams = {
            username: new URL(request.url).searchParams.get('username'),
        }
        console.log("Username Params:", queryParams)

        if (!queryParams?.username) {
            try {
                const session = await getServerSession(authOptions);
                const user: User = session?.user as User;

                console.log("Session", session)

                if (!session || !user) {
                    return Response.json({
                        success: false,
                        message: "Not Authenticated",
                    }, { status: 402 })
                }

                const userId = user._id;
                const fetchedUser = await UserModel.findById(userId);
                
                if(!fetchedUser){
                    return Response.json({
                        success: false,
                        message: "User not found",
                    }, { status: 404 })
                }

                return Response.json({
                    success: true,
                    message: "Successfully Fetched User details",
                    isAcceptingMessage: fetchedUser.isAcceptingMessage,
                }, { status: 200 })
    
            } catch (error) {
                console.log("Internal Server Error", error);
                return Response.json({
                    success: false,
                    message: "Internal Server Error",
                }, { status: 500 })
            }
        }

        const username = queryParams.username

        const user = await UserModel.findOne({username})
        
        if(!user){
            return Response.json({
                success: false,
                message: `User ${username} not found`,
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Successfully Fetched User details",
            isAcceptingMessage: user.isAcceptingMessage,
        }, { status: 200 })
        
    } catch (error) {
        console.log("Internal Server Error", error);
        return Response.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500 })
    }
}