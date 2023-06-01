"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FC } from "react";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRouter } from 'next/navigation';
import Image from "next/image";



export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const pages: {
  name: string;
  link: string;
}[] = [
    {
      name: "Comission",
      link: "/my-comission",
    },
    {
      name: "Bonus",
      link: "/my-bonus",
    },
    {
      name: "Point",
      link: "/my-point",
    }
    // {
    //   name: "Change Billing",
    //   link: "/account-billing",
    // },
  ];


const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [userId, setuserId] = useState('');
  const [bonus, setBonus] = useState(0);
  const [kpoint, setKpoint] = useState(0);





  async function getBonusComission(jwtToken: string, user_id?: any) {
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



  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/user-login');
    }

    setuserId(cookies?.profile?.userId);


  }, [cookies, router]);


  useEffect(() => {
    getBonusComission(cookies.jwtToken, cookies?.profile?.userId)

      // getBonusComission("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJGREFvc1kwc215Z3YiLCJyb2xlIjoiVVNFUiIsInByb3ZpZGVySWQiOiJwaG9uZSIsImZlZGVyYXRlZElkIjoiKzg4MDExMjIzMzQ0MjQiLCJpYXQiOjE2ODQ3MzY1MTMsImV4cCI6MTY4NTM0MTMxM30.QjA0gAoWH3YfyzHuyQUkG7p-5S9Rzl_rBpm43dQqnuc")
      .then((data) => {
        // setBonus(data.referer+data.referer+data.referer)
        let comission = data.userCommissionWallet?.[0]?.commissionAmount || 0;
        let affilated = data.userBonuses?.[0]?.affiliate || 0;
        let leverage = data.userBonuses?.[0]?.leverage || 0;
        let kpooint = data.userKpoint || 0;

        setBonus(comission + affilated + leverage)

      });

  }, [cookies.jwtToken, cookies?.profile?.userId]);


  return (

    <div className="nc-AccountCommonLayout container">

      <div className="mt-10 sm:mt-20">
        <div className="max-w-8xl mx-auto">

          <div className="max-w-2xl flex">
            <div className="flex my-4 items-center mr-3">
              My Bonus:


              <span className="text-slate-900 dark:text-slate-200 font-semibold text-lg">
                {bonus}
              </span>

            </div>
            <div className="flex my-4 items-center">
              Available Point:


              <span className="text-slate-900 dark:text-slate-200 font-semibold text-lg">
                {kpoint}
              </span>

            </div>

          </div>
          {/* <div className="max-w-2xl">
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
              
              Share Link:
            </span>
          </div> */}



          <section className="section">




          </section>
          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

          <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
            {pages.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.link}
                  className={`block py-5 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base ${pathname === item.link
                    ? "border-primary-500 font-medium text-slate-900 dark:text-slate-200"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <hr className="border-slate-200 dark:border-slate-700"></hr>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        {children}
      </div>
    </div>
  );
};

export default CommonLayout;
