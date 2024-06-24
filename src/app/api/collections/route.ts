import dbConnect from "@/lib/DatabaseConnection";
import Collection from "@/lib/models/CollectionSchema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        await dbConnect();

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized User", { status: 403 });
        }

        const { title, description, image } = await req.json();

        const existingCollection = await Collection.findOne({ title });

        if (existingCollection) {
            return new NextResponse("Collection already exists", { status: 400 });
        }

        if (!title || !image) {
            return new NextResponse("Title and image are required", { status: 400 });
        }

        const newCollection = await Collection.create({
            title,
            description,
            image,
        });

        await newCollection.save();

        return new NextResponse(JSON.stringify(newCollection), { status: 200 });
    } catch (error) {
        console.error("[collections_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};




export const GET = async (req: NextRequest) => {
    try {
        await dbConnect();

        const collections = await Collection.find().sort({ createdAt: "desc" });

        const response = NextResponse.json(collections, { status: 200 });
        response.headers.set('Access-Control-Allow-Origin', '*');
        // response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        // response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    } catch (error) {
        console.error("[collections_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};