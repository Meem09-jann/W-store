"use client";
import ProductCard from "@/components/ProductCard";
import AddressCard from "@/components/AddressCard";
import { PRODUCTS } from "@/data/data";
import Button from "@/shared/Button/Button";
import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import { useCookies } from 'react-cookie';
import Link from "next/link";

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
        return data;
    } catch (error) {
        throw error;
    }
  }

const AccountSavelists = () => {
    const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
    const [userId, setUserId] = useState('');
    const router = useRouter();
    const [address, setAddress] = useState<any>(null);
    //const [addrSelected, setAddrSelected] = useState(address ? address[0] : "");
    //const [deliveryAdd, setDeliveryAdd] = useState<any>('');
  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/login');
  }
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
    }
    
    getShippingAddress(cookies.jwtToken,userId)
      .then((data) => {
        setAddress(data.output);
      })
      .catch((error) => {
          throw error;
      });
    
}, [cookies,userId]);
if(!address){
  return <div>Loading</div>
}
  const renderSection1 = () => {
    return (
      <div className="space-y-10 sm:space-y-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
          お届け先の住所
          </h2>
          
          <div className="mt-6"><Link href="/address-add" className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> 
          追加
          </Link></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
          {/* {address.map((item,index) => ( */}
            <AddressCard data={
        address
      }/>
          {/* ))} */}
        </div>
        {/* <div className="flex !mt-20 justify-center items-center">
          <ButtonSecondary loading>Show me more</ButtonSecondary>
        </div> */}
      </div>
    );
  };

  return renderSection1();
};

export default AccountSavelists;
