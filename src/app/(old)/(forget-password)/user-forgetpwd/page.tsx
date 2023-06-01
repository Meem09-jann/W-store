'use client';
import React, { FC } from "react";
import facebookSvg from "@/images/Facebook.svg";
import twitterSvg from "@/images/Twitter.svg";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams} from 'next/navigation';
import { useEffect, useState } from 'react';


import { useCookies } from 'react-cookie';


async function requestVerify(email: string, role: string): Promise<any> {
  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}`;
  const url = `${API_BASE}/users/request-verify`;

  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email,
          type: 'FORGOT_PASSWORD',
          role
      }),
  });

  const data = await response.json();

  if (data.status != 'success') {
      throw new Error(data.message || 'failed to request verification code');
  }

  return data.output;
}

async function verifyOtp(email: string, verificationCode: string): Promise<any> {
  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}`;
  const url = `${API_BASE}/users/verify`;

  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email,
          verificationCode,
      }),
  });

  const data = await response.json();

  if (data.status != 'success') {
      throw new Error(data.message || 'failed to verify');
  }

  return data.output;
}

async function forgotPassword(email: string, password: string, verificationCode: string, role: string): Promise<any> {
  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}`;
  const url = `${API_BASE}/users/forgot-password`;

  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email,
          password,
          verificationCode,
          role
      }),
  });

  const data = await response.json();

  if (data.status != 'success') {
      throw new Error(data.message || 'password reset failed');
  }

  return data.output;
}

type STEPS = 'EMAIL' | 'OTP' | 'PASSWORD';


const PageForgetPassword = () => {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get('role') || 'USER'

  const [currentStep, setCurrentStep] = useState<STEPS>('EMAIL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
    
  

  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);

  

 const handleEmail = async (e) => {
        e.preventDefault();

        try {
            await requestVerify(email, role);

            setCurrentStep('OTP');
        } catch (error) {
          alert((error as any).message);
        }
    };

    const handleOtp = async (e) => {
        e.preventDefault();

        try {
            await verifyOtp(email, verificationCode);

            setCurrentStep('PASSWORD');
        } catch (error) {
          alert((error as any).message);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!password) return;
        if (password != confirmPassword) {
          return alert('password did not matched');
        }
        try {
            const { jwtToken, refreshToken, profile } = await forgotPassword(email, password, verificationCode, role);

            const maxAge = 5 * 24 * 60 * 60; /* 5 days */
            let time = Math.floor(Date.now() / 1000);
            let token = 'wliveshopping' + time;
        
            setCookie('jwtToken', jwtToken, { domain: '.18mall.shop', path: '/', maxAge });
            setCookie('refreshToken', refreshToken, { domain: '.18mall.shop', path: '/', maxAge });
            setCookie('profile', JSON.stringify(profile), { domain: '.18mall.shop', path: '/', maxAge });
        
            return router.push('/');
            
        } catch (error) {
            alert((error as any).message);
        }
    };


  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
      
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Forget Password
        </h2>

        {currentStep == 'EMAIL' && 
          (<div className="max-w-md mx-auto space-y-6">
            <form className="grid grid-cols-1 gap-6" action="#" method="post">
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                Input your email to reset your password
                </span>
                <Input
                  type="text"
                  placeholder="Email"
                  className="mt-1"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleEmail(e)}>Next</button>
            </form>
          </div>)
        }

        {currentStep == 'OTP' && 
          (<div className="max-w-md mx-auto space-y-6">
            <form className="grid grid-cols-1 gap-6" action="#" method="post">
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                Input your email verification code
                </span>
                <Input
                  type="number"
                  placeholder="verification code"
                  className="mt-1"
                  required
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </label>
              
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleOtp(e)}>Next</button>
            </form>
          </div>)}
        {currentStep == 'PASSWORD' &&  
          (<div className="max-w-md mx-auto space-y-6">
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
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
              
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleForgotPassword(e)}>Send</button>
            </form>
          </div>)}
      </div>
    </div>
  );
};

export default PageForgetPassword;
