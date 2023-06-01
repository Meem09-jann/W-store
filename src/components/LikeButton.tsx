"use client";

//import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';

interface Props {
  liked: any;
  className?: string;
}
async function likeProduct(token: string, id: any, userId: string) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/product/likeProduct`;

  const res = await fetch(url, {
    method: 'POST',
    body: `{"product_uid":${id},"user_id":"${userId}"}`,
    headers: {
      'content-type': 'application/json',
      'x-access-token': token,
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

const LikeButton = ({
  className = "",
  liked,
}) => {
  const [isLiked, setIsLiked] = useState<any>(liked.liked);
  const [cookies, setCookie] = useCookies(['jwtToken', 'refreshToken', 'profile', 'sessionId']);
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [reloadToggle, setReloadToggle] = useState(true);
  // make random for demo
  // useEffect(() => {
  //   setIsLiked(liked);
  // }, []);

  useEffect(() => {
    if (cookies.profile) {
      setUserId(cookies.profile.userId);
      setToken(cookies.jwtToken);
    }

  }, [cookies, userId, reloadToggle, isLiked]);
  async function handleLikeproduct(id: any, userId: string, token: string) {

    if (userId == '') {
      return alert('user not logedin')
    } else {
      await likeProduct(token, id, userId);
      setIsLiked(true)
    }

    setReloadToggle(!reloadToggle);
  }
  return (
    <button
      className={`w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 text-neutral-700 dark:text-slate-200 nc-shadow-lg ${className}`}
      onClick={() => handleLikeproduct(liked.id, userId, token)}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path
          d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
          stroke={isLiked ? "#ef4444" : "currentColor"}
          fill={isLiked ? "#ef4444" : "none"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};


export default LikeButton;
function setIsLiked(arg0: boolean) {
  throw new Error('Function not implemented.');
}

