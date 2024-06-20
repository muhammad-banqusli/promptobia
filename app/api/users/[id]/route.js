import { connectToDB } from "@utils/database";
import User from "@models/user";

export const GET = async (request, { params }) => {
    console.log(params.id)
    try {
        await connectToDB();
        
        const user = await User.findById(params.id);
        console.log(user)
        if (!user) return new Response("User not found", { status: 404 });

        return new Response(JSON.stringify(user), {
            status: 200,
        });
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
};
