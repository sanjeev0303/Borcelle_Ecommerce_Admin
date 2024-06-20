"use client";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

// these imports are for form
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// this import is for text area
import { Textarea } from "@/components/ui/textarea";

// this import is for upload images
import toast from "react-hot-toast";
import ImageUpload from "../custum ui/ImageUpload";
import Delete from "../custum ui/Delete";

// this is a form schema
const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(500).trim(),
  image: z.string(),
});

interface CollectionFormProps {
  initialData?: CollectionType | null; // Must have "?" to make it optional
}

const CollectionForm: React.FC<CollectionFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const url = initialData
        ? `/api/collections/${initialData._id}`
        : "/api/collections";

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setLoading(false);
        router.push("/collections");
        toast.success(`Collection ${initialData ? "updated" : "created"}`);
        window.location.href = "/collections";
      }
    } catch (error) {
      console.error("[Collections_POST]", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <>
      <div className="p-10">
        {initialData ? (
          <div className="flex items-center justify-between">
            <p className="text-heading2-bold">Edit Collection</p>
            <Delete id={initialData._id} />
          </div>
        ) : (
          <p className="text-heading2-bold">Create Collection</p>
        )}

        <Separator className="bg-grey-1 mt-4 mb-7" />

        {/* this form input is for Title */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* this form input is for description  */}
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} rows={5} onKeyDown={handleKeyPress} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* this form input is for image  */}
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-10">
              <Button type="submit" className="bg-blue-1 text-white">
                Submit
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/collections")}
                className="bg-red-1 text-white-1"
              >
                Discard
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CollectionForm;