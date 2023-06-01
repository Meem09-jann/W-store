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
import { useSearchParams } from 'next/navigation';


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
async function resetPassword(password:string, email: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/resetPassword`;
  //const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/login`;

  try {
      const res = await fetch(url, {
          cache: 'no-store',
          method: 'POST',
          headers: {
              'content-type': 'application/json',
          },
          body: JSON.stringify({
            email,password,
              
          }),
      });

      const response = await res.json();
      if (response?.status == 'success') {
          return response;
      } else if (response?.message) {
          return alert(response?.message);
      }

      throw new Error('failed to reset');
  } catch (error) {
      throw error;
  }
}
const PageResetPassword = () => {
    let searcParam = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>(searcParam.get('email') as any);
  const [password, setPassword] = useState('');
  const [confirmPassword, setCPassword] = useState('');
  
  

  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);

  

  async function handleForgetPwd(e) {
    e.preventDefault()
      if (!password) return;
      if (password != confirmPassword) {
        return alert('password did not matched');
      }
      const response = await resetPassword(password,email);
      if (response?.status != 'success') {
          return;
      }

      
      return router.push('/user-signin');
      
  }
  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
      
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Reset Password
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          
          
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
              Input your new password
              </span>
              <Input
                type="password"
                placeholder="password"
                className="mt-1"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
              Confirm password
              </span>
              <Input
                type="password"
                placeholder="confirm password"
                className="mt-1"
                required
                onChange={(e) => setCPassword(e.target.value)}
              />
            </label>
            
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleForgetPwd(e)}>Send</button>
          </form>

          
          
        </div>
      </div>
    </div>
  );
};

export default PageResetPassword;
