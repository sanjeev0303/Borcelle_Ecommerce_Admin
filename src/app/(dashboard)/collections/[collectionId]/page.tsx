"use client";

import CollectionForm from "@/components/collections/CollectionForm";
import Loader from "@/components/custum ui/Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { CollectionType } from "@/lib/types";

const CollectionDetails = ({
  params,
}: {
  params: { collectionId: string };
}) => {
  const [loading, setLoading] = useState(true);
  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null);

  // console.log("Initial collectionDetails:", collectionDetails);

  const getCollectionDetails = async () => {
    try {
      const res = await axios.get<CollectionType>(`/api/collections/${params.collectionId}`);

      if (!res) {
        throw new Error(`HTTP error! there is no any response`);
      }

      
      // console.log("Fetched data:", data);
      // console.log("Response object:", res);

      setCollectionDetails(res.data);
      setLoading(false);
    } catch (error) {
      // console.error("[GET_CollectionDetails]", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("Fetching collection details for ID:", params.collectionId);
    getCollectionDetails();
  }, [params.collectionId]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <CollectionForm initialData={collectionDetails} />
      )}
    </div>
  );
};

export default CollectionDetails;