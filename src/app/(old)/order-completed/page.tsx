"use client";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { useEffect,useState } from 'react';
import { useCookies } from 'react-cookie';


import {useSearchParams } from 'next/navigation';

async function paygentPaymentVerify(jwtToken: string, orderInvoiceId: number, orderTracId: string | null) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/payment/paygent-verify`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      orderInvoiceId,
      orderTracId
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
    
const CartPage = () => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile','sessionId']);
  const [ completed, setCompleted ] = useState(false);

  const params = useSearchParams();
  const orderInvoiceId = params.get('orderInvoiceId');
  const orderTracId = params.get('orderTracId');


  
  useEffect(()=> {
    if (!orderInvoiceId) {
      return
    }

    paygentPaymentVerify(cookies.jwtToken, Number(orderInvoiceId), orderTracId).then(() => {
      setCompleted(true)
    })

  }, [cookies, orderInvoiceId])


  return (
    <div className="">
      <main className="container py-20 ">
        <div className="flex flex-col m-4">
          <div className="flex-1">
            <div className="m-auto top-28 max-w-[40em]">
              {completed? 
                (<>
                  <h1 className="text-lg text-center font-semibold ">注文は処理中です</h1>
                  
                  <div className="flex gap-3 ">
                      <ButtonPrimary href="/" className="mt-8 w-full">ショッピングを続ける</ButtonPrimary>
                      <ButtonPrimary href="/account-order" className="mt-8 w-full">私の注文に行きます</ButtonPrimary>
                  </div>
                </>)
              : (<h1 className="text-lg text-center font-semibold ">お待ちください...</h1>)}
    
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
