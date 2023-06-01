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
import ModalCommingSoon from "@/components/Modal/ModalCommingSoon";

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
      role: 'VENDOR'
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

async function userSignup(username: string, password: string, fullname: string, identifier: string, phoneNo: string, storeName: string, address: string, description: string, licenceNo: string, status: string, email: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/vendor/vendorCreate`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username, password, fullname, identifier, address, phoneNo, storeName, description, licenceNo, email, status
      }),
    });

    const response = await res.json();
    if (response?.status == 'success') {
      return response;
    } else if (response?.message) {
      return alert(response?.message);
    }

    throw new Error('failed to signup');
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
  const [identifier, setIdentifier] = useState('');
  const [phoneNo, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [licenceNo, setLicence] = useState('');
  //const [status, setStatus] = useState('Active');
  const [email, setEmail] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);

  const [passwordValidate, setPasswordValidate] = useState('');

  const [isOpenModalCommingSoon, setIsOpenModalCommingSoon] =
    useState(false);

  async function handleSignup(e) {
    e.preventDefault()
    // return alert('Comming Soon');
    setIsOpenModalCommingSoon(true)
    // const status = 'Active';
    // e.preventDefault()
    // if (password.length < 8) {
    //   return alert('password must be 8 characters');
    //   //return setPasswordValidate('password did not matched');
    // }
    // if (password != confirmPassword) {
    //   return alert('password did not matched');
    //   //return setPasswordValidate('password did not matched');
    // }
    // if (!username || !password || !identifier) return;
    // const response = await userSignup(username, password, fullname, identifier, phoneNo, storeName, address, description, licenceNo, status, email);
    // if (response?.status != 'success') {
    //   return;
    // }

    // return router.push('/');


    // const maxAge = 5 * 24 * 60 * 60; /* 5 days */
    // let time = Math.floor(Date.now() / 1000);
    // let token = 'wliveshopping'+time;

    // setCookie('jwtToken', response.output.jwtToken, {domain: '.18mall.shop', path: '/', maxAge });
    // setCookie('refreshToken', response.output.refreshToken, { domain: '.18mall.shop', path: '/', maxAge });
    // setCookie('profile', JSON.stringify(response.output.profile), { domain: '.18mall.shop', path: '/', maxAge });
    //setCookie('sessionId', response.output.token,{ domain: '.18mall.shop', path: '/', maxAge });

    //return alert(response?.message);

  }

  return (
    <div className={`nc-PageSignUp `} data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <ModalCommingSoon

          // onclick={handleDeactivateAccount}
          show={isOpenModalCommingSoon}
          onCloseModal={() => setIsOpenModalCommingSoon(false)}
        />
        <h2 className="my-10 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          ベンダー登録
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">

          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" action="#" method="post">
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
                Eメール
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
                onBlur={async () => {
                  try {
                    await checkAvailableEmail(email)
                    setEmailInvalid(false)
                  } catch (error) {
                    setEmailInvalid(true)

                  }
                }}
                disabled
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
              <Input name="password" type="password" className="mt-1"
                placeholder="User Password"
                minLength={8}
                required
                onChange={(e) => setPassword(e.target.value)} disabled />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                パスワードを認証する
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input name="confirmPassword" type="password" className="mt-1"
                placeholder="Confirm Password"
                minLength={8}
                required
                onChange={(e) => setCPassword(e.target.value)} disabled />
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                フルネーム
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
                disabled
              />
            </label>


            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                携帯電話番号
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
                disabled
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                電話番号
              </span>

              <Input
                type="text"
                placeholder="Please enter your phone no"
                className="mt-1"
                required
                onChange={(e) => setPhone(e.target.value)}
                disabled
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                店名
              </span>
              <Input
                type="text"
                placeholder="Please enter store name"
                className="mt-1"
                onChange={(e) => setStoreName(e.target.value)}
                disabled
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                店舗住所
              </span>
              <Input
                type="text"
                placeholder="Please enter store address"
                className="mt-1"
                onChange={(e) => setAddress(e.target.value)}
                disabled
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                店舗説明
              </span>
              <Input
                type="text"
                placeholder="Please enter store description"
                className="mt-1"
                onChange={(e) => setDescription(e.target.value)}
                disabled
              />
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                ライセンス番号
              </span>
              <span className="text-red-600 dark:text-red-600">
                *
              </span>
              <Input
                type="text"
                placeholder="Please enter your store licence number"
                className="mt-1"
                required
                onChange={(e) => setLicence(e.target.value)}
                disabled
              />
            </label>


            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleSignup(e)}>Create Account</button>
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            すでにアカウントをお持ちですか? {` `}
            <Link className="text-green-600" href={{ pathname: '/vendor-signin' }} target={"_blank"}>
              ログイン
            </Link>
            {/* <Link className={`inline-block text-green-600`} href="http://admin.18mall.shop" target={"_blank"}>
              Sign in
            </Link> */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
