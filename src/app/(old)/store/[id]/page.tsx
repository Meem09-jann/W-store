/* eslint-disable @next/next/no-img-element */
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
import { useSearchParams } from 'next/navigation';
import EmailIcon from "@/components/EmailIcon";
import ButtonCircles from "@/shared/Button/ButtonCircle";
import EmailCard from "@/components/EmailCard";
import BagIcon from "@/components/BagIcon";
import ChatCard from "@/components/ChatCard";
import Button from "@/shared/Button/Button";
async function getStoreProduct(jwtToken: string, id: string, limit: number = 100, offset: number = 0, sortBy: string = 'id', sortType: string = 'desc') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/store/getStoreHomeData`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"owner_id":"${id}","role":"VENDOR","limit":"${limit}","offset":"${offset}","sortBy":"${sortBy}","sortType":"${sortType}"}`,
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
  let searcParam = useSearchParams();
  const router = useRouter();
  const [storeData, setStoreData] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [showEmailCard, setShowEmailCard] = useState(false)
  const [showChatCard, setShowChatCard] = useState(false)
  useEffect(() => {
    // if (!cookies.jwtToken) {
    //     return router.push('/login');
    // }
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
    }
    
    getStoreProduct(cookies.jwtToken, params.id)
      .then((data) => {
        setStoreData(data.output);
      })
      .catch((error) => {
        throw error;
      });

  }, [cookies, userId, params.id]);
  if (!storeData) {
    return <div className="text-center">
      <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  }
  return (
    <div className={`nc-PageCollection`}>
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <div className="flex flex-wrap justify-left">
            
                <div className="w-2/12 px-4">
                  <img src={storeData?.proPic} alt="..." className="shadow-lg rounded-full max-w-full h-auto align-middle border-none" /> 
                </div>
                <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold mt-15">
                  {storeData?.storeName}
                  {/* Live */}
                  
                </h2>
                <div className=" flex justify-center m-auto gap-2">
           
            <button  
            onClick={()=>setShowEmailCard(true)} type="button" 
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none 
            focus:ring-4 focus:ring-gray-300 font-medium rounded-full 
            text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700
             dark:focus:ring-gray-700 dark:border-gray-700">Send Email</button>
            {/* <ButtonCircles
              className="flex-0"
              onClick={()=>setShowChatCard(true)}
            >
              <EmailIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            </ButtonCircles> */}
          </div>
            </div>
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
              {storeData?.storeProduct.map((item, index) => (
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
        {/* <hr className="border-slate-200 dark:border-slate-700" /> */}

        {/* <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" /> */}

        {/* SUBCRIBES */}
        {/* <SectionPromo1 /> */}
      </div>

      {
                showEmailCard && 
                <EmailCard
                receiverId= {params.id}
                productId={""}
                orderId={""}
                onClose={()=> setShowEmailCard(false)}
              />
              }
{/* 
{
                showChatCard && 
                <ChatCard
                product={""}
                onClose={()=> setShowChatCard(false)}
                />
              } */}
    </div>
  );
};

export default PageCollection;
