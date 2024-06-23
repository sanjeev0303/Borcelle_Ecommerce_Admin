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
import axios from 'axios';


interface DeleteProps {
  id: string;
  item: string;
}

const Delete: React.FC<DeleteProps> = ({id, item}) => {

  const [loading, setLoading] = useState(false)

  const onDelete = async()=>{
    try {

      setLoading(true)

      const itemType = item === "product" ? "products" : "collections"

      const res = await axios.delete(`/api/${itemType}/${id}`)

      if (res) {
        setLoading(false)
        window.location.href = (`/${itemType}`)
        toast.success(`${item} Deleted Successfully`)
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
            This action cannot be undo. This will permanently delete your collection.
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