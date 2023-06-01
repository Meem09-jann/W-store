'use client'
import React, { FC } from "react";
import Pagination from "@/shared/Pagination/Pagination";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import SectionSliderCollections from "@/components/SectionSliderLargeProduct";
import SectionPromo1 from "@/components/SectionPromo1";
// import StoreProductCard from "@/components/StoreProductCard";
import { PRODUCTS } from "@/data/data";
import TabFilters from "@/components/TabFilters";
import DiscoverMoreSlider from "@/components/DiscoverMoreSlider";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import ProductCard from "@/components/ProductCard";
import HistoryProductCard from "@/components/HistoryProductCard";

async function getSearchHistory(jwtToken: string, user_id: string, limit: number = 100, offset: number = 0,) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/searchHistory/searchHistory`;
    const fetchdata = {
    "limit": limit,
    "offset": offset,
    "userId": user_id
  }
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(fetchdata),
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      "x-access-token": jwtToken,
    },
  });
  console.error("search history list error", res)
  if (!res.ok) {
    // throw new Error('Failed to fetch wish list');
  }

  try {
    const data = await res.json();
    const { status, message } = data;
    if (status == 'failed') {
      console.error("search history list error", message)
      // throw new Error(message);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

const SearchHistory = () => {

  const router = useRouter();
  const [historydata, setHistoryData] = useState<any>(null);
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  useEffect(() => {
    if (!cookies.jwtToken) {
        return router.push('/login');
    }

    getSearchHistory(cookies?.jwtToken, cookies.profile?.userId,)

      .then((data) => {
        setHistoryData(data.output);
      })
      .catch((error) => {
        throw error;
      });

  }, [cookies, router]);
  if (!historydata) {
    return <div>Loading</div>
  }
  const renderSection1 = () => {
    return (
      <div className="space-y-10 sm:space-y-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Search History
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {historydata.map((item, index) => (
            <HistoryProductCard data={item} key={index} />
          ))}
        </div>
        {/* <div className="flex !mt-20 justify-center items-center">
          <ButtonSecondary loading>Show me more</ButtonSecondary>
        </div> */}
      </div>
    );
  };

  return renderSection1();
};

export default SearchHistory;
