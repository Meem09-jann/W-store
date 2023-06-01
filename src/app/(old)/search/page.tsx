'use client'
import React, { FC } from "react";
import Pagination from "@/shared/Pagination/Pagination";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import SectionSliderCollections from "@/components/SectionSliderLargeProduct";
import SectionPromo1 from "@/components/SectionPromo1";
import HeaderFilterSearchPage from "@/components/HeaderFilterSearchPage";
import Input from "@/shared/Input/Input";
import ButtonCircle from "@/shared/Button/ButtonCircle";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/data";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

async function getSearchedProduct(jwtToken: string, query: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/search/product?lang=kr&search=${query}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "x-access-token": jwtToken,
    },
  });

  try {
    const data = await res.json();
    const { status, message } = data;
    if (status == "failed") {
      throw new Error(message);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

const PageSearch = ({}) => {

  const params = useSearchParams();
  const router = useRouter();
  const query = (params.get("query"));
  const [product, setProduct] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies([
    "jwtToken",
    "refreshToken",
    "profile",
  ]);

  useEffect(()=>{
    
    getSearchedProduct(cookies.jwtToken, query as any).then((data) => {
     console.log(data.output)
     setProduct(data.output)
    });

  }, [])
 
  if(product)
  return (
    <div className={`nc-PageCollection`}>
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
           見つかった製品
            
            </h2>
            
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />
          <main>
            {/* TABS FILTER */}
            {/* <TabFilters /> */}
            {/* <div className="mt-2 lg:mt-2">
              <DiscoverMoreSlider />
        
            </div> */}
            {/* LOOP ITEMS */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
              {(product as any).map((item, index) => (
                <ProductCard data={item} key={index} />
              ))}
            </div>

            {/* PAGINATION */}
            {/* <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
              <Pagination />
              <ButtonPrimary loading>Show me more</ButtonPrimary>
            </div> */}
          </main>
        </div>

        {/* === SECTION 5 === */}
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" /> */}

        {/* SUBCRIBES */}
        <SectionPromo1 />
      </div>
    </div>
  );
};

export default PageSearch;
