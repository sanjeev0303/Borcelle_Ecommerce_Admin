import dbConnect from "@/lib/DatabaseConnection";
import Collection from "@/lib/models/CollectionSchema";
import Product from "@/lib/models/ProductSchema";
import { auth } from "@clerk/nextjs/server";
import { useParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await dbConnect();

    const product = await Product.findById(params.productId).populate({ path: "collections", model: Collection })

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (error) {
    console.error("[productId_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (
    req: NextRequest,
    { params }: { params: { productId: string } }
  ) => {
    try {
      await dbConnect();
  
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      let product = await Product.findById(params.productId);
  
      if (!product) {
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      }
  
      const {
        title,
        description,
        media,
        category,
        collections,
        tags,
        sizes,
        colors,
        price,
        expense,
      } = await req.json();
  
      const addedCollections = collections.filter(
        (collectionId: string) => !product.collections.includes(collectionId)
      );
      // included in new data, but not included in the previous data
  
      const removedCollections = product.collections.filter(
        (collectionId: string) => !collections.includes(collectionId)
      );
      // included in previous data, but not included in the new data
  
      // Update collections
      await Promise.all([
        // Update added collections with this product
        ...addedCollections.map((collectionId: string) =>
          Collection.findByIdAndUpdate(collectionId, {
            $push: { products: product._id },
          })
        ),
  
        // Update removed collections without this product
        ...removedCollections.map((collectionId: string) =>
          Collection.findByIdAndUpdate(collectionId, {
            $pull: { products: product._id },
          })
        ),
      ]);
  
      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
        product._id,
        {
          title,
          description,
          media,
          category,
          collections,
          tags,
          sizes,
          colors,
          price,
          expense,
        },
        { new: true }
      ).populate({ path: "collections", model: Collection });
  
      await updatedProduct.save();
  
      return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
      console.error("[productId_POST]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };

  export const DELETE = async (
    req: NextRequest,
    { params }: { params: { productId: string } }
  ) => {
    try {

      await dbConnect()

      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const product = await Product.findById(params.productId);
  
      if (!product) {
        return new NextResponse(
          JSON.stringify({ message: "Product not found" }),
          { status: 404 }
        );
      }
  
      await Product.findByIdAndDelete(product._id);
  
      // Update collections
      await Promise.all(
        product.collections.map((collectionId: string) =>
          Collection.findByIdAndUpdate(collectionId, {
            $pull: { products: product._id },
          })
        )
      );
  
      return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
        status: 200,
      });
    } catch (err) {
      console.log("[productId_DELETE]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  };