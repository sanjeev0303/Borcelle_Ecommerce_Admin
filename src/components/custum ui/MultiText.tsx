"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { X } from "lucide-react";


interface MultiTextProps {
  placeholder: string;
  value?: string[];
  onChange: (value?: string) => void;
  onRemove: (value?: string) => void;
}

const MultiText: React.FC<MultiTextProps> = ({
  placeholder,
  value = [],
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");

  const addTags = (item: string) => {
    onChange(item);
    setInputValue("");
  };
  

  return (
    <>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTags(inputValue);
          }
        }}
      />

      <div className="flex gap-1 flex-wrap mt-4">
        {value.map((tag, index) => (
          <Badge key={index} className="bg-grey-1 text-white-1 ">
            {tag}
            <button
              className="ml-2 rounded-full outline-none hover:bg-red-1 "
              onClick={() => onRemove(tag)}
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
};

export default MultiText;
