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

export interface ChildCardProps {
  data?: any;

}
const ChildCard = ({
  data
}) => {

  console.log("Ref card data", data)

  return (
    <>

      {data?.map((item, index) => (



        // eslint-disable-next-line react/jsx-key
        <div className="w-full py-4 px-8 bg-white shadow-lg rounded-lg flex justify-around">



          <img src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}` + item?.photoURL}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover z-0 mr-3" />
          <h5 className="text-gray-800 font-semibold">Name: {item?.fullname}</h5>
          <h5 className="text-gray-800 font-semibold">Contact Number: {item?.identifier}</h5>

          {/* <h5 className="text-gray-800 font-semibold">Default Address: {item.defaultAddress}</h5> */}

          {/* <div className="flex justify-end mt-4">
                        <a href="#" className="text-xl font-medium text-indigo-500">John Doe</a>
                    </div> */}
        </div>

      ))}




    </>
  );
};

export default ChildCard;
