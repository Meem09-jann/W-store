"use client";
import Label from "@/components/Label/Label";
import React, { FC, useRef } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select";
import Textarea from "@/shared/Textarea/Textarea";
import { avatarImgs } from "@/contains/fakeData";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import NotifyReviewAdded from "@/components/Toast/NotifyReviewAdded";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import ModalProfileImageUpload from "@/components/Modal/ModalProfileImageUpload";
const AccountPage = () => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [photoURL, setPhotoURL] = useState('');
  const [fullname, setFullname] = useState('');

  useEffect(() => {

    if (!cookies.jwtToken) {
      return router.push('/login');
    }
    setPhotoURL(cookies?.profile?.photoURL);
    setFullname(cookies?.profile?.fullname);

    setName(cookies?.profile?.fullname);
    setEmail(cookies?.profile?.email);
    setDob(cookies?.profile?.dob);
    setAddress(cookies?.profile?.address);
    setPostcode(cookies?.profile?.postcode);
    setBuilding(cookies?.profile?.building);
    setPhone(cookies?.profile?.identifier);


  }, [cookies]);
  let defaultimg = `https://dyez0ftqpcowi.cloudfront.net/web/assets/slider/37KZ7raEY2_No-Image-Placeholder.svg.png`;
  let proPic = process.env.NEXT_PUBLIC_IMAGE_BASE + photoURL;
  let proPic1 = photoURL ? proPic : defaultimg;


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [building, setBuilding] = useState('');
  const [sex, setSex] = useState('');
  const [phone, setPhone] = useState('');


  const [isOpenModalProfileImageUpload, setIsOpenModalProfileImageUpload] =
    useState(false);

  async function confirmProfileUpdate(jwtToken: string, review: any) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/updateUserProfile`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(review),
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
      return data;
    } catch (error) {
      throw error;
    }
  }
  function submitUserUpdatedValue() {


    const profiledata = {
      "userId": cookies.profile.userId,
      "accountNo": "",
      "address": address,
      "post": postcode,
      "fullname": name,
      "mobile": phone,
      "email": email,
      "gender": sex,
      "dob": dob,
      "building": building,
      "photoURL": "",
    }

    confirmProfileUpdate(cookies.jwtToken, profiledata).then((data) => {

      toast.custom(
        (t) => (
          <NotifyReviewAdded
            show={t.visible}
            status={data?.status}
            data={

              data?.message
            }
          />
        ),
        { position: "top-right", id: "nc-product-notify", duration: 7000 }
      );
    });

  }



  return (
    <div className={`nc-AccountPage `}>
      <div className="space-y-10 sm:space-y-12">
        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl font-semibold">
          私の情報
        </h2>
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 flex flex-col items-center">
            {/* AVATAR */}

            <div className="relative rounded-full overflow-hidden flex">
              {/* <div onClick={handleImageClick} className="absolute inset-0 z-10 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span className="mt-1 text-xs">Change Image</span>
              </div> */}


              <Image
                src={proPic1}
                alt="avatar"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover z-0"
              />

            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded" type="submit" onClick={() => setIsOpenModalProfileImageUpload(true)}>upload</button>
            <ModalProfileImageUpload
              data={cookies.profile?.userId}
              // onclick={handleDeactivateAccount}
              show={isOpenModalProfileImageUpload}
              onCloseModalProfileImageUpload={() => setIsOpenModalProfileImageUpload(false)}
            />
          </div>
          <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
            <div>
              <Label>お名前</Label>
              <Input className="mt-1.5" defaultValue={fullname} onChange={(e) => setName(e.target.value)} />
            </div>


            <div>
              <Label>メールアドレス: </Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-envelope"></i>
                </span>
                <Input
                  className="!rounded-l-none"
                  defaultValue={cookies?.profile?.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* ---- */}
            <div className="max-w-lg">
              <Label>年度-月-日</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-calendar"></i>
                </span>
                <Input
                  className="!rounded-l-none"
                  type="date"
                  defaultValue={cookies?.profile?.dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>
            {/* ---- */}
            <div>
              <Label>住所 </Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-map-signs"></i>
                </span>
                <Input
                  className="!rounded-l-none"
                  defaultValue={cookies?.profile?.address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* ---- */}

            <div>
              <Label>郵便番号</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-search-location"></i>
                </span>
                <Input className="!rounded-l-none"
                  defaultValue={cookies?.profile?.postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>建物</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-hotel"></i>
                </span>
                <Input className="!rounded-l-none"
                  defaultValue={cookies?.profile?.building}
                  onChange={(e) => setBuilding(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>性別</Label>
              <Select className="mt-1.5" onChange={(e) => setSex(e.target.value)}>
                <option value="Male" selected={cookies?.profile?.gender === "Male"}>男性</option>
                <option value="Female" selected={cookies?.profile?.gender === "Female"}>女性</option>
                <option value="Other" selected={cookies?.profile?.gender === "Other"}>その他</option>
              </Select>
            </div>

            {/* ---- */}
            <div>
              <Label>連絡先</Label>
              <div className="mt-1.5 flex">
                <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                  <i className="text-2xl las la-phone-volume"></i>
                </span>
                <Input className="!rounded-l-none"
                  defaultValue={cookies?.profile?.identifier}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            {/* ---- */}
            {/* <div>
              <Label>About you</Label>
              <Textarea className="mt-1.5" defaultValue="..." />
            </div> */}
            <div className="pt-2">
              <ButtonPrimary onClick={() => submitUserUpdatedValue()}>更新</ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
