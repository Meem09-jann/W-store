"use client";

import Label from "@/components/Label/Label";
import React, { FC } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Input from "@/shared/Input/Input";
import Radio from "@/shared/Radio/Radio";
import Select from "@/shared/Select/Select";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import { useCookies } from 'react-cookie';

async function getShippingAddress(jwtToken: string,userId: string){
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/profile/addrList`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"userId":"${userId}"}`,
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
  },
  });

  if (!res.ok) {
      throw new Error('Failed to fetch address list');
  }

  try {
      const data = await res.json();
      const { status, message } = data;
      if (status == 'failed') {
          throw new Error(message);
      }
      console.log(data)
      return data;
  } catch (error) {
      throw error;
  }
}
interface Props {
  isActive: boolean;
  onCloseActive: () => void;
  onOpenActive: () => void;
  setDeliveryAdd2: any;
}

const ShippingAddress: FC<Props> = ({
  isActive,
  onCloseActive,
  onOpenActive,
  setDeliveryAdd2
}) => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const [defaultAdd, setDefaultAddress] = useState<any>(null);
  const [tempAddress, setTempAddress] = useState("")
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [area, setArea] = useState("")
  const [details, setDetails] = useState("")
  const [postcode, setPostcode] = useState("")  

  const handleOnChangeNewAddress = ()=>{
    setDeliveryAdd2( "Name:"+name+","+"Mobile:"+mobile+","+"Area:"+area+","+"Details:"+details+","+"Post Code:"+postcode)
    onCloseActive()
  }


  //const [addrSelected, setAddrSelected] = useState(address ? address[0] : "");
  //const [deliveryAdd, setDeliveryAdd] = useState<any>('');
  useEffect(() => {
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
    }
    
    getShippingAddress(cookies.jwtToken,userId)
      .then((data) => {
        data.output.map((item, index)=>{
         if(item.defaultAdd == 1){
         
          setDefaultAddress(data.output[index]);
          // {"Name: " + defaultAdd?.name}
          // {", Mobile: " + defaultAdd?.mobile}
          // {", Area: " + defaultAdd?.area}
          // {", Details: " + defaultAdd?.addDetails}
          // {", Post Code: " + defaultAdd?.postCode}
          setDeliveryAdd2( "Name:"+data.output[index]?.name+","+"Mobile:"+data.output[index]?.mobile+","+"Area:"+data.output[index]?.area+","+"Details:"+data.output[index]?.addDetails+","+"Post Code:"+data.output[index]?.postCode)
          setName(data.output[index]?.name)
          setMobile(data.output[index]?.mobile)
          setArea(data.output[index]?.area)
          setDetails(data.output[index]?.addDetails)
          setPostcode(data.output[index]?.postCode)

         }
        
      }
      )
        
      })
      .catch((error) => {
          throw error;
      });
    
}, [cookies,userId]);

// if(!address){
//   return <div>Loading</div>
// }



  const renderShippingAddress = () => {
    
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl ">
        <div className="p-6 flex flex-col sm:flex-row items-start">
          <span className="hidden sm:block">
            <svg
              className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-300 flex ">
              <span className="uppercase">お届け先の住所</span>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-5 h-5 ml-3 text-slate-900 dark:text-slate-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </h3>
            <div className="font-semibold mt-1 text-sm">
              <span className="">
              {"Name: " + defaultAdd?.name}
              {", Mobile: " + defaultAdd?.mobile}
              {", Area: " + defaultAdd?.area}
              {", Details: " + defaultAdd?.addDetails}
              {", Post Code: " + defaultAdd?.postCode}
              </span>
            </div>
          </div>
          <button
            className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
            onClick={onOpenActive}
          >
            変更
          </button>
          
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-start">
          {/* <span className="hidden sm:block">
            <svg
              className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span> */}

          {/* <div className="sm:ml-8">
            <h3 className=" text-slate-700 dark:text-slate-300 flex ">
              <span className="uppercase">SHIPPING ADDRESS</span>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-5 h-5 ml-3 text-slate-900 dark:text-slate-100"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </h3>
            <div className="font-semibold mt-1 text-sm">
            <div className="form-group">
            {/* <select className="nc-Select h-11 mt-1.5 block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900"
                  id="exampleFormControlSelect1" name="deliveryAdd" onChange={(e) => {
                    setDeliveryAdd(e.target.value)
                    setDeliveryAdd2(e.target.value)
                    }}> 
                    <select className="nc-Select h-11 mt-1.5 block w-full text-sm rounded-2xl border-neutral-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900"
                  id="exampleFormControlSelect1" name="deliveryAdd" onChange={(e) => {
                    setDeliveryAdd2(e.target.value)
                    
                    }} required>
                      <option value=''>Select Address</option>
            {address.map((item, index) => <option key={index} value={item.id} >{item.addlebel}</option>)}
                {/* <option value="6">Home</option>
                <option value="7">Office</option> 
                    </select>
            
                
              </div>
            </div>
          </div> */}
          {/* <button
            className="py-2 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mt-5 sm:mt-0 sm:ml-auto text-sm font-medium rounded-lg"
            onClick={onOpenActive}
          >
            Change
          </button> */}
          
        </div>
        <div
          className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-4 sm:space-y-6 ${
            isActive ? "block" : "hidden"
          }`}
        >
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
            
            <div>
              <Label className="text-sm">お名前</Label>
              <Input className="mt-1.5" value = {name} onChange={(e)=> setName(e.target.value)}placeholder="受取人の名前を教えてください"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
            <div>
              <Label className="text-sm">携帯電話番号</Label>
              <Input className="mt-1.5" value = {mobile} onChange={(e)=> setMobile( e.target.value )} placeholder="受信者の携帯番号を教えてください" />
            </div>
            <div>
              <Label className="text-sm">配送住所</Label>
              <Input className="mt-1.5" value = {area} onChange={(e)=> setArea(e.target.value)} placeholder="地域名を教えてください" />
            </div>
            
          </div>
          
          <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
            <div className="flex-1">
              <Label className="text-sm">詳細</Label>
              <Input
                className="mt-1.5"
                placeholder="完全な配送先住所"
                value={details}
                onChange={(e)=> setDetails(e.target.value)}
                type={"text"}
              />
            </div>
            <div className="sm:w-1/3">
              <Label className="text-sm">郵便番号</Label>
              <Input className="mt-1.5" type={"number"} value = {postcode} onChange={(e)=> setPostcode(e.target.value)} placeholder="郵便番号" />
            </div>
          </div>

          
          <div className="flex flex-col sm:flex-row pt-6">
            <ButtonPrimary
              className="sm:!px-7 shadow-none"
              onClick={handleOnChangeNewAddress}
            >
              保存
            </ButtonPrimary>
            <ButtonSecondary
              className="mt-3 sm:mt-0 sm:ml-3"
              onClick={onCloseActive}
            >
              キャンセル
            </ButtonSecondary>
          </div>
        </div>
      </div>
    );
  };
  return renderShippingAddress();
};

export default ShippingAddress;
