import dbConnect from "@/lib/DatabaseConnection";
import Customer from "@/lib/models/CustomerSchema";
import Order from "@/lib/models/OrderSchema";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const POST = async (req: NextRequest) => {
  try {
    console.log("Checkpoint 1: Received request");

    const rawBody = await req.text();
    console.log("Checkpoint 2: Raw body received");

    const signature = req.headers.get("Stripe-Signature") as string;
    console.log("Checkpoint 3: Stripe signature received");

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Checkpoint 4: Stripe event constructed", event);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("Checkpoint 5: Checkout session completed", session);

      const customerInfo = {
        clerkId: session?.client_reference_id,
        name: session?.customer_details?.name,
        email: session?.customer_details?.email,
      };
      console.log("Checkpoint 6: Customer info extracted", customerInfo);

      const shippingAddress = {
        street: session?.shipping_details?.address?.line1,
        city: session?.shipping_details?.address?.city,
        state: session?.shipping_details?.address?.state,
        postalCode: session?.shipping_details?.address?.postal_code,
        country: session?.shipping_details?.address?.country,
      };
      console.log("Checkpoint 7: Shipping address extracted", shippingAddress);

      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"] }
      );
      console.log("Checkpoint 8: Session retrieved from Stripe", retrieveSession);

      const lineItems = retrieveSession?.line_items?.data;
      console.log("Checkpoint 9: Line items retrieved", lineItems);

      const orderItems = lineItems?.map((item: any) => {
        return {
          product: item.price.product.metadata.productId,
          color: item.price.product.metadata.color || "N/A",
          size: item.price.product.metadata.size || "N/A",
          quantity: item.quantity,
        };
      });
      console.log("Checkpoint 10: Order items mapped", orderItems);

      await dbConnect();
      console.log("Checkpoint 11: Database connected");

      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId,
        products: orderItems,
        shippingAddress,
        shippingRate: session?.shipping_cost?.shipping_rate,
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      });
      console.log("Checkpoint 12: New order created", newOrder);

      await newOrder.save();
      console.log("Checkpoint 13: New order saved");

      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });
      console.log("Checkpoint 14: Customer lookup", customer);

      if (customer) {
        customer.orders.push(newOrder._id);
        console.log("Checkpoint 15: Existing customer updated", customer);
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        });
        console.log("Checkpoint 16: New customer created", customer);
      }

      await customer.save();
      console.log("Checkpoint 17: Customer saved");
    }

    return new NextResponse("Order created", { status: 200 });
  } catch (error) {
    console.log("[webhooks_POST]", error);
    return new NextResponse("Failed to create the order", { status: 500 });
  }
};