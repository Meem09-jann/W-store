"use client";
import { NoSymbolIcon, CheckIcon } from "@heroicons/react/24/outline";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import DisPrices from "@/components/DisPrices";
import { Product, PRODUCTS } from "@/data/data";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonDisable from "@/shared/Button/ButtonDisable";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect,useState, useContext } from 'react';
import { useCookies } from 'react-cookie';
import {Context} from "@/context/Context"

    
   
//async function getCart(jwtToken: string,userId: string,lang: string = 'en', limit: number=100, offset:number=0,device:string='android',role:string='USER',sessionId:string) {
async function getCart(jwtToken: string,userId: string,sessionId: string,limit: number = 100, offset: number = 0){
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/cartListNew`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"user_id":"${userId}","sessionId":"${sessionId}","lang":"en","limit":"${limit}","offset":"${offset}","device":"android","role":"USER"}`,
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

async function updateCart(jwtToken: string,data: object) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/updateProductCount`;
  
  const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'content-type': 'application/json',
          'x-access-token': jwtToken,
      },
  });

  try {
      const data = await res.json();
      const { status, message } = data;
      if (status == 'failed') {
          throw new Error(message);
      }
      return true;
      
  } catch (error) {
      throw error;
  }
}


async function deleteCart(jwtToken: string, cartIds: any) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/delete`;

  const res = await fetch(url, {
      method: 'POST',
      body: `{"ids":[${cartIds}]}`,
      headers: {
          'content-type': 'application/json',
          'x-access-token': jwtToken,
      },
  });

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
const CartPage = () => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile','sessionId']);
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const [cartdata, setCartData] = useState<any>([]);
  const [reloadToggle, setReloadToggle] = useState(true);
  const [actualPrice, setActualPrice] = useState(0)
  const [priceAfterDiscount, setPriceAfterDiscount] = useState(0)
  const [discountedPrice, setDiscountedPrice] = useState(0)
  const [vat, setVat] = useState(0)
  const [ count, setCount ] = useContext(Context);

  const cartUpdate = (value, item)=>{
   
    console.log(item)
    updateCart(cookies.jwtToken, {
      "id":item.id,
      "price":item.dis_price,
      "count":value
  }).then(data=>{
    if(data){
      getCart(cookies.jwtToken,userId,sessionId)
      .then((data) => {
        setCartData(data.output);
      })
      .catch((error) => {
          throw error;
      });
    }
  })
  }

  let sessionId = cookies.sessionId;
  useEffect(() => {
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
    }
    
    
    getCart(cookies.jwtToken,userId,sessionId)
      .then((data) => {
        setCartData(data.output);
      })
      .catch((error) => {
          throw error;
      });
    
}, [cookies,userId,sessionId,router, reloadToggle]);

useEffect(()=>{

let sum = 0;
let sum1 = 0;
let totalTax = 0;
let cartLength : number = cartdata.length;


for (let i = 0; i < cartLength; i++) {
  let productLength : number = cartdata[i]['product'].length;
  //console.log(productLength);
  for (let j = 0; j < productLength; j++) {
    sum += (cartdata[i]['product'][j]['price']*cartdata[i]['product'][j]['total_amount']);
    totalTax+= cartdata[i]['product'][j]['vatPrice'] == 0?cartdata[i]['product'][j]['vatPrice'] : ((cartdata[i]['product'][j]['vatPrice'] - cartdata[i]['product'][j]['price'])*cartdata[i]['product'][j]['total_amount']);
    sum1 += cartdata[i]['product'][j]['price']*cartdata[i]['product'][j]['total_amount'] * (1 - (cartdata[i]['product'][j]['percentage']/100));
    
  }
  
}

setActualPrice(parseFloat(Number(sum).toFixed(2)))
setPriceAfterDiscount(parseFloat(Number(sum1).toFixed(2)))
setDiscountedPrice(parseFloat(Number(sum-sum1 - totalTax).toFixed(2)))
setVat(totalTax)

}, [cartdata])

if(!cartdata){
  return <div>Loading</div>
}



async function handleDeleteCart(id: any) {
  const cartIds : Array<string>[] = [];
  cartIds.push(id);
  if (confirm('Are you sure, you want to delete?')) {
      await deleteCart(cookies.jwtToken,cartIds);
      setCount(prev=>prev -1)
      
  }
  setReloadToggle(!reloadToggle);
}

  // const renderStatusSoldout = () => {
  //   return (
  //     <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
  //       <NoSymbolIcon className="w-3.5 h-3.5" />
  //       <span className="ml-1 leading-none">Sold Out</span>
  //     </div>
  //   );
  // };

  // const renderStatusInstock = () => {
  //   return (
  //     <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
  //       <CheckIcon className="w-3.5 h-3.5" />
  //       <span className="ml-1 leading-none">In Stock</span>
  //     </div>
  //   );
  // };



  const renderProduct = (item, index) => {
    
    
    const { id,image, price, name } = item;
    const cover_image = process.env.NEXT_PUBLIC_IMAGE_BASE+item.cover_image;
    let percentage = item.percentage;
    if(percentage==0){
      percentage = ''
    }else{
      percentage = percentage+' %';
    }

    //let mainprice = item.total_amount * item.price ;
    return (
      <div
        key={index}
        className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
      >
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            fill
            src={cover_image}
            alt={name}
            sizes="300px"
            className="h-full w-full object-contain object-center"
          />
          <Link href="/product-detail" className="absolute inset-0"></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <Link href="/product-detail">{name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.35 1.94995L9.69 3.28992"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.07 11.92L17.19 11.26"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 22H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{item.size}</span>
                  </div>
                  <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                  <div className="flex items-center space-x-1.5">
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

                    {/* <span>{item.percentage}% </span> */}
                    <span>{percentage}</span>
                  </div>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                  </svg> */}
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <select
                    name="qty"
                    id="qty"
                    className="form-select text-sm rounded-md py-1 border-slate-200 dark:border-slate-700 relative z-10 dark:bg-slate-800 "
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={item.dis_price}
                  />
                  <DisPrices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={item.price}
                  />
                </div>
              </div>

              <div className="hidden sm:block text-center relative">
              {/* <span>Quantity: {item.total_amount}</span> */}
              <NcInputNumber onChange={(value)=> cartUpdate(value, item)} defaultValue={item.total_amount} className="relative z-10" />
              </div>
              
              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={item.dis_price*item.total_amount} className="mt-0.5" />
                <DisPrices
                    price={item.price*item.total_amount} className="mt-0.5"
                  />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            {/* {Math.random() > 0.6
              ? renderStatusSoldout()
              : renderStatusInstock()} */}

            <button className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm" type="submit" onClick={() => handleDeleteCart(item.id)}>削除</button>
          </div>
        </div>
      </div>
    );
  };
  const renderOrder = (item: any, index: number) => {
    const { identifier,ownerId,name,storeName,profileImage,product } = item;
    //const profileImage = process.env.NEXT_PUBLIC_IMAGE_BASE+item.profileImage;
  // const renderOrder = () => {
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p className="text-lg font-semibold">{storeName}</p>
            
          </div>
          
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {product.map(renderProduct)}
        </div>
      </div>
    );
  };
  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
          買い物かご
          </h2>
          {/* <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link href={"/"} className="">
              Homepage
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={"/collection"} className="">
              Clothing Categories
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Shopping Cart</span>
          </div> */}
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
            {cartdata?.map?.(renderOrder)}
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="sticky top-28">
              <h3 className="text-lg font-semibold ">注文の内容</h3>
              <div className="mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
                {/* <div className="flex justify-between pb-4">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    $249.00
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Shpping estimate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    $5.00
                  </span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Tax estimate</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">
                    $24.90
                  </span>
                </div> */}
                <div className="flex justify-between font-semibold text-slate-300 text-slate-300 text-base pt-4 line-through">
                  <span>Mメインオーダー合計</span>
                  <span>{actualPrice}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                  <span>注文合計</span>
                  <span>{priceAfterDiscount}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                  <span>バット:</span>
                  <span>{vat}</span>
                </div>
                
                <div className="flex justify-between font-semibold text-emerald-500 text-emerald-500 text-base pt-4 ">
                  <span>保存</span>
                  <span>{discountedPrice}</span>
                </div>
              </div>
             
               
              {userId == '' && (
                
                <>
                   <ButtonPrimary href="/login" className="mt-8 w-full">お名前</ButtonPrimary>
                    
                </>
              )}
              
              {(userId && cartdata.length>0)&& (
                <>
                <ButtonPrimary href="/checkout" className="mt-8 w-full">お名前</ButtonPrimary>
                 
                </>
              )}
              {(userId && cartdata.length == undefined) && (
                <>
                <ButtonDisable href="#" className="mt-8 w-full"></ButtonDisable>
                
                 
                </>
              )}
              
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
        </div>
      </main>
    </div>
  );
};

export default CartPage;
