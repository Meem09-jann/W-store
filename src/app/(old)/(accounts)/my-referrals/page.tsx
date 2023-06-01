"use client";
import ProductCard from "@/components/ProductCard";
import AddressCard from "@/components/AddressCard";
import ChildCard from "@/components/ChildCard";
import { PRODUCTS } from "@/data/data";
import Button from "@/shared/Button/Button";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Link from "next/link";
import RefferalTable from "@/components/DataTable/RefferalTable";
async function getRefferals(jwtToken: string) {

  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/referral`;

  const res = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch address list');
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

const AccountSavelists = () => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/login');
    }
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
    }

    getRefferals(cookies.jwtToken)
      // getRefferals("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJGREFvc1kwc215Z3YiLCJyb2xlIjoiVVNFUiIsInByb3ZpZGVySWQiOiJwaG9uZSIsImZlZGVyYXRlZElkIjoiKzg4MDExMjIzMzQ0MjQiLCJpYXQiOjE2ODQ3MzY1MTMsImV4cCI6MTY4NTM0MTMxM30.QjA0gAoWH3YfyzHuyQUkG7p-5S9Rzl_rBpm43dQqnuc", "FDAosY0smygv")
      .then((data) => {
        setChild(data.output);
      })
      .catch((error) => {
        throw error;
      });

  }, [cookies, router, userId]);
  if (!child) {
    return <div>Loading</div>
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="grid grid-cols-1 gap-6">
        {/* <ChildCard data={
          child
        } /> */}
        <RefferalTable
          data={child}
        />

      </div>

    </div>
  );

};

export default AccountSavelists;
