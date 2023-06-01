import React, { FC } from "react";
import NcImage from "@/shared/NcImage/NcImage";
import Link from "next/link";
import { StaticImageData } from "next/image";

export interface CardCategory2Props {
  className?: string;
  ratioClass?: string;
  bgClass?: string;
  id: number;
  featuredImage: string;
  name: string;
  desc: string;
}

const BrandCard = ({
  className = "",
  ratioClass = "aspect-w-1 aspect-h-1",
  bgClass = "bg-orange-50",
  id,
  featuredImage,
  name,
  desc,
}) => {
  return (
    
      <><div
          className={`flex-1 relative w-full h-0 rounded-2xl overflow-hidden group ${ratioClass} ${bgClass}`}
      >
          <div className="pt-0">
              <NcImage
                  alt=""
                  containerClassName="w-full h-full flex justify-center"
                  src={featuredImage}
                  width={376} height={300}
                  className="rounded-2xl"
                  sizes="400px" />
          </div>
          <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div><div className="mt-5 flex-1 text-center">
              <h2 className="text-base sm:text-sm text-neutral-900 dark:text-neutral-100 font-semibold">
                  {name}
              </h2>
              <span className="block mt-0.5 sm:mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {desc}
              </span>
          </div></>
    
  );
};

export default BrandCard;
