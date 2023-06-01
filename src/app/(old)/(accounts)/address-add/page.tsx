"use client";
import Label from "@/components/Label/Label";
import React, { FC } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select";
import Textarea from "@/shared/Textarea/Textarea";
import { avatarImgs } from "@/contains/fakeData";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
async function saveAddress(jwtToken: string,userId:string, addlebel:string, name: string,mobile: string,area: string,addDetails: string,postCode: number,defaultAdd: number) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/profile/address`;
  
    try {
        const res = await fetch(url, {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-access-token': jwtToken,
            },
            body: JSON.stringify({
                userId,
                addlebel,
                name,
                mobile,
                area,
                addDetails,
                postCode,
                defaultAdd,
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
const AccountPage = () => {
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
    const [userId, setUserId] = useState('');
    const [addlebel, setaddlebel] = useState('');
    const [name, setname] = useState('');
    const [mobile, setmobile] = useState('');
    const [area, setarea] = useState('');
    const [addDetails, setaddDetails] = useState('');
    let [postCode, setpostCode] = useState<any>('');
    let [defaultAdd, setdefaultAdd] = useState<any>(0);
  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/login');
  }
    setUserId(cookies.profile.userId);
}, [cookies, router]);
async function handleSaveAddress(e) {
    e.preventDefault()
    console.log(defaultAdd)
    postCode = Number(postCode);
    defaultAdd = Number(defaultAdd);
      const response = await saveAddress(cookies.jwtToken,userId, addlebel, name,mobile,area,addDetails,postCode,defaultAdd);
      if (response?.status != 'success') {
          return;
      }

      

      return router.push('/account-address');
      
  }
  return (
    <div className={`nc-AccountPage `}>
      <div className="space-y-10 sm:space-y-12">
        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl font-semibold">
        お届け住所情報
        </h2>
        <div className="flex flex-col md:flex-row">
          
          <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
            <div>
              <Label>宛名</Label>
              <Input className="mt-1.5" placeholder="宛名を入力してください。" required
                onChange={(e) => setaddlebel(e.target.value)}/>
            </div>
            <div>
              <Label>お名前</Label>
              <Input className="mt-1.5" placeholder="お名前を入力してください。" required
                onChange={(e) => setname(e.target.value)}/>
            </div>

            {/* ---- */}
            <div>
              <Label>携帯電話番号</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-phone-volume"></i>
                </span>
                <Input className="!rounded-l-none" placeholder="受信者の携帯電話番号を入力してください" required
                onChange={(e) => setmobile(e.target.value)}/>
              </div>
            </div>
            {/* ---- */}
            <div>
              <Label>配送住所</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-map-signs"></i>
                </span>
                <Input
                  className="!rounded-l-none" placeholder="住所名を入力してください" required
                  onChange={(e) => setarea(e.target.value)}
                  
                />
              </div>
            </div>

            <div>
              <Label>郵便番号</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-map-signs"></i>
                </span>
                <Input
                  className="!rounded-l-none" placeholder="郵便番号を入力してください" required
                  onChange={(e) => setpostCode(e.target.value)}
                  
                />
              </div>
            </div>
            
            
            {/* ---- */}
        
            <div>
              <Label>詳細住所</Label>
              <Input className="mt-1.5" placeholder="住所の詳細を入力してください" required
                onChange={(e) => setaddDetails(e.target.value)}/>
            </div>
            <div>
              <Label>デフォルトの住所</Label>
              <Input type="checkbox" value='1' className="w-1 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => setdefaultAdd(e.target.value)}/>
            </div>
            <div className="pt-2">
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-full" type="submit" onClick={(e) => handleSaveAddress(e)}>お届け住所登録する</button>
              {/* <ButtonPrimary>Save</ButtonPrimary> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
