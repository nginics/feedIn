import ApiResponse from "@/helpers/apiResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    const { username, content } = await request.json();
    
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return new ApiResponse(false, "User not found", 404).send();
        }

        if(!user.isAcceptingMessage) {
            return new ApiResponse(false, "User is not accepting messages", 403).send();
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);

        await user.save();

        return new ApiResponse(true, "Message sent succesfully", 200).send();
    } catch (error) {
        console.log("Error sending messages: ", error);
        return new ApiResponse(false, "Internal Server Error", 500).send()
    }
}

