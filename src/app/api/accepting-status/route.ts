import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import ApiResponse from "@/helpers/apiResponse";
import { log } from "console";

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
        const updatedUser = UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, {new: true});
        if(!updatedUser) {
            return new ApiResponse(false, "Error updating user", 401).send();
        }
        
        return new ApiResponse(false, "User accepting status updated successfully", 200).add("user", updatedUser).send();
    } catch (error) {
        console.error("Error updating user ", error);
        return new ApiResponse(false, "Error updating user", 500).send();
    }
}

export async function GET(request: Request){
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new ApiResponse(false, "Not Authenticated", 401).send();
    }

    const userId = user._id;

    try {
        await dbConnect();
        const fetchedUser = await UserModel.findById(userId);
        
        if(!fetchedUser){
            return new ApiResponse(false, "User Not Found", 404);
        }

        return new ApiResponse(true, "Successfully Fetched User details", 200).add("isAcceptingMessages", fetchedUser.isAcceptingMessage).send();

    } catch (error) {
        console.log("Error fetching user accepting status", error);
        return new ApiResponse(false, "Error fetching user accepting status", 500);
    }
}