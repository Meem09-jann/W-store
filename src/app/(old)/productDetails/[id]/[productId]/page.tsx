"use client";

import React, { FC, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import LikeButton from "@/components/LikeButton";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "@/components/BagIcon";
import NcInputNumber from "@/components/NcInputNumber";
import ImageGallery from "react-image-gallery";
import { PRODUCTS } from "@/data/data";
import {
  NoSymbolIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "@/components/IconDiscount";
import Prices from "@/components/Prices";
import DisPrices from "@/components/DisPrices";
import toast from "react-hot-toast";
import SectionSliderProductCard from "@/components/SectionSliderProductCard";
import TrendingProduct from "@/components/SectionSliderCategories/TrendingProduct";
import detail1JPG from "@/images/products/detail1.jpg";
import detail2JPG from "@/images/products/detail2.jpg";
import detail3JPG from "@/images/products/detail3.jpg";
//import Policy from "./Policy";
import ReviewItem from "@/components/ReviewItem";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import SectionPromo2 from "@/components/SectionPromo2";
import ModalViewAllReviews from "../../ModalViewAllReviews";
import ModalViewSubmitReview from "../../ModalViewSubmitReview";
import NotifyAddTocart from "@/components/NotifyAddTocart";
import Image from "next/image";
import AccordionInfo from "@/components/AccordionInfo";

import { useRouter } from 'next/navigation';

import { useEffect, useContext } from 'react';
import { Context } from "@/context/Context"
import { useCookies } from 'react-cookie';
import { TRUE } from "sass";
import { ContextProvider } from "@/context/Context"
import ReviewCard from "@/components/Review/ReviewCard";
import SliderImage from 'react-zoom-slider';
import EmailCard from "@/components/EmailCard";
import { EmailIcon } from "next-share";
import ButtonCircles from "@/shared/Button/ButtonCircle";
import ChatCard from "@/components/ChatCard";


async function getProductDetails(jwtToken: string, product_id: string, user_id: string, lang: string = 'en') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/product/productDetails`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"product_id":"${product_id}","user_id":"${user_id}","lang":"${lang}"}`,
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

async function getSizePrize(jwtToken: string, product_id: string, lang: string = 'en') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/product/productExtraInfo`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"product_id":"${product_id}","lang":"${lang}"}`,
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
    },
  });

  if (!res.ok) {
    // throw new Error('Failed to fetch product extra info');
    console.error('Failed to fetch product extra info')
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

async function getCartCount(jwtToken: string, userId: string, sessionId: string) {
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

async function createCart(jwtToken: string, data: object) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/cart/createCart`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',

    },
  });

  try {
    const data = await res.json();
    const { status, message } = data;
    if (status == 'failed') {
      throw new Error(message);
    }
    // console.log(data)
    return true;

  } catch (error) {
    throw error;
  }
}

async function getReviews(jwtToken: string, product_id: string, owner_id: string = "", limit: number = 100, offset: number = 0, sortBy: string = 'id', sortType: string = 'desc') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/product/getReviewRating/android`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"product_id":"${product_id}","limit":"${limit}","offset":"${offset}","sortBy":"${sortBy}","sortType":"${sortType}"}`,
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
      // 'x-access-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyMXUwV1ZkQ2FMaVQiLCJyb2xlIjoiQURNSU4iLCJwcm92aWRlcklkIjoiY21zIiwiZmVkZXJhdGVkSWQiOiJyMXUwV1ZkQ2FMaVQiLCJpYXQiOjE2ODM1MjMwNjMsImV4cCI6MTY4NDEyNzg2M30.aXpWe0W8-1qCMcpEhuwf2KC2MwtSpG1Dn0sQIO8Mxug",
    },
  });

  if (!res.ok) {
    // throw new Error('Failed to fetch product extra info');
    console.error('Failed to fetch product extra info')
  }

  try {
    const data = await res.json();
    const { status, message } = data;
    if (status == 'failed') {
      console.log("getReviews error", message)
      // throw new Error(message);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

async function getCategoryProduct(jwtToken: string, id: number, userId: string, limit: number = 100, offset: number = 0, sortBy: string = 'id', sortType: string = 'desc') {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/product/catProduct/en/android`;
  const currentTime= "1679295158878";
  const secret = "10762887ec43657efa603ab4f80e0a1818a12bcc51472afba76bc5b2d30b8640";
  
  const res = await fetch(url, {
    method: 'POST',
    body: `{"userId":"${userId}","limit":"${limit}","offset":"${offset}","cat_id":"${id}","sortBy":"${sortBy}","sortType":"${sortType}"}`,
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      'current-time': currentTime,
      'hash': secret
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch product list');
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

// const LIST_IMAGES_DEMO = [detail1JPG, detail2JPG, detail3JPG];

const ProductDetailPage = ({ params }) => {
  let productId = params.productId;
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile', 'sessionId']);
  const router = useRouter();
  const [details, setDetails] = useState<any>(null);
  const [colorSelected, setcolorSelected] = useState<any>(null);
  const [variantSelected, setVariantSelected] = useState<any>(null);
  const [variantActive, setVariantActive] = useState<any>(null);
  const [qualitySelected, setQualitySelected] = useState(1);
  const [count, setCount] = useContext(Context);
  const [reviews, setReviews] = useState<any>([]);
  const [sizePrice, setSizePrice] = useState<any>(null);
  const [userId, setUserId] = useState<any>(cookies.profile?.userId ? cookies.profile.userId : "");
  const [categoryData, setCategoryData] = useState<any>(null);
  const [catId, setCatId] = useState(4);
  const [showEmailCard, setShowEmailCard] = useState(false)
  const [showChatCard, setShowChatCard] = useState(false)
  const [imagesGallery, setImageGallery] = useState(null);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] =
    useState(false);
  const [modalViewSubmitReview, setModalViewSubmitReview] =
    useState(false);
  // const [sliderImageData, setSliderImageData] = useState([])
  let sliderImageData: any = [];



  useEffect(() => {
    // if (!cookies.jwtToken) {
    //     return router.push('/login');
    // }



    getProductDetails(cookies.jwtToken, productId, userId)
      .then((data) => {
        // console.log('details', data)
        setDetails(data.output);
        setCatId(data.output.category);
      })
      .catch((error) => {
        throw error;
      });

    getCategoryProduct(cookies.jwtToken, catId, userId)
      .then((data1) => {
        // console.log('details 123', data1)
        setCategoryData(data1);
      })
      .catch((error) => {
        throw error;
      });
    getSizePrize(cookies.jwtToken, productId)
      .then((data) => {
        setSizePrice(data.output),
          setcolorSelected(data.output.color[0]),
          setVariantActive(data.output.size_price[0]['size']),
          setVariantSelected(data.output.size_price[0]['id']);
      })
      .catch((error) => {
        throw error;
      });

  }, [catId, cookies, params.id, productId, userId]);

  useEffect(() => {

    getReviews(cookies.jwtToken, productId)
      .then((data) => {
        setReviews(data.output);
      })
      .catch((error) => {
        throw error;
      });

  }, []);

  let likedata = {
    'id': 1,
    'liked': 0
  }

  if (!details) {
    return <div className="text-center">
      <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  }

  if (!sizePrice) {
    return <div className="text-center">
      <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  }

  const color = sizePrice.color;
  const variants = sizePrice.size_price;

  let defaultimg = `${process.env.NEXT_PUBLIC_IMAGE_BASE}` + `web/assets/slider/37KZ7raEY2_No-Image-Placeholder.svg.png`;
  let cover_image = details.product.cover_image;
  let cover_image1 = cover_image ? process.env.NEXT_PUBLIC_IMAGE_BASE + cover_image : defaultimg;
  const LIST_IMAGES_DEMO = details.posters;
  let storeImage1 = details?.owner_details[0]?.photoURL;
  let storeImage = storeImage1 ? process.env.NEXT_PUBLIC_IMAGE_BASE + storeImage1 : defaultimg;

  let percentage = details.product?.percentage

  if(percentage==0){
    percentage = ''
  }else{
    percentage = percentage+' %';
  }
  const notifyAddTocart = async () => {
    let data = {};

    if (cookies.profile) {
      data['user_id'] = cookies.profile.userId;
    } else {
      data['user_id'] = '';
    }

    data['product_id'] = productId;
    data['owner_id'] = details.product.owner_id;
    data['size_id'] = variantSelected;
    data['color'] = colorSelected;
    data['amount'] = qualitySelected;
    data['price'] = details.product.price;
    data['dis_price'] = details.product.dis_price;
    data['percentage'] = details.product.percentage;
    data['vatPrice'] = details.product.vatPrice;
    data['shipping_fee'] = "80 taka";
    data['shipping_method'] = "redex";
    data['paymentMethod'] = "COD";
    data['type'] = "cart";
    data['lang'] = "en";
    data['sessionId'] = cookies.sessionId
    data['basicDeliveryFee'] = details.product.basicDeliveryFee


    await createCart(cookies.jwtToken, data);
    getCartCount(cookies.jwtToken, userId, cookies.sessionId)
      .then(data => {
        setCount(data.output.count)
      })
    toast.custom(
      (t) => (
        <NotifyAddTocart
          productImage={cover_image1}
          qualitySelected={qualitySelected}
          show={t.visible}
          sizeSelected={colorSelected}
          variantActive={variantActive}
          data={

            details.product
          }
        />
      ),
      { position: "top-right", id: "nc-product-notify", duration: 7000 }
    );


  };

  const renderVariants = () => {
    if (!variants) {
      return null;
    }

    return (
      <div>
        <label htmlFor="">
          <span className="text-sm font-medium">
            サイズ:
            <span className="ml-1 font-semibold">
              {variantActive}
            </span>
          </span>
        </label>

        {/* <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3"> */}
        <div className="flex flex-wrap mt-3">
          {variants.map((variant, index) => (

            <div
              key={index}

              onClick={() => {
                setVariantActive(variant.size)
                setVariantSelected(variant.id)
              }
              }
              className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center w-auto px-2  mr-2 mb-2
              text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${variantActive === variant['size']
                  ? "bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000"
                  : "border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
            >


              {variant.size}

            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderColorList = () => {
    if (!color || !color.length) {
      return null;
    }
    return (
      <div>
        <div className="flex justify-between font-medium text-sm">
          <label htmlFor="">
            <span className="">
              カラー:
              <span className="ml-1 font-semibold">{colorSelected}</span>
            </span>
          </label>

        </div>
        {/* <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3"> */}
        <div className="flex flex-wrap mt-3">
          {color.map((item, index) => {

            const isActive = item === colorSelected;
            //const sizeOutStock = !sizes.includes(size);
            return (
              <div
                key={index}
                className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center  w-auto px-2  mr-2 mb-2
                text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${isActive
                    ? "bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000"
                    : "border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
                onClick={() => {

                  setcolorSelected(item);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            {details.product.name}
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={details.product.dis_price}
            />
            {details.product?.percentage > 0 &&
              <DisPrices
                contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
                price={details.product.price}
              />
            }

            <div className="h-7 border-l border-slate-300 dark:border-slate-700">

            </div>

            <div className="flex items-center ">
              {/* {details.product?.percentage || 0}% */}
              {percentage}

              <a
                href="#reviews"
                className="flex items-center text-sm font-medium ml-3"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ml-1.5 flex">
                  <span>{Math.ceil(details.product.rating)}/5</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-slate-400 underline">
                    {details.product.review} 商品レビュー
                  </span>
                </div>
              </a>
              <span className="hidden sm:block mx-2.5">·</span>
              <div className="hidden sm:flex items-center text-sm">
                <SparklesIcon className="w-3.5 h-3.5 " />
                <span className="ml-1 leading-none">{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <div className="">{renderVariants()}</div>
        <div className="">{renderColorList()}</div>

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex space-x-3.5">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber
              defaultValue={qualitySelected}
              onChange={setQualitySelected}
            />
          </div>
          <ButtonPrimary
            className="flex-1 flex-shrink-0"
            onClick={notifyAddTocart}
          >
            <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            <span className="ml-3">買い物かごに入れる</span>
          </ButtonPrimary>
          <div className=" flex justify-center m-auto gap-2">
          {/* <button  
            onClick={()=>setShowEmailCard(true)} type="button" 
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none 
            focus:ring-4 focus:ring-gray-300 font-medium rounded-full 
            text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700
             dark:focus:ring-gray-700 dark:border-gray-700">Send Email</button> */}
            {/* <ButtonCircles
              className="flex-0"
              onClick={()=>setShowChatCard(true)}
            >
              <EmailIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            </ButtonCircles> */}
          </div>
         
        </div>

        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
        {/*  */}
        {/*  ---------- store details */}
        <div className="flex space-x-3.5">
          <div className="flex items-center justify-center px-2 py-3 sm:p-3.5 rounded-full">
          
              <Image
                src={storeImage}
                alt="avatar"
                width={100}
                height={100}
                className="w-8 h-8 rounded-full object-cover z-0 mx-2"
              />

              <span className="text-slate-900 dark:text-slate-200 font-semibold text-lg">
                {details?.owner_details[0]?.storeName}
              </span>{" "}
          </div>
          
          <div className=" flex justify-center mt-2 gap-2">
            <button  
              onClick={()=>setShowEmailCard(true)} type="button" 
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none 
              focus:ring-4 focus:ring-gray-300 font-medium rounded-full 
              text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700
              dark:focus:ring-gray-700 dark:border-gray-700">Send Email</button>
              <button  
              onClick={()=>setShowChatCard(true)} type="button" 
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none 
              focus:ring-4 focus:ring-gray-300 font-medium rounded-full 
              text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700
              dark:focus:ring-gray-700 dark:border-gray-700">Chat</button>
            {/* <ButtonCircles
              className="flex-0"
              onClick={()=>setShowChatCard(true)}
            >
              <EmailIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            </ButtonCircles> */}
          </div>
         
        </div>

        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo data={
          details?.features
        } />
        {/* {renderDetailSection()} */}

        {/* ---------- 6 ----------  */}
        <div className="hidden xl:block">

        </div>
      </div>
    );
  };

  const renderDetailSection = () => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold">商品説明</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7">
          <div dangerouslySetInnerHTML={{ __html: details.product.description }}></div>
          {/* <p>
            
            {details.product.description}
          </p> */}
          {/* <p>
            The St. Louis Meramec Canoe Company was founded by Alfred Wickett in
            1922. Wickett had previously worked for the Old Town Canoe Co from
            1900 to 1914. Manufacturing of the classic wooden canoes in Valley
            Park, Missouri ceased in 1978.
          </p>
          <ul>
            <li>Regular fit, mid-weight t-shirt</li>
            <li>Natural color, 100% premium combed organic cotton</li>
            <li>
              Quality cotton grown without the use of herbicides or pesticides -
              GOTS certified
            </li>
            <li>Soft touch water based printed in the USA</li>
          </ul> */}
        </div>
      </div>
    );
  };

  function setUpsliderImage(imageData) {
    sliderImageData.push({
      image: `${process.env.NEXT_PUBLIC_IMAGE_BASE}${imageData.poster_image}`,
      text: details.product.name ? details.product.name : `Product Image`,
    });

  }
  return (

    <div className={`nc-ProductDetailPage `}>
      {/* MAIn */}
      <main className="container mt-5 lg:mt-11">
        <div className="lg:flex">
          {/* CONTENT */}
          <div className="w-full lg:w-[55%] ">
            {/* HEADING */}
            <div className="relative">

              {LIST_IMAGES_DEMO.map((item, index) => {

                setUpsliderImage(item)

              })
              }

              <SliderImage
                data={sliderImageData}
                width="100%"
                showDescription={true}
                direction="right"
              />
              <LikeButton liked={likedata} className="absolute right-3 top-3 " />
            </div>
            {/* <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-8 xl:mt-8">
              {LIST_IMAGES_DEMO.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="aspect-w-11 aspect-h-11 relative"
                  >
                    <Image
                      sizes="(max-width: 640px) 50vw, 33vw"
                      fill
                      src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}` + item.poster_image}
                      className="w-full rounded-2xl object-cover"
                      alt="product detail 1"
                    />
                  </div>
                );
              })}
            </div> */}
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            {renderSectionContent()}
          </div>
        </div>
        {/* DETAIL AND REVIEW */}
        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">


          {renderDetailSection()}

          <hr className="border-slate-200 dark:border-slate-700" />


          <div id="reviews" className="">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-7 h-7 mb-0.5">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd"></path>
                </svg>
                <span className="ml-1.5">{(reviews?.length > 0) ? reviews.length : "0"} レビュー
                </span>
              </h2>
              {(cookies.profile?.userId && details.purchase === 1) ?
                (<button onClick={() => setModalViewSubmitReview(true)} className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonSecondary bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 mt-10 border border-slate-300 dark:border-slate-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">レビューを書くする</button>) :
                (<button className="invisible ">レビューを書くする</button>)
              }


              <ModalViewAllReviews
                data={reviews}
                show={isOpenModalViewAllReviews}
                onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
              />

              {
                showEmailCard && 
                <EmailCard
                receiverId= {details.product.owner_id}
                productId={details.product.productId}
                orderId={""}
                onClose={()=> setShowEmailCard(false)}
              />
              }
              
              {
                showChatCard && 
                <ChatCard
                product={details.product}
                onClose={()=> setShowChatCard(false)}
                />
              }
              <ModalViewSubmitReview
                productId={productId}
                user_id={cookies.profile?.userId}
                owner_id={details.product.owner_id}
                show={modalViewSubmitReview}
                onCloseModalSubmitReviews={() => setModalViewSubmitReview(false)}
              />
            </div>
            {reviews?.length > 0 &&
              <div className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">

                  {reviews?.map((item: any, index: any) => (
                    index < 4 && <ReviewCard data={item} key={index} />
                  ))}


                </div>
                <button onClick={() => setIsOpenModalViewAllReviews(true)} className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonSecondary bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 mt-10 border border-slate-300 dark:border-slate-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">すべてのレビューを表示</button>
              </div>
            }

          </div>

          <hr className="border-slate-200 dark:border-slate-700" />


          {/* OTHER SECTION */}


          <TrendingProduct
            data={
              categoryData?.output
            } />

          {/* SECTION */}
          {/* <div className="pb-20 xl:pb-28 lg:pt-14">
            <SectionPromo2 />
          </div> */}
        </div>
      </main>
    </div>


  );
};

export default ProductDetailPage;