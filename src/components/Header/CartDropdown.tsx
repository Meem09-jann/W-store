"use client";

import { Popover, Transition } from "@/app/(old)/headlessui";
import Prices from "@/components/Prices";
import { Product, PRODUCTS } from "@/data/data";
import { Fragment } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';
import {Context} from "@/context/Context"

async function getCartCount(jwtToken: string,userId: string,sessionId: string){
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/cartCount`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"userId":"${userId}","sessionId":"${sessionId}"}`,
    cache: 'no-store',
    headers: {
        'content-type': 'application/json',
    },
  });

  if (!res.ok) {
      throw new Error('Failed to fetch cart count');
  }

  try {
      const data = await res.json();
      const { status, message } = data;
      if (status == 'failed') {
          throw new Error(message);
      }
      return data;
  } catch (error) {
      throw error;
  }
}

async function getCart(jwtToken: string,userId: string,sessionId: string,limit: number = 100, offset: number = 0){
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/cartList`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"user_id":"${userId}","lang":"en","limit":"${limit}","offset":"${offset}","device":"android","role":"USER","sessionId":"${sessionId}"}`,
    cache: 'no-store',
    headers: {
        'content-type': 'application/json',
    },
  });

  if (!res.ok) {
      throw new Error('Failed to fetch product details');
  }

  try {
      const data = await res.json();
      const { status, message } = data;
      if (status == 'failed') {
          throw new Error(message);
      }
      return data;
  } catch (error) {
      throw error;
  }
}

export default function CartDropdown() {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile','sessionId']);
  const [userId, setUserId] = useState('');
  const [cart, setCart] = useState(null);
  const [ count, setCount ] = useContext(Context);
  const [update, setUpdate] = useState(0)
  const [total, setTotal] = useState(0)
  let sessionId = cookies.sessionId;
  console.log("cartdoropdow", count)

  if(Math.abs(update - count) > 0)
  {
    setUpdate(count)
  }
 
  useEffect(() => {
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
    }
    
    
    getCartCount(cookies.jwtToken,userId,sessionId)
      .then((data) => {
        setCount(data.output.count);
      })
      .catch((error) => {
          throw error;
      });

     
    
}, [cookies,userId,sessionId]);

useEffect(()=>{

  getCart(cookies.jwtToken,userId,sessionId)
  .then((data) => {
    setCart(data.output);
   
    let sum = 0
    for (let i = 0; i < data.output.length; i++) {
      sum += data.output[i]['total_price'];
    }

    setTotal(sum)
  })
  .catch((error) => {
      throw error;
  });

}, [update])

if(!count){
  return <></>
}
  // const renderProduct = (item: Product, index: number, close: () => void) => {
  //   const { name, price, image } = item;
  //   return (
  //     <div key={index} className="flex py-5 last:pb-0">
  //       <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
  //         <Image
  //           fill
  //           src={image}
  //           alt={name}
  //           className="h-full w-full object-contain object-center"
  //         />
  //         <Link
  //           onClick={close}
  //           className="absolute inset-0"
  //           href={"/product-detail"}
  //         />
  //       </div>

  //       <div className="ml-4 flex flex-1 flex-col">
  //         <div>
  //           <div className="flex justify-between ">
  //             <div>
  //               <h3 className="text-base font-medium ">
  //                 <Link onClick={close} href={"/product-detail"}>
  //                   {name}
  //                 </Link>
  //               </h3>
  //               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
  //                 <span>{`Natural`}</span>
  //                 <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
  //                 <span>{"XL"}</span>
  //               </p>
  //             </div>
  //             <Prices price={price} className="mt-0.5" />
  //           </div>
  //         </div>
  //         <div className="flex flex-1 items-end justify-between text-sm">
  //           <p className="text-gray-500 dark:text-slate-400">{`Qty 1`}</p>

  //           <div className="flex">
  //             <button
  //               type="button"
  //               className="font-medium text-primary-6000 dark:text-primary-500 "
  //             >
  //               Remove
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  const renderProduct = (item, index) => {
    const { image, price, name } = item;
    const cover_image = process.env.NEXT_PUBLIC_IMAGE_BASE+item.cover_image;
    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={cover_image}
            fill
            alt={item.name}
            className="h-full w-full object-contain object-center"
            sizes="150px"
          />
          {/* <Link href="/product-detail" className="absolute inset-0"></Link> */}
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  {item.name}
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <span>{item.size}</span>
                  </div>
                  <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                  <div className="flex items-center space-x-1.5">
                  <span>量: {item.total_amount}</span>
                    {/* <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 9V3H15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15V21H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 3L13.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 13.5L3 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg> */}

                    
                  </div>
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={item.total_price}
                  />
                </div>
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={item.total_price} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            {/* <div className="hidden sm:block text-center relative">
              <NcInputNumber className="relative z-10" />
              
            </div> */}

            {/* <a
              href="##"
              className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm "
            >
              <span>Remove</span>
            </a> */}
          </div>
        </div>
      </div>
    );
  };
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
       { count &&  <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium">
              <span className="mt-[1px]">{count}</span>
            </div>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 8H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* <Link className="block absolute inset-0" href={"/cart"} /> */}
          </Popover.Button>
        }
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                <div className="relative bg-white dark:bg-neutral-800">
                  <div className="max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar">
                  {cart?(cart as any).map(renderProduct):<></>}
                  </div>
                  <div className="bg-neutral-50 dark:bg-slate-900 p-5">
                    <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                      <span>
                        <span>小計</span>
                        <span className="block text-sm text-slate-500 dark:text-slate-400 font-normal">
                        お名前の時に計算されます。
                        </span>
                      </span>
                      <Prices
                        contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                        price= {total}
                  />
                    </p>
                    <div className="flex space-x-2 mt-5">
                      <ButtonSecondary
                        href="/cart"
                        className="flex-1 border border-slate-200 dark:border-slate-700"
                        onClick={close}
                      >
                        かごの中身を見る
                      </ButtonSecondary>
                      <ButtonPrimary
                        href="/checkout"
                        onClick={close}
                        className="flex-1"
                      >
                        お名前
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
