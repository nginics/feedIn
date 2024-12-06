import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import authOptions from "../../../auth/[...nextauth]/options";
import ApiResponse from "@/helpers/apiResponse";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ messageid: string }> }){
    const messageId = (await params).messageid
    
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return new ApiResponse(false, "Not Authenticated", 401).send();
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull:{ messages: { _id: messageId } }}
        )

        if(updatedResult.modifiedCount == 0) {
            return new ApiResponse(false, "Message not found or already deleted", 404).send();
        }

        return new ApiResponse(true, "Message Deleted", 200).send();
        
    } catch (error) {
        console.log("Error in delete message route: ", error);
        return new ApiResponse(false, "Error deleting message", 500).send();
    }

}