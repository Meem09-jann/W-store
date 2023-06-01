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
import EmailIcon from "@/components/EmailIcon";
import ButtonCircles from "@/shared/Button/ButtonCircle";
import EmailCard from "@/components/EmailCard";
import BagIcon from "@/components/BagIcon";

async function getOrderList(jwtToken: string, userId: string, lang: string = 'en', type: string = 'purchase') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/order/orderListNew`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"user_id":"${userId}","lang":"${lang}","type":"${type}"}`,
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

const AccountOrder = () => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const [userId, setUserId] = useState('');

  const router = useRouter();
  const [orderData, setorderdata] = useState<any>(null);
  const [showEmailCard, setShowEmailCard] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showAllItems, setShowAllItems] = useState(false)
  useEffect(() => {

    // console.log(selectedOrder)
    if (selectedOrder)
      setShowEmailCard(true)
  }, [selectedOrder])

  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/login');
    }
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
    }

    getOrderList(cookies.jwtToken, userId)
      // getOrderList("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJGREFvc1kwc215Z3YiLCJyb2xlIjoiVVNFUiIsInByb3ZpZGVySWQiOiJwaG9uZSIsImZlZGVyYXRlZElkIjoiKzg4MDExMjIzMzQ0MjQiLCJpYXQiOjE2ODQ3MzY1MTMsImV4cCI6MTY4NTM0MTMxM30.QjA0gAoWH3YfyzHuyQUkG7p-5S9Rzl_rBpm43dQqnuc", "NallOlmdPZFC")
      .then((data) => {
        setorderdata(data.output);
      })
      .catch((error) => {
        throw error;
      });

  }, [cookies, userId]);

  if (!orderData) {
    return <div>Loading</div>
  }

  const renderProductItem = (product: any, index: any) => {
    let { product_id, total_amount, total_price, name, currency, discount, percentage } = product;
    const cover_image = process.env.NEXT_PUBLIC_IMAGE_BASE + product.cover_image;
    let mainprice = product.total_amount * product.price;
    if(percentage==0){
      percentage = ''
    }else{
      percentage = percentage+' %';
    }

    if (index < 3 || showAllItems) {
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

          <div className="ml-4 flex flex-1 flex-col justify-center">

            <div className="flex justify-start items-center">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{name}</h3>
              </div>
              <Prices className="mt-0.5 mx-2" price={total_price} />
              <DisPrices className="mt-0.5 mx-2" price={mainprice} />
              <p className="text-gray-500 dark:text-slate-400 flex items-center">
                <span className="mx-2">{percentage}%</span>
              </p>
              <p className="text-gray-500 dark:text-slate-400 flex items-center">
                <span className="hidden sm:inline-block">Qty</span>
                <span className="inline-block sm:hidden">x</span>
                <span className="mx-2">{total_amount}</span>
              </p>

            </div>

          </div>

        </div>


      );
    } else {
      return (

        <div key={index} className="hidden py-4 sm:py-7 last:pb-0 first:pt-0">
          <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">

            <Image
              fill
              sizes="100px"
              src={cover_image}
              alt={name}
              className="h-full w-full object-cover object-center" />
          </div>

          <div className="ml-4 flex flex-1 flex-col justify-center">

            <div className="flex justify-start items-center">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{name}</h3>
              </div>
              <Prices className="mt-0.5 mx-2" price={total_price} />
              <DisPrices className="mt-0.5 mx-2" price={mainprice} />
              <p className="text-gray-500 dark:text-slate-400 flex items-center">
                <span className="mx-2">{percentage}%</span>
              </p>
              <p className="text-gray-500 dark:text-slate-400 flex items-center">
                <span className="hidden sm:inline-block">Qty</span>
                <span className="inline-block sm:hidden">x</span>
                <span className="mx-2">{total_amount}</span>
              </p>

            </div>

          </div>

        </div>


      );
    }
  };
  const renderOrder = (item: any, index: number) => {
    const { id, invoiceId, orderTracId, createdAt, paidAt, status, product } = item;
    // const renderOrder = () => {
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p className="text-lg font-semibold">{orderTracId}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>注文済み: {createdAt}</span>
              <span className="mx-2">·</span>
              <span className="text-primary-500">{status}</span>
            </p>

            <button
              onClick={() => setSelectedOrder(item)} type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none 
            focus:ring-4 focus:ring-gray-300 font-medium rounded-full 
            text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700
             dark:focus:ring-gray-700 dark:border-gray-700">Send Email</button>
          </div>
          <div className="mt-3 sm:mt-0 flex gap-2 ">
            <Link href={`/order-details/${orderTracId}`}>
              <ButtonSecondary
                sizeClass="py-2.5 px-4 sm:px-6"
                fontSize="text-sm font-medium"
              >Order Details
              </ButtonSecondary>
            </Link>
            <Link href={`/order-invoice/${orderTracId}`}>
              <ButtonSecondary
                sizeClass="py-2.5 px-4 sm:px-6"
                fontSize="text-sm font-medium"
              >
                請求書の印刷
              </ButtonSecondary>
            </Link>
            {status == 'PENDING' &&
              <ButtonSecondary
                sizeClass="py-2.5 px-4 sm:px-6"
                fontSize="text-sm font-medium"
                onClick={async () => {

                  const data = await getPaygentPaymentData(cookies.jwtToken, id)

                  var form = document.createElement("form");
                  form.setAttribute("method", "post");
                  form.setAttribute("action", data.paygentURL);

                  const formData = {
                    language_code: 'en',
                    currency_code: 'JPY',
                    trading_id: data.tradingId,
                    payment_type: data.paymentType,
                    id: data.amount,
                    seq_merchant_id: data.merchantId,
                    payment_class: data.paymentClass,
                    use_card_conf_number: data.useCardConfNumber,
                    payment_term_min: data.paymentTermMin,
                    customer_id: data.customerId,
                    return_url: `${window.location.origin}/order-completed?orderInvoiceId=${id}&orderTracId=${orderTracId}`,
                    inform_url: data.informUrl,
                    threedsecure_ryaku: data.threedsecureRyaku,
                    hc: data.hash,
                  }

                  for (const [name, value] of Object.entries(formData)) {
                    const hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "text");
                    hiddenField.setAttribute("name", name);
                    hiddenField.setAttribute("value", value);
                    form.appendChild(hiddenField);
                  }


                  document.body.appendChild(form);


                  form.submit();

                }}
              >
                今払う
              </ButtonSecondary>
            }
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {product.map(renderProductItem)}
          {!showAllItems && product.length > 3 && (
            <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"

              onClick={() => handleShowMore(index)}
            >
              Show More
            </ButtonSecondary>
          )}
          {showAllItems && product.length > 3 && (
            <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
              onClick={() => handleShowLess(index)}
            >
              Show Less
            </ButtonSecondary>
          )}
        </div>

      </div>
    );
  };

  const handleShowMore = (index) => {
    // console.log("handleShowMore")
    // e.preventDefault();
    setShowAllItems(true);
  };

  const handleShowLess = (index) => {
    // console.log("handleShowLess")
    // e.preventDefault();
    setShowAllItems(false);
  };
  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HEADING */}
      <div className="flex justify-between">
        <h2 className="text-2xl sm:text-3xl font-semibold">注文履歴</h2>
      </div>

      {orderData.map(renderOrder)}
      {/* {renderOrder()}
      {renderOrder()} */}
      {
        showEmailCard &&
        <EmailCard
          receiverId={(selectedOrder as any).product.owner_id}
          productId={""}
          orderId={(selectedOrder as any).orderTracId}
          onClose={() => setShowEmailCard(false)}
        />
      }
    </div>
  );
};

export default AccountOrder;
