"use client";

import React from "react";
//import { usePathname } from "next/navigation";
import HeaderLogged from "@/components/Header/HeaderLogged";
import Header from "@/components/Header/Header";
import { useCookies } from 'react-cookie';

const SiteHeader = () => {
  //let pathname = usePathname();

  //return pathname === "/" ? <Header /> : <HeaderLogged />;
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  //let userId = cookies.profile.userId;
  return cookies.profile === undefined ? <Header /> : <HeaderLogged />;
};

export default SiteHeader;
