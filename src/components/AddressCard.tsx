"use client";

import React, { FC, useState } from "react";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { Product, PRODUCTS } from "@/data/data";
import { StarIcon } from "@heroicons/react/24/solid";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import BagIcon from "./BagIcon";
import toast from "react-hot-toast";
import { Transition } from "@/app/(old)/headlessui";
import ModalQuickView from "./ModalQuickView";
import ProductStatus from "./ProductStatus";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import NcImage from "@/shared/NcImage/NcImage";
import { color } from "framer-motion";

export interface AddressCardProps {
  data?: any;
  
}
const AddressCard = ({
    data
  }) => {
    
      

  return (
    <>
  
            {data.map((item, index) => (
                      
              
                
                // eslint-disable-next-line react/jsx-key
                <div className="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
        
                    <div>
                        <h5 className="text-gray-800 font-semibold">宛名: {item.addlebel}</h5>
                        <h5 className="text-gray-800 font-semibold">{item.name}</h5>
                        <h5 className="text-gray-800 font-semibold">{item.mobile}</h5>
                        <p className="mt-2 text-gray-600">住所: {item.area}</p>
                        <p className="mt-2 text-gray-600">郵便番号： {item.postcode}</p>
                        <p className="mt-2 text-gray-600">詳細: {item.addDetails}</p>
                        {/* <h5 className="text-gray-800 font-semibold">Default Address: {item.defaultAddress}</h5> */}
                    </div>
                    {/* <div className="flex justify-end mt-4">
                        <a href="#" className="text-xl font-medium text-indigo-500">John Doe</a>
                    </div> */}
                </div>
              
            ))}
            
          

    
    </>
  );
};

export default AddressCard;
