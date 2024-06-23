"use client";

import Loader from "@/components/custum ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import { ProductType } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";


const ProductDetails = ({params}: {params: { productId: string }}) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(null);

  const getProductDetails = async () => {
    try {
      setLoading(true)
      const res = await axios.get<ProductType>(`/api/products/${params.productId}`);

      if (!res) {
        throw new Error(`HTTP error! there is bad response`);
      }

      setProductDetails(res.data);
      setLoading(false);
    } catch (error) {
      console.error("[GET_ProductDetails]", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
    // console.log("productDetails: ", productDetails);
  }, [params.productId]);
  

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <ProductForm initialData={productDetails} />
      )}
    </div>
  );
}

export default ProductDetails