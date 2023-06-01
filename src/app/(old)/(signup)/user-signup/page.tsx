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
import 'react-phone-input-2/lib/style.css'
import { useSearchParams } from 'next/navigation';

import clsx from 'clsx'

import { useCookies } from 'react-cookie';




async function userSignup(username: string, password: string, fullname: string, mobile: string, building: string, address: string, postCode: number, account: string, gender: string, code: string, email: string, dob: string, verificationCode: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/signup`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username, password, fullname, mobile, building, address, postCode, account, gender, code, email, dob, verificationCode
      }),
    });

    const response = await res.json();
    return response
    
  } catch (error) {
    throw error;
  }
}



async function requestVerify(email: string, role: string, referCode: string): Promise<any> {
  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}`;
  const url = `${API_BASE}/users/request-verify`;

  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email,
          type: 'REGISTRATION',
          role,
          referCode
      }),
  });

  const data = await response.json();

  if (data.status != 'success') {
      throw new Error(data.message || 'failed to request verification code');
  }

  return data.output;
}

async function verifyOtp(email: string, mobile: string, verificationCode: string): Promise<any> {
  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}`;
  const url = `${API_BASE}/users/verify`;

  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email,
          mobile,
          verificationCode,
      }),
  });

  const data = await response.json();

  if (data.status != 'success') {
      throw new Error(data.message || 'failed to verify');
  }

  return data.output;
}


const phoneInputStyle = {
  //border: '2px solid gray',
  borderRadius: '16px',
  width: "100%",
  height: '44px',
  backgroundColor: 'rgb(255 255 255)',

};
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

type STEPS = 'DETAILS' | 'OTP';

const PageSignUp = () => {
  let searcParam = useSearchParams();
  const router = useRouter();
  const role = 'USER'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setCPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [mobile, setIdentifier] = useState('+81');
  const [address, setAddress] = useState('');
  const [building, setBuilding] = useState('');
  const [postCode, setPostcode] = useState('');
  const [account, setAccount] = useState('');
  const [gender, setGender] = useState('');
  const [code, setCode] = useState<string>(searcParam.get('refferalId') as any);
  const [email, setEmail] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phone, setPhone] = useState('+81');
  const [dob, setDob] = useState('');
  const [passwordValidate, setPasswordValidate] = useState('');
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [verificationCode, setVerificationCode] = useState('');
  const [currentStep, setCurrentStep] = useState<STEPS>('DETAILS');


  const handleDetails = async (e) => {
    e.preventDefault();

    try {
        await requestVerify(email, role, code);

        setCurrentStep('OTP');
    } catch (error) {
        alert((error as any).message);
    }
};

const handleOtp = async (e) => {
  console.log(e)
    e.preventDefault();

    
    try {
      await verifyOtp(email, mobile, verificationCode);
    } catch (error) {
      alert((error as any).message);
      return;
    }
    
    try {
        await handleSignup(e)
    } catch (error) {
        alert((error as any).message);
        setCurrentStep('DETAILS')
    }
};

  async function checkPostCode(postcode) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/search/zipCode?code=${postcode}`;


    try {
      const res = await fetch(url, {
        cache: 'no-store',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'current-time': '1679295158878',
          'hash': '10762887ec43657efa603ab4f80e0a1818a12bcc51472afba76bc5b2d30b8640',
        },
      });

      const response = await res.json();
      if (response?.status == 'failed') {
        return alert(response?.message);
      } else {
        let newaddress = `${response.output?.[0]?.address1}, ${response.output?.[0]?.address2}`;
        setAddress(newaddress)
        setBuilding(response.output?.[0]?.address3)
      }

      // throw new Error('failed to reset');
    } catch (error) {
      throw error;
    }
  }
  async function checkAvailableUsername(username) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/checkUsername`;

    const res = await fetch(url, {
      method: 'POST',
      body: `{"username":"${username}"}`,
      headers: {
        'content-type': 'application/json',

      },
    });
    try {
      const data = await res.json();
      const { status, message } = data;
      if (status == 'fail') {
        alert(message);

      } else {
        alert(message);
      }

    } catch (error) {
      throw error;
    }

  }

async function checkAvailableEmail(email) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/checkEmail`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email,
      role: 'USER'
    }),
    headers: {
      'content-type': 'application/json',

    },
  });
  
  /* please use try catch */
  if (!res.ok) {
    throw new Error('not available')
  }

}

async function handleSignup(e) {

    e.preventDefault()

   

    const date = new Date().getTime()
    const age = ((date - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365))

    if (age < 18) {
      return alert('Must be at least 18 years old');
    }

    if (password.length < 8) {
      return alert('password must be 8 characters');
      //return setPasswordValidate('password did not matched');
    }
    if (password != confirmPassword) {
      return alert('password did not matched');
      //return setPasswordValidate('password did not matched');
    }

    // if (!username || !password || !code) return;

    const response = await userSignup(username, password, fullname, mobile, building, address, parseInt(postCode), account, gender, code, email, dob, verificationCode);
    
    if (response?.status != 'success') {
      throw new Error(response.message)
    }

    const maxAge = 5 * 24 * 60 * 60; /* 5 days */
    let time = Math.floor(Date.now() / 1000);
    let token = 'wliveshopping'+time;

    setCookie('jwtToken', response.output.jwtToken, {domain: '.18mall.shop', path: '/', maxAge });
    setCookie('refreshToken', response.output.refreshToken, { domain: '.18mall.shop', path: '/', maxAge });
    setCookie('profile', JSON.stringify(response.output.profile), { domain: '.18mall.shop', path: '/', maxAge });
    //setCookie('sessionId', response.output.token,{ domain: '.18mall.shop', path: '/', maxAge });

    return router.push('/');

  }

  

  return (
    <div className={`nc-PageSignUp `} data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          ユーザー登録
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">

          {/* FORM */}
       
          <form className={clsx("grid-cols-1 gap-6 ", currentStep == 'DETAILS'? 'grid' : 'hidden')} action="#" method="post" onSubmit={(e) => handleDetails(e)}>
            {/* <label className="block">
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
            <button className="bg-blue-500 w-[200px] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={(e) => {
              e.preventDefault()
              checkAvailableUsername(username)
              
            }} >Available?</button> */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                メールアドレス
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
                onBlur={async()=> {
                    try {
                      await checkAvailableEmail(email)
                      setEmailInvalid(false)
                    } catch (error) {
                      setEmailInvalid(true)
                      
                    }
                }}
              />

              {emailInvalid && 
                (<p className="text-red-600 dark:text-red-600">
                  * email not available
                </p>)
              }
            </label>
   

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                パスワード
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input name="password" type="password" title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters" className="mt-1"
                placeholder="User Password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                required
                onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                確認 パスワード
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input name="confirmPassword" type="password" title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters" className="mt-1"
                placeholder="Confirm Password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                required
                onChange={(e) => setCPassword(e.target.value)} />
            </label>
            <label className="block">{passwordValidate && <label className="block text-red-600">{passwordValidate}</label>}</label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                口座番号
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
                お名前
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
                連絡先
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <PhoneInput
                inputStyle={phoneInputStyle}
                country={'jp'}
                value={mobile}
                onChange={value => setIdentifier(value)}
              />

              {/* <Input
                type="text"
                placeholder="Please enter your mobile no"
                className="mt-1"
                required
                onChange={(e) => setIdentifier(e.target.value)}
              /> */}
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                郵便番号
              </span>
              <Input
                type="text"
                placeholder="Please enter your postcode"
                className="mt-1"
                onChange={(e) => setPostcode(e.target.value)}
              />
            </label>
            {postCode &&
              <button className="bg-blue-500 w-[200px] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={(e) => {
                e.preventDefault()
                checkPostCode(postCode)

              }} >Check Address</button>
            }

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                建物
              </span>
              <Input
                type="text"
                placeholder="Please enter your building name"
                className="mt-1"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                詳細住所
              </span>
              <Input
                type="text"
                placeholder="Please enter your detail address"
                className="mt-1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </label>


            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                紹介者コード
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input
                type="text"
                placeholder="Please enter your refferer code"
                className="mt-1"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                年度-月-日
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
                性別
              </span>

              <select

                name="gender"
                id="role"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">性別を選択して下さい</option>
                <option value="Male">男性</option>
                <option value="Female">女性</option>
                <option value="Other">その他</option>
              </select>
            </label>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" >Create Account</button>
          </form>
        

          {currentStep == 'OTP' && (
            <div className="max-w-md mx-auto space-y-6">
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
                <div className="flex m-auto gap-4">
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => {
                  setCurrentStep('DETAILS')
                }}>Back</button>
                <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleOtp(e)}>Next</button>
                  
                </div>
              </form>
            </div>
          )}

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            すでにアカウントをお持ちですか？ {` `}
            <Link className="text-green-600" href="/login">
              サインイン
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
