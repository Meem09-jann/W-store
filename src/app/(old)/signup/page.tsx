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
import PhoneInput from 'react-phone-input-2'

async function userSignup(username: string, password:string, fullname:string,mobile:string,address:string,account:string,gender:string,code:string,email:string,dob:string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/signup`;

  try {
      const res = await fetch(url, {
          cache: 'no-store',
          method: 'POST',
          headers: {
              'content-type': 'application/json',
          },
          body: JSON.stringify({
            username, password, fullname,mobile,address,account,gender,code,email,dob
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
const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Continue with Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageSignUp = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setCPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [mobile, setIdentifier] = useState('');
  const [address, setAddress] = useState('');
  const [account, setAccount] = useState('');
  const [gender, setGender] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [passwordValidate, setPasswordValidate] = useState('');
  async function handleSignup(e) {
    
    e.preventDefault()
    if (password.length<8) {
      return alert('password must be 8 characters');
      //return setPasswordValidate('password did not matched');
    }
    if (password != confirmPassword) {
      return alert('password did not matched');
      //return setPasswordValidate('password did not matched');
    }
      if (!username || !password || !code) return;
      const response = await userSignup(username, password, fullname,mobile,address,account,gender,code,email,dob);
      if (response?.status != 'success') {
          return;
      }

      // const maxAge = 5 * 24 * 60 * 60; /* 5 days */
      // let time = Math.floor(Date.now() / 1000);
      // let token = 'wliveshopping'+time;

      // setCookie('jwtToken', response.output.jwtToken, {domain: '.18mall.shop', path: '/', maxAge });
      // setCookie('refreshToken', response.output.refreshToken, { domain: '.18mall.shop', path: '/', maxAge });
      // setCookie('profile', JSON.stringify(response.output.profile), { domain: '.18mall.shop', path: '/', maxAge });
      //setCookie('sessionId', response.output.token,{ domain: '.18mall.shop', path: '/', maxAge });

      return router.push('/');
      
  }
  
  return (
    <div className={`nc-PageSignUp `} data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                ID
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input
                type="text"
                placeholder="User ID"
                className="mt-1"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input name="password" type="password" className="mt-1"
              placeholder="User Password"
              minLength={8}
              required
                onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
              Confirm Password
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input name="confirmPassword" type="password" className="mt-1"
              placeholder="Confirm Password"
              minLength={8}
              required
                onChange={(e) => setCPassword(e.target.value)} />
            </label>
            <label className="block">{passwordValidate && <label className="block text-red-600">{passwordValidate}</label>}</label>
            
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Account Number
              </span>
              <Input
                type="text"
                placeholder="Please enter your account no"
                className="mt-1"
                onChange={(e) => setAccount(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Full Name
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input
                type="text"
                placeholder="Please enter your fullname"
                className="mt-1"
                required
                onChange={(e) => setFullname(e.target.value)}
              />
              </label>
              <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                email
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input
                type="email"
                placeholder="Please enter your email address"
                className="mt-1"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Mobile Number
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              
              <Input
                type="text"
                placeholder="Please enter your mobile no"
                className="mt-1"
                required
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Address
              </span>
              <Input
                type="text"
                placeholder="Please enter your address"
                className="mt-1"
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>
          
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Refferer Code
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input
                type="text"
                placeholder="Please enter your refferer code"
                className="mt-1"
                required
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Date Of Birth
              </span>

              <span className="text-red-600 dark:text-red-600">
                *
              </span>

              <Input
                type="date"
                placeholder="Please enter your date of birth"
                className="mt-1"
                onChange={(e) => setDob(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Gender
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <select
                            
                  name="gender"
                  id="role"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  onChange={(e) => setGender(e.target.value)}
              >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
              </select>
            </label>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleSignup(e)}>Create Account</button>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link className="text-green-600" href="/login">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
