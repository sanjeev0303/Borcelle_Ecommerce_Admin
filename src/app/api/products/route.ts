import dbConnect from "@/lib/DatabaseConnection";
import Collection from "@/lib/models/CollectionSchema";
import Product from "@/lib/models/ProductSchema";
import { auth } from "@clerk/nextjs/server";
import { renderToHTML } from "next/dist/server/render";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    await dbConnect();

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized User", { status: 403 });
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

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create product", {
        status: 404,
      });
    }

    const newProduct = await Product.create({
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
    });

    await newProduct.save();

    

    return new NextResponse(JSON.stringify(newProduct), { status: 200 });
  } catch (error) {
    console.error("[products_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// if (collections) {
    //   for(const collectionId of collections){
    //     const collection = await Collection.findById(collectionId);
    //     if (collection) {
    //       collection.products.push(newProduct._id)
    //       await collection.save()
    //     }
    //   }
    // }

   
    export const GET = async (req: NextRequest) => {
      // const res = new NextResponse();
      // res.headers.set('Access-Control-Allow-Origin', '*');
      // res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      // res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
      try {
        await dbConnect();
    
        const products = await Product.find()
          .sort({ createdAt: "desc" })
          .populate({ path: "collections", model: Collection });

          const response = NextResponse.json(products, { status: 200 });
        response.headers.set('Access-Control-Allow-Origin', '*');
    
          return response
      } catch (err) {
        console.log("[products_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
      }
    };
// export const dynamic = "force-dynamic";
