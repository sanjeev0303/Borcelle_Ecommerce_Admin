'use client'

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from 'react-hot-toast';  


interface DeleteProps {
  id: string;
}

const Delete: React.FC<DeleteProps> = ({id}) => {

  const [loading, setLoading] = useState(false)

  const onDelete = async()=>{
    try {

      setLoading(true)

      const res = await fetch(`/api/collections/${id}`,{
        method: "DELETE"
      })

      if (res.ok) {
        setLoading(false)
        window.location.href = ("/collections")
        toast.success("Collection Deleted")
      }
      
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again.")
    }
  }


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='bg-red-500 text-white'>
          <Trash className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white text-gray-700'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-red-500'>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className='bg-red-500 text-white' onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;