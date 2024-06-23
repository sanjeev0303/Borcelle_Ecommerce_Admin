import dbConnect from "@/lib/DatabaseConnection";
import Collection from "@/lib/models/CollectionSchema";
import Product from "@/lib/models/ProductSchema";
import { auth } from "@clerk/nextjs/server";
import { useParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await dbConnect();

    const collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(collection), { status: 200 });
  } catch (error) {
    console.error("[collectionId_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (
    req: NextRequest,
    { params }: { params: { collectionId: string } }
  ) => {
    try {
      await dbConnect();
  
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      let collection = await Collection.findById(params.collectionId);
  
      if (!collection) {
        return NextResponse.json(
          { message: "Collection not found" },
          { status: 404 }
        );
      }
  
      const { title, description, image } = await req.json();
  
      if (!title || !image) {
        return new NextResponse("Title and image are required", { status: 400 });
      }
  
      collection = await Collection.findByIdAndUpdate(
        params.collectionId,
        { title, description, image },
        { new: true }
      );
  
      await collection?.save();
  
      return NextResponse.json(collection, { status: 200 });
    } catch (error) {
      console.error("[collectionId_POST]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await dbConnect();

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await Collection.findByIdAndDelete(params.collectionId);

    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } }
    )

    return new NextResponse("Collection is Deleted", { status: 200 });
  } catch (error) {
    console.error("[collectionId_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
