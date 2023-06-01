'use client'
import React from "react";
import NavigationItem from "./NavigationItem";
import { NAVIGATION_DEMO_2 } from "@/data/navigation";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

async function getCategory(jwtToken: string, limit: number = 10, offset: number = 0, sortBy: string = "id", sortType: string = "desc", lang: string = 'en') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/category/catList`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"lang":"${lang}","limit":"${limit}","offset":"${offset}","sortBy":"${sortBy}","sortType":"${sortType}"}`,
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch category list');
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
function Navigation() {
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  useEffect(() => {
    // if (!cookies.jwtToken) {
    //     return router.push('/login');
    // }

    getCategory(cookies.jwtToken)
      .then((data) => {
        setCategory(data.output);
      })
      .catch((error) => {
        throw error;
      });

  }, [cookies, router]);
  if (!category) {
    return <div>Loading</div>
  }
  return (
    <ul className="nc-Navigation flex items-center">
      {category.map((item, index) => (
        <NavigationItem key={index} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
