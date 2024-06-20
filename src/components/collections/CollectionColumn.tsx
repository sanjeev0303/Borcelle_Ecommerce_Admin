"use client"

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custum ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<CollectionType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (<Link href={`/collections/${row.original._id}`} className="hover:text-red-1">{row.original.title}</Link>),
    },
    {
        accessorKey: "product",
        header: "Products",
        cell: ({ row }) => {
            const products = row.original.products || []; // Provide a default value
            return <p>{products.length}</p>;
        },
    },
    {
        id: "action",
        cell: ({ row }) => <Delete id={row.original._id} />,
    },
];