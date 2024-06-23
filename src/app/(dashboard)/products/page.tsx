"use client";

import { ProductType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/custum ui/Loader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custum ui/DataTable";
import { useRouter } from "next/navigation";
import { columns } from "@/components/products/ProductColumns";

const Products = () => {

  const router = useRouter()

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");

      console.log("res:", res);

      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error("[products_GET]", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="px-10 py-5">
          <div className="flex items-center justify-between">
            <p className="text-heading2-bold">Products</p>
            <Button
              className="bg-blue-1 text-white-1"
              onClick={() => router.push("/products/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Product  
            </Button>
          </div>

          <Separator className="mt-4 mb-7 bg-grey-1" />

          <DataTable columns={columns} data={products} searchKey="title" />
        </div>
      )}
    </>
  );
};

export default Products;
