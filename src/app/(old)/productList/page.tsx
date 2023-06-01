'use client'
import React, { FC } from "react";
import Pagination from "@/shared/Pagination/Pagination";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import SectionSliderCollections from "@/components/SectionSliderLargeProduct";
import SectionPromo1 from "@/components/SectionPromo1";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/data";
import TabFilters from "@/components/TabFilters";
import DiscoverMoreSlider from "@/components/DiscoverMoreSlider";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

async function getProductList(jwtToken: string,owner_id: string="",limit: number = 100, offset: number = 0,  sortBy: string = 'id', sortType: string = 'desc',role: string = 'USER') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/product/productList/en/android`;

  const res = await fetch(url, {
      method: 'POST',
      body: `{"limit":"${limit}","offset":"${offset}","owner_id":"${owner_id}","sortBy":"${sortBy}","sortType":"${sortType}","role":"${role}"}`,
      cache: 'no-store',
      headers: {
          'content-type': 'application/json',
      },
  });

  if (!res.ok) {
      throw new Error('Failed to fetch product list');
  }

  try {
      const data = await res.json();
      const { status, message } = data;
      if (status == 'failed') {
          throw new Error(message);
      }
      return data;
  } catch (error) {
      throw error;
  }
}

const PageCollection = ({ params }) => {

  const router = useRouter();
  const [productList, setproductList] = useState<any>(null);
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  useEffect(() => {
    // if (!cookies.jwtToken) {
    //     return router.push('/login');
    // }

    getProductList(cookies.jwtToken,params.ownerId,)
      .then((data) => {
        setproductList(data.output);
      })
      .catch((error) => {
          throw error;
      });
    
}, [cookies,params.ownerId,]);
if(!productList){
  return <div>Loading</div>
}
  return (
    <div className={`nc-PageCollection`}>
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {params.name} Products
            </h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              Products that makes your life easier. Happy shopping, happy life
            </span>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />
          <main>
            {/* TABS FILTER */}
            {/* <TabFilters /> */}
            {/* <div className="mt-2 lg:mt-2">
              <DiscoverMoreSlider />
        
            </div> */}
            {/* LOOP ITEMS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
              {productList.map((item, index) => (
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

export default PageCollection;
