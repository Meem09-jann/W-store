"use client";
import ProductCard from "@/components/ProductCard";
import AddressCard from "@/components/AddressCard";
import { PRODUCTS } from "@/data/data";
import Button from "@/shared/Button/Button";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Link from "next/link";
import CommissionTable from "@/components/DataTable/CommissionTable";

async function getBonusComission(jwtToken: string, user_id: any) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/profile/getMyBonus`;

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
    return data.output;
  } catch (error) {
    throw error;
  }
}

const AccountSavelists = () => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [userId, setuserId] = useState('');
  const router = useRouter();
  const [bonus, setBonus] = useState(undefined);
  const [date, setDate] = useState('');
  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/login');
    }

    setuserId(cookies?.profile?.userId);


  }, [cookies, router]);


  useEffect(() => {
    getBonusComission(cookies.jwtToken, cookies?.profile?.userId)

      .then((data) => {
        // setBonus(data.userCommissionWallet?.[0]?.commissionAmount || 0)
        // setDate(data.userCommissionWallet?.[0]?.date)
        setBonus(data.userCommissionWallet || 0)
      });

  }, [cookies.jwtToken, cookies?.profile?.userId]);
  if (bonus == undefined) {
    return <div>Loading</div>
  }
  const renderSection1 = () => {
    return (
      <div className="space-y-10 sm:space-y-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Comission:
          </h2>
          {/* {bonus} */}
          <CommissionTable data={bonus} />
        </div>



      </div>
    );
  };

  return renderSection1();
};

export default AccountSavelists;
