"use client";

import CollectionForm from "@/components/collections/CollectionForm";
import Loader from "@/components/custum ui/Loader";
import { useEffect, useState } from "react";

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
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // console.log("Fetched data:", data);
      // console.log("Response object:", res);

      setCollectionDetails(data);
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