"use client";

import Label from "@/components/Label/Label";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import { Product, PRODUCTS } from "@/data/data";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';
import { Context } from "@/context/Context"
import DisPrices from "@/components/DisPrices";
import Select from "@/shared/Select/Select";
import SelectPaymentMethod from "./SelectPaymentMethod";
import Radio from "@/shared/Radio/Radio";

async function getCart(jwtToken: string, userId: string, sessionId: string, limit: number = 100, offset: number = 0) {
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

async function getDiscount(jwtToken: string, userId: string, code: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/promo/usePromo`;

  // console.log(userId, code, jwtToken)
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ userid: userId, code: code }),
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
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

async function createOrder(jwtToken: string, cartIds: any, deliveryAdd: any, userId: string, total: number, payId: any) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/checkout`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"ids":[${cartIds}],"device":"android","deliveryAdd":"${deliveryAdd}","totalAmount":"${total}","paymentOptions":"${payId}","userId":"${userId}"}`,
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
    },
  });

  try {
    const data = await res.json();
    const { status, message } = data;
    if (status == 'failed') {
      alert(data?.message);
      return {
        succeeded: false
      }
    }

    return {
      succeeded: true,
      orderInvoiceId: data.output.orderInvoiceId,
      orderTracId: data.output.orderTracId,
      payablePrice: data.output.payablePrice
    };


  } catch (error) {
    throw error;
  }
}


async function getPaymentOptions(limit: number = 100, offset: number = 0) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/paymentOptions`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"limit":"${limit}","offset":"${offset}"}`,
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

async function getPaygentPaymentData(jwtToken: string, orderInvoiceId: number, orderTracId: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/payment/paygent`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      orderInvoiceId,orderTracId
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

async function checkAvailableOptions(jwtToken: string, userId: string, payId: string, total: any) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/checkAvailableOptions`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ userId: userId, id: payId, totalAmount: total }),
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch available payment options');
  }

  try {
    const data = await res.json();
    const { status, message } = data;
    if (status == 'failed') {
      // throw new Error(message);
      console.log("Available Payment Options ", status)
    }
    return data;
  } catch (error) {
    throw error;
  }
}

const CheckoutPage = () => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile', 'sessionId']);
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const [cartdata, setCartData] = useState<any>(null);
  const [deliveryAdd, setDeliveryAdd] = useState<any>('');
  const [count, setCount] = useContext(Context);
  const [discount, setDiscount] = useState(0)
  const [discountCode, setDiscountCode] = useState("")
  const [shippingFee, setShippingFee] = useState(0)
  const [productPrice, setProductPrice] = useState(0)
  const [total, setTotal] = useState(0)
  const [vat, setVat] = useState(0)

  const [paymentOptions, setPaymentOptions] = useState<any>([])
  const [checkPayment, setCheckPayment] = useState('')
  const [confirmBtn, setConfirmBtn] = useState(true);


  const [hasPayableAmount, setHasPayableAmount] = useState(false);
  let confirmOrderBtn;

  const checkAvailablePayment = () => {
    // const value = event.target.value;
    console.log("meem check on change value", checkPayment)

    checkAvailableOptions(cookies.jwtToken, cookies.profile.userId, checkPayment, total)
      .then((data) => {
        if (data.status == 'failed') {
          console.log("buyNowBtn failed", confirmOrderBtn)
          if (confirmOrderBtn) confirmOrderBtn.disabled = true
          setConfirmBtn(false)
        } else if (data.status == 'success') {
          console.log("buyNowBtn success", confirmOrderBtn)
          if (confirmOrderBtn) confirmOrderBtn.disabled = false
          setConfirmBtn(true)
        }
      })
      .catch((error) => {
        throw error;
      });
  }


  useEffect(() => {
    confirmOrderBtn = document.getElementById('confirmOrderBtn') as HTMLButtonElement;
  }, []);

  let sessionId = cookies.sessionId;
  useEffect(() => {
    if (!cookies.jwtToken) {
      return router.push('/login');
    }
    setUserId(cookies.profile.userId);
    getCart(cookies.jwtToken, userId, sessionId)
      .then((data) => {
        setCartData(data.output);
      })
      .catch((error) => {
        throw error;
      });

  }, [cookies, userId, sessionId]);


  useEffect(() => {
    setTotal(productPrice + shippingFee + vat - discount)
  }, [productPrice, shippingFee, discount, vat])



  useEffect(() => {

    if (!cartdata) return;
    let sum = 0;
    let totalVat = 0;
    console.log(cartdata)
    for (let i = 0; i < cartdata.length; i++) {
      sum += cartdata[i]['total_price'];
      totalVat += cartdata[i]['vatPrice'] == 0?cartdata[i]['vatPrice']: ((cartdata[i]['vatPrice']*cartdata[i]['total_amount']) - (cartdata[i]['price']*cartdata[i]['total_amount'] ));
    }
    setVat(totalVat)
    setProductPrice(sum)
    let basicShippingFee = 0

    for (let i = 0; i < cartdata.length; i++) {

      if (cartdata[i]['payBy'] === "client") {
        basicShippingFee += cartdata[i]['basicDeliveryFee'];
      }

    }

    setShippingFee(basicShippingFee)

  }, [cartdata])

  useEffect(() => {

    getPaymentOptions(100, 0)
      .then((data) => {
        setPaymentOptions(data.output);
        setCheckPayment(data.output?.[0]?.id)
      })
      .catch((error) => {
        throw error;
      });

  }, []);


  useEffect(() => {
    console.log("checkPayment", checkPayment, total)
    checkAvailableOptions(cookies.jwtToken, userId, checkPayment, total)
      .then((data) => {
        if (data.status == 'failed') {

          if (confirmOrderBtn) confirmOrderBtn.disabled = true
        } else if (data.status == 'success') {
          if (confirmOrderBtn) confirmOrderBtn.disabled = false
        }
      })
      .catch((error) => {
        throw error;
      });


  }, [checkPayment]);


  const handleDiscount = () => {

    getDiscount(cookies.jwtToken, cookies.profile.userId, discountCode).then(data => {

      if (data['output']['discountType'] === 'Percentage') {

        setDiscount(parseFloat(Number((data['output']['discount'] / 100) * productPrice).toFixed(2)))
        //setProductPrice(parseFloat(Number((1 - (data['output']['discount']/100))*productPrice as any).toFixed(2)));
      }
      else {
        setDiscount(data['output']['discountType'])
        //setProductPrice(productPrice - data['output']['discount'])
      }
    })
  }


  const [tabActive, setTabActive] = useState<"ContactInfo" | "ShippingAddress" | "PaymentMethod">("ShippingAddress");

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };
  if (!cartdata) {
    return <div>Loading</div>
  }
  const cartIds: Array<string>[] = [];

  for (let i = 0; i < cartdata.length; i++) {
    cartIds.push(cartdata[i]['id']);

  }


  const placeOrder = async () => {
    const { succeeded, orderInvoiceId, orderTracId, payablePrice} = await createOrder(cookies.jwtToken, cartIds, deliveryAdd, userId, total, checkPayment);
    if (succeeded && payablePrice > 0) {
      const data = await getPaygentPaymentData(cookies.jwtToken, orderInvoiceId, orderTracId)

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
        return_url: `${window.location.origin}/order-completed?orderInvoiceId=${orderInvoiceId}&orderTracId=${orderTracId}`,
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
      // let data = {};
      // data['ids']=cartIds;
      // data['device']='android';
      // data['deliveryAdd']=6;

    } else if (succeeded) {
      setCount(0)
      router.push('/account-order');
    }
  };


  const renderProduct = (item, index) => {
    const { image, price, name } = item;
    const cover_image = process.env.NEXT_PUBLIC_IMAGE_BASE + item.cover_image;
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


              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={item.total_price} className="mt-0.5" />
                <DisPrices
                  price={item.price*item.total_amount} className="mt-0.5"
                />
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


  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24">
          <ContactInfo
            isActive={tabActive === "ContactInfo"}
            onOpenActive={() => {
              setTabActive("ContactInfo");
              handleScrollToEl("ContactInfo");
            }}
            onCloseActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
          />
        </div>

        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            setDeliveryAdd2={setDeliveryAdd}
            isActive={tabActive === "ShippingAddress"}
            onOpenActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            onCloseActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          {/* <SelectPaymentMethod
            paymentOptions={paymentOptions}

            onChange={checkAvailablePayment}
          /> */}
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
                    d="M3.92969 15.8792L15.8797 3.9292"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.1013 18.2791L12.3013 17.0791"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.793 15.5887L16.183 13.1987"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 21.9985H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="sm:ml-8">
                <h3 className=" text-slate-700 dark:text-slate-400 flex ">
                  <span className="uppercase tracking-tight">PAYMENT METHOD</span>
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="w-5 h-5 ml-3 text-slate-900"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </h3>
                <div className="font-semibold mt-1 text-sm">
                  <span className="">Select a Payment Method</span>
                </div>
              </div>

            </div>

            <div
              className={`border-t border-slate-200 dark:border-slate-700 px-6 py-7 space-y-6 block`}
            >

              {paymentOptions &&
                paymentOptions?.map((item: any, index: any) => (

                  <div key={index} className="flex items-start space-x-4 sm:space-x-6">
                    <Radio
                      className="pt-3.5"
                      name="payment-method"
                      key={index}
                      id={item.id}
                      // value={item.id}
                      defaultChecked={item.id === 1}
                      // onChange={checkAvailablePayment}
                      onChange={(e) => {
                        setCheckPayment(item.id)
                        checkAvailablePayment();
                      }}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="Wallet"
                        className="flex items-center space-x-4 sm:space-x-6 "
                      >
                        <div
                          className={`p-2.5 rounded-xl border-2 border-slate-600 dark:border-slate-300`}
                        >
                          <svg
                            className="w-6 h-6 sm:w-7 sm:h-7"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7 12H14"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className="font-medium">{item.type}</p>
                      </label>
                      <div className={`mt-6 mb-4 space-y-6 block`}>
                        <div className="text-sm prose dark:prose-invert">
                          <p>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}



            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            お名前
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link href={"/"} className="">
              ホームページ
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={"/cart"} className="">
              カート
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">お名前</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">注文の内容</h3>
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
              {cartdata.map(renderProduct)}

            </div>

            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 ">
              <div>
                <Label className="text-sm">ディスカウントコード</Label>
                <div className="flex mt-1.5">
                  <Input onChange={e => setDiscountCode(e.target.value)} sizeClass="h-10 px-4 py-3" className="flex-1" />
                  <button onClick={handleDiscount} className="text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors">
                    申し込み
                  </button>
                </div>
              </div>
              {/* <div>
                <Label>支払方法</Label>
                {paymentOptions &&

                  <Select className="mt-1.5" onChange={(e) => {
                    setCheckPayment(e.target.value)}}>
                    {paymentOptions?.map((item: any, index: any) => (
                      <option key={index} value={item.id} selected={checkPayment == item.id}> {item.type}</option>
                    ))}
                  </Select>
                }

              </div> */}
              <div className="mt-4 flex justify-between py-2.5">
                <span>小計</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={productPrice}
                  />
                </span>
              </div>
              <div className="mt-4 flex justify-between py-2.5">
                <span>バット:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={vat}
                  />
                </span>
              </div>
              {
                discount > 0 ?
                  <div className="flex justify-between py-2.5">
                    <span>割引({discountCode})</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      <Prices
                        contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                        price={discount}
                      />

                    </span>
                  </div>
                  : <></>
              }

              <div className="flex justify-between py-2.5">
                <span>送料の見積もり</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={shippingFee}
                  />
                </span>
              </div>
              {/* <div className="flex justify-between py-2.5">
                <span>Tax estimate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  $24.90
                </span>
              </div> */}
              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>注文合計</span>
                <span>
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={total}
                  /></span>
              </div>
            </div>
            <div id="confirmOrderBtn">
              <ButtonPrimary className="mt-8 w-full" onClick={() => { if (confirmBtn) { placeOrder() } }}>注文を確認</ButtonPrimary>
              {/* <ButtonPrimary className="mt-8 w-full" onClick={() => placeOrder()}>注文を確認</ButtonPrimary> */}
            </div>

            {/* <div className="mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
              <p className="block relative pl-5">
                <svg
                  className="w-4 h-4 absolute -left-1 top-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9945 16H12.0035"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Learn more{` `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Taxes
                </a>
                <span>
                  {` `}and{` `}
                </span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Shipping
                </a>
                {` `} infomation
              </p>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;