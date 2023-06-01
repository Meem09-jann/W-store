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
import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  LineShareButton,
  LineIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from 'next-share';
import ModalConfirmDeactivation from "@/components/Modal/ModalConfirmDeactivation";

async function deactivateAccount(userId: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/deactivateAccount`;
  //const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/login`;
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        userId

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

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const pages: {
  name: string;
  link: string;
}[] = [
    {
      name: "私の情報",
      link: "/my-info",
    },
    {
      name: "お届け先の住所",
      link: "/account-address",
    },
    {
      name: "注文履歴",
      link: "/account-order",
    },
    {
      name: "ウィッシュリスト",
      link: "/my-wishlist",
    },
    {
      name: "私の紹介",
      link: "/my-referrals",
    },
    {
      name: "Search History",
      link: "/search-history",
    },
  ];


const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [fullname, setFullname] = useState('');
  const [userId, setuserId] = useState('');
  const [refcode, setRefCode] = useState('');
  const [copied, setCopied] = useState(false);

  const [refName, setRefName] = useState('');
  const [refImage, setRefImage] = useState('');


  const [isOpenModalConfirmDeactivation, setIsOpenModalConfirmDeactivation] =
    useState(false);

  async function getMyRefferer(jwtToken: string, user_id: any) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/profile/myRefferer`;
    const getdata = {
      "userId": user_id,
    }
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(getdata),
      headers: {
        "content-type": "application/json",
        "x-access-token": jwtToken,
      },
    });

    try {
      const data = await res.json();

      const { status, message } = data;
      if (status == "failed") {

        return { status, message };
      }
      return data.output;
    } catch (error) {
      throw error;
    }
  }

  const onCopy = React.useCallback(() => {
    setCopied(true);
  }, [])

  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/login');
    }
    setFullname(cookies?.profile?.fullname);
    setRefCode(cookies?.profile?.referCode);
    setuserId(cookies?.profile?.userId);


  }, [cookies, router]);


  useEffect(() => {
    getMyRefferer(cookies.jwtToken, cookies?.profile?.userId)

      .then((data) => {
        setRefName(data.referer)
        setRefImage(data.proPic)
      });

  }, []);

  let defaultimg = `https://dyez0ftqpcowi.cloudfront.net/web/assets/slider/37KZ7raEY2_No-Image-Placeholder.svg.png`;
  let proRefPic = process.env.NEXT_PUBLIC_IMAGE_BASE + refImage;
  let proRefPic1 = refImage ? proRefPic : defaultimg;
  let link = 'http://store.18mall.shop/user-signup?refferalId=' + refcode;

  async function handleDeactivateAccount(id) {

    const response = await deactivateAccount(userId);
    if (response?.status != 'success') {
      setIsOpenModalConfirmDeactivation(false)
      return;
    }


    removeCookie('jwtToken', { domain: '.18mall.shop', path: '/' });
    removeCookie('refreshToken', { domain: '.18mall.shop', path: '/' });
    removeCookie('profile', { domain: '.18mall.shop', path: '/' });
    //removeCookie('sessionId', { path: '/' });

    return router.push('/user-signin');

  }
  return (

    <div className="nc-AccountCommonLayout container">

      <div className="mt-10 sm:mt-20">
        <div className="max-w-8xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl xl:text-4xl font-semibold">アカウント</h2>
            <span className="block mt-5 text-neutral-500 dark:text-neutral-400 text-base sm:text-[25px]">
              <span className="text-slate-900 dark:text-slate-200 font-semibold">
                {fullname}
              </span>{" "}

            </span>
          </div>
          <div className="max-w-2xl ">
            <div className="flex mt-9 mb-5 items-center">
              <p className="text-md font-semibold"> 私の紹介者: </p>
              <Image
                src={proRefPic1}
                alt="avatar"
                width={100}
                height={100}
                className="w-8 h-8 rounded-full object-cover z-0 mx-2"
              />

              <span className="text-slate-900 dark:text-slate-200 font-semibold text-lg">
                {refName}
              </span>{" "}

            </div>

            <div className="bg-[#F3F2F8] py-[10px] px-[22px] my-4 rounded-[30px] flex w-fit">
              <span className="block  text-neutral-950 dark:text-neutral-400 text-md font-semibold ">
                紹介者コード: </span>
              {link}
            </div>
          </div>
          {/* <div className="max-w-2xl">
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
              
              Share Link:
            </span>
          </div> */}
          <div className="my-2 flex">
            <div className="mr-4">
              <FacebookShareButton
                url={link} >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </div>

            <div className="mr-4">
              <LineShareButton
                url={link} >
                <LineIcon size={32} round />
              </LineShareButton>
            </div>
            <div className="mr-4">
              <LinkedinShareButton
                url={link} >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>
            <div className="mr-4">
              <EmailShareButton
                url={link} >
                <EmailIcon size={32} round />
              </EmailShareButton>
            </div>
          </div>


          <section className="section mt-10">


            <CopyToClipboard onCopy={onCopy} text={link}>
              <button className="bg-[#DF519C] hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2">リンクをコピー</button>
            </CopyToClipboard>
            <button className="bg-[#454545] hover:bg-blue-500 text-white font-bold py-2 px-4 ml-3 rounded" type="submit" onClick={() => setIsOpenModalConfirmDeactivation(true)}>アカウントを無効化し</button>

            <ModalConfirmDeactivation
              data={userId}
              onclick={handleDeactivateAccount}
              show={isOpenModalConfirmDeactivation}
              onCloseModalConfirmDeactivation={() => setIsOpenModalConfirmDeactivation(false)}
            />

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
