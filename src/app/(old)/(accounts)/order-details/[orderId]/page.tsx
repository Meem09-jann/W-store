"use client";
import Prices from "@/components/Prices";
import DisPrices from "@/components/DisPrices";
import { PRODUCTS } from "@/data/data";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';


async function getOrderList(jwtToken: string, userId: string, orderId: string, lang: string = 'en', type: string = 'purchase') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/order/orderDetails`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"user_id":"${userId}", "orderId":"${orderId}","lang":"${lang}","type":"${type}"}`,
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch order list');
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

async function getPaygentPaymentData(jwtToken: string, orderInvoiceId: number) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/payment/paygent`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      orderInvoiceId
    }),
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
    },
  });

  try {
    const response = await res.json();
    if (response.status != 'success') {
      throw new Error(response.message)
    }
    return response.output
  } catch (error) {
    throw error;
  }
}

const AccountOrder = ({ params: { orderId } }) => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [userId, setUserId] = useState('');

  const router = useRouter();
  const [orderData, setOrderdata] = useState<any>(null);
  const [userData, setUserdata] = useState<any>(null);
  const [addressData, setAddressdata] = useState<any>(null);

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [totalPrice, setTotalPrice] = useState(0)
  useEffect(() => {

    console.log(selectedOrder)

  }, [selectedOrder])

  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/login');
    }
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
    }

    getOrderList(cookies.jwtToken, userId, orderId)
      // getOrderList("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJGREFvc1kwc215Z3YiLCJyb2xlIjoiVVNFUiIsInByb3ZpZGVySWQiOiJwaG9uZSIsImZlZGVyYXRlZElkIjoiKzg4MDExMjIzMzQ0MjQiLCJpYXQiOjE2ODQ3MzY1MTMsImV4cCI6MTY4NTM0MTMxM30.QjA0gAoWH3YfyzHuyQUkG7p-5S9Rzl_rBpm43dQqnuc", "NallOlmdPZFC", orderId)
      .then((data) => {
        setOrderdata(data.output.orderDetails);
        setUserdata(data.output.userdetails[0]);
        setAddressdata(data.output.addressDetails);

      })
      .catch((error) => {
        throw error;
      });

  }, [cookies, userId]);

  if (!orderData) {
    return <div>Loading</div>
  }
  function getTotalPrice(data) {
    let total;
    data.map((item, index) => {

      if (index == 0) {
        total = (0 + (item.total_amount * item.total_price))
      } else {
        total = (total + (item.total_amount * item.total_price))
      }

    })
    return total
  }

  const renderOrder = (item: any, index: number) => {

    function formateDate(dateString: any) {

      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return formattedDate;
    }

    const { id, invoiceId, createdAt, paidAt, storename
      , status, product } = item;

    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div className="w-full">
            <div className="text-xl font-semibold flex justify-between">
              <span>Invoice: {invoiceId}</span>
              <span className="">{status}</span>
            </div>
            <p className="flex flex-col text-slate-500 dark:text-slate-400 text-base mt-1.5 sm:mt-2">
              <span>Sold by {storename}</span>
              <span>Placed on {formateDate(createdAt)}</span>
              <span>Paid on {formateDate(paidAt)}</span>
            </p>
          </div>

        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {/* {product.map(renderProductItem)} */}
          {

            product.map((item, index) => {
              // let mainprice = item.total_amount * item.total_price;

              let { product_id, total_amount, total_price, basicPrice, name, currency, discount, percentage } = item;
              let mainprice = basicPrice;
              if(percentage==0){
                percentage = ''
                mainprice = ''
              }else{
                percentage = percentage+' %';
              }
              const cover_image = process.env.NEXT_PUBLIC_IMAGE_BASE + item.cover_image;
              

              return (

                <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
                  <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">

                    <Image
                      fill
                      sizes="100px"
                      src={cover_image}
                      alt={name}
                      className="h-full w-full object-cover object-center" />
                  </div>



                  <div className="ml-4 flex flex-col md:flex-row md:items-center justify-start items-start ">
                    <div className="w-auto mr-2">
                      <h3 className="text-xl font-medium line-clamp-1">{name}</h3>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-slate-400 flex items-center">
                        <span className="inline-block">Qty </span>
                        <span className="inline-block">{" "}</span>
                        <span className="mx-2 p-2 bg-slate-200 rounded">{total_amount}</span>
                      </p>
                    </div>
                    <Prices className="mt-0.5 md:mx-2" price={total_price} />
                    <DisPrices className="mt-0.5 md:mx-2" price={mainprice} />
                    <p className="text-gray-500 dark:text-slate-400 flex items-center">
                      <span className="md:mx-2 text-red-500">{percentage}</span>
                    </p>


                  </div>
                </div>


              );
            })

          }
          <p className="text-gray-500 dark:text-slate-400 flex items-center justify-end">
            <span className=" ">{product.length}</span>
            <span className="sm:ml-2">{"Item(s) Total:"}</span>
            <span className="sm:mr-2 text-indigo-500">{getTotalPrice(product)}{product[0].currency}</span>
          </p>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HEADING */}
      <h2 className="text-2xl sm:text-3xl font-semibold">Order Details</h2>

      <div className="flex flex-col justify-between">
        <p className="text-xl font-semibold">Ship and Bill TO</p>
        <p className="flex flex-col  text-slate-500 dark:text-slate-400 text-lg font-medium mt-1.5 sm:mt-2">
          <span >{userData.fullname}</span>
          <span className="text-sm">{userData.identifier}</span>
          <span className="text-sm">{addressData.addDetails}</span>
        </p>
      </div>

      {orderData.map(renderOrder)}


    </div>
  );
};

export default AccountOrder;
