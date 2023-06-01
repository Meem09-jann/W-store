"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FC } from "react";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const pages: {
  name: string;
  link: string;
}[] = [
  {
    name: "User Login",
    link: "/user-signin",
  },
  // {
  //   name: "Save lists",
  //   link: "/account-savelists",
  // },
  {
    name: "Vendor Login",
    link: "/vendor-signin",
  },
  // {
  //   name: "Change password",
  //   link: "/account-password",
  // },
  // {
  //   name: "Change Billing",
  //   link: "/account-billing",
  // },
];

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [fullname, setFullname] = useState('');
  

    useEffect(() => {
       setFullname(cookies?.profile?.fullname);
    }, [cookies]);

  return (
    <div className="nc-AccountCommonLayout container">
      <div className="mt-10 sm:mt-20">
        <div className="max-w-4xl mx-auto">
          
            <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
                {pages.map((item, index) => {
                return (
                    <Link
                    key={index}
                    href={item.link}
                    className={`block py-2 md:py-2 border-b-2 flex-shrink-0 text-sm sm:text-base ${
                        pathname === item.link
                        ? "border-primary-500 font-medium text-slate-900 dark:text-slate-200"
                        : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                    >
                    {item.name}
                    </Link>
                );
                })}
            </div>
          
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-15 pb-15 lg:pb-15">
        {children}
      </div>
    </div>
  );
};

export default CommonLayout;
