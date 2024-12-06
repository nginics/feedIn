import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import ApiResponse from "@/helpers/apiResponse";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    // console.log("Server Session: ", session);
    
    const sessionUser: User = session?.user as User;

    if (!session || !session.user) {
        return new ApiResponse(false, "Not Authenticated", 401).send();
    }

    const userId = new mongoose.Types.ObjectId(sessionUser._id);    

    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
            
        ])
        // console.log("Aggregated messages: ", user[0]?.messages);
        
        if (!user) {
            return new ApiResponse(false, "User not found", 401).send();
        }
        return new ApiResponse(true, "Fetched all messages", 200).add("messages", user[0]?.messages).send();

    } catch (error) {
        console.log("An unexpected error occured:", error);
        return new ApiResponse(false, "An unexpected error occured", 500).send();
    }
}