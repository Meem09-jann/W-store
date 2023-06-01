'use client';
import React, { FC } from "react";
import facebookSvg from "@/images/Facebook.svg";
import twitterSvg from "@/images/Twitter.svg";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


import { useCookies } from 'react-cookie';

// const loginSocials = [
//   {
//     name: "Continue with Facebook",
//     href: "#",
//     icon: facebookSvg,
//   },
//   {
//     name: "Continue with Twitter",
//     href: "#",
//     icon: twitterSvg,
//   },
//   {
//     name: "Continue with Google",
//     href: "#",
//     icon: googleSvg,
//   },
// ];
async function loginWithPassword(identifier: string, password: string, role: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/password-login`;
  //const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/login`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
        role,
      }),
    });

    const response = await res.json();
    if (response?.status == 'success') {
      return response;
    } else if (response?.message) {
      return alert(response?.message);
    }

    throw new Error('failed to login');
  } catch (error) {
    throw error;
  }
}
const PageLogin = () => {
  const router = useRouter();
  const [identifier, setidentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');


  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);

  // useEffect(() => {
  //     if (!cookies.jwtToken) {
  //         return router.push('/user-signin');
  //     }
  // }, [cookies, router]);

  async function handleLogin(e) {
    e.preventDefault()
    if (!identifier || !password) return;
    const response = await loginWithPassword(identifier, password, role);
    if (response?.status != 'success') {
      return;
    }

    const maxAge = 5 * 24 * 60 * 60; /* 5 days */
    let time = Math.floor(Date.now() / 1000);
    let token = 'wliveshopping' + time;

    setCookie('jwtToken', response.output.jwtToken, { domain: '.18mall.shop', path: '/', maxAge });
    setCookie('refreshToken', response.output.refreshToken, { domain: '.18mall.shop', path: '/', maxAge });
    setCookie('profile', JSON.stringify(response.output.profile), { domain: '.18mall.shop', path: '/', maxAge });
    //setCookie('sessionId', response.output.token,{ domain: '.18mall.shop', path: '/', maxAge });

    return router.push('/');

  }
  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">

        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          ログイン
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            {/* {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <Image
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                  sizes="40px"
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))} */}
          </div>
          {/* OR */}
          {/* <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div> */}
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Eメール
              </span>
              <Input
                type="text"
                placeholder="Eメール"
                className="mt-1"
                required
                onChange={(e) => setidentifier(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                パスワード
                {/* <Link href="/forgot-pass" className="text-sm text-green-600">
                  Forgot password?
                </Link> */}
              </span>
              <Input type="password" className="mt-1" required
                onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleLogin(e)}>Signin</button>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            新規会員? {` `}

            <Link className="text-green-600" href={{ pathname: '/user-signup', query: { refferalId: '' } }}>

              アカウント作成
            </Link>
            {/* <Link className="text-green-600" href="/signup">

              Create an account
            </Link> */}
          </span>
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            
            
            <Link className="text-green-600" href={{ pathname: '/user-forgetpwd', query: { role: 'USER'} }}>

              Forget Password ?
            </Link>
            {/* <Link className="text-green-600" href="/signup">

              Create an account
            </Link> */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
