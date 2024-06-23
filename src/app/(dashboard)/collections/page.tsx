'use client'

import { columns } from '@/components/collections/CollectionColumn'
import { DataTable } from '@/components/custum ui/DataTable'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import axios from 'axios'

const page = () => {

  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [colletions, setColletions] = useState([])

  const getCollections = async()=>{
    try {
      const res = await axios.get("/api/collections") 
     
      setColletions(res.data)
      setLoading(false)

      // console.log(data);
      

    } catch (error) {
      console.error("[collections_GET]", error)
    }
  }

  useEffect(() => {
    getCollections()
  }, [])
  
  // console.log(colletions);
  

  return (
    <div className='px-10 py-5'>

    <div className='flex items-center justify-between'>
      <p className="text-heading2-bold">Collections</p>
      <Button className='bg-blue-1 text-white-1' onClick={()=> router.push("/collections/new")}>
        <Plus className='h-4 w-4 mr-2'/>
        Create New Collection
      </Button> 
    </div>

    <Separator className='mt-4 mb-7 bg-grey-1' />

      <DataTable columns={columns} data={colletions} searchKey="title" />
    </div>
  )
}

export default page