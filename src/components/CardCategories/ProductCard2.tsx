import React, { FC } from "react";
import NcImage from "@/shared/NcImage/NcImage";
import Link from "next/link";
import { StaticImageData } from "next/image";
import Prices from "@/components/Prices";
import DisPrices from "@/components/DisPrices";

export interface ProductCard2Props {
  className?: string;
  ratioClass?: string;
  bgClass?: string;
  id: number;
  productId: string;
  price: any;
  disPrice: any;
  discount: any
  featuredImage: string;
  name: string;
  desc: string;
}

const ProductCard2 = ({
  className = "",
  ratioClass = "aspect-w-1 aspect-h-1",
  bgClass = "bg-orange-50",
  id,
  productId,
  price,
  disPrice,
  discount,
  featuredImage,
  name,
  desc,
}) => {
  return (
    <Link
      href={`/productDetails/` + id + `/` + productId}

      className={`nc-CardCategory2 ${className}`}
      data-nc-id="CardCategory2"
    >
      <div
        className={`flex-1 relative w-full h-0 rounded-2xl overflow-hidden group ${ratioClass} ${bgClass}`}
      >
        <div className="pt-0">
          <NcImage
            alt=""
            containerClassName="w-full h-full flex justify-center"
            src={featuredImage}
            width={376} height={300}
            className="rounded-2xl"
            sizes="400px"
          />
        </div>
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>
      <h2 className="mt-5 text-base sm:text-sm text-neutral-900 dark:text-neutral-100 font-semibold">
        {name}
      </h2>
      <div className="mt-5 flex flex-col text-start items-start flex-wrap">

        <Prices
          contentClass="py-1 pr-2 md:py-1.5 md:pr-3 text-lg font-semibold"
          price={disPrice}
        />
        <div className="flex items-center text-base ">
          <div className="">{discount}%</div>
          <DisPrices
            contentClass="py-1 md:py-1.5 px-2  md:px-3 font-semibold"
            price={price}
          />
        </div>

      </div>
    </Link>
  );
};

export default ProductCard2;
