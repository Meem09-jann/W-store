import { Dialog, Transition } from "@/app/(old)/headlessui";
import { StarIcon } from "@heroicons/react/24/solid";
import ReviewItem from "@/components/ReviewItem";
import SortOrderFilter from "@/components/SectionGridMoreExplore/SortOrderFilter";
import React, { FC, Fragment } from "react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import ReviewCard from "@/components/Review/ReviewCard";
import Label from "./Label/Label";
import Input from "@/shared/Input/Input";
import EmailIcon from "./EmailIcon";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Image from "next/image";
import { constants } from "buffer";


export interface ChatCardProps{

    product: any;
    onClose: () => void;
}

const ChatCard:FC<ChatCardProps> = ({ product, onClose})=>{

  const [ws, setWS] = useState<WebSocket>()
  const [cookies, setCookie, removeCookie] = useCookies([
    "jwtToken",
    "refreshToken",
    "profile",
  ]);

  const [message, setMessage] = useState("")
  const [inbox, setInbox] = useState(null)
  
  
  product.description = product.description.replaceAll(/(<([^>]+)>|\r|\n|&nbsp;)/gi, '').slice(0, 110) + '...';
  
  useEffect(()=>{

    console.log(cookies)

    const ws = new WebSocket(
      "wss://llhls.blessbit.net:3303/?x-access-token=" + cookies.jwtToken
    );

    setWS(ws);
  },[cookies])

  useEffect(()=>{

    if(!ws)return;
    ws.onmessage = (message) => {
      setInbox(JSON.parse(message.data))
      console.log('message received', JSON.parse(message.data))
    };

    ws.onopen = ()=>{
      ws.send(JSON.stringify({
        "type": "INBOX_OPEN",
        "data": {
            "page": 0,
            "userId": product.owner_id
        }
    }))
    }


  }, [ws])

  const sendMessage = ()=>{
    if(ws){
      const data = {
        "type": "INBOX_SEND",
        "data": {
          "toUserId": product.owner_id,
          'messageType': "product",
          'product': product,
          "message": message,
          "image": "",
        }
      }
      ws.send(JSON.stringify(data))
      console.log(data)
      setMessage("")
    }
  }

useEffect(()=>{

  console.log('inbox',inbox)

  if(inbox){

    document
    let el = document.getElementById('messages')
    if(el){
     
      el.scrollTop = el.scrollHeight
    }
  }

 

},[inbox])


    return (
        <Transition appear show as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={onClose}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
              </Transition.Child>
    
              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block py-8 h-auto w-96 max-w-5xl">
                  <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                    <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                      <h3
                        className="text-lg font-medium leading-6 text-gray-900"
                        id="headlessui-dialog-title-70"
                      >
    
                        18Chat
                      </h3>
                      <span className="absolute left-3 top-3">
                        <ButtonClose onClick={onClose} />
                      </span>
                    </div>
                    <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                        {/* {
                          true && <div className="max-w-lg">
                            <Label className="text-sm">Email</Label>
                            <Input className="mt-1.5" type={"email"}/>
                        </div>
                        }
                        <div className="max-w-lg">
                            <Label className="text-sm">Subject</Label>
                            <Input className="mt-1.5" type={"text"} />
                        </div>
                        <div className="max-w-lg">
                            <Label className="text-sm">Description</Label>
                            <Input className="mt-1.5" type={"text"} />
                        </div> */}
                        
                  

                      <section className="bg-white dark:bg-gray-900">
                   
              
                        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-96">
                          
                          <div
                            id="messages"
                            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                          >

                            {
                              (inbox as any)?.messages.slice().reverse().map((item, index)=>(
                                item.user.userId == cookies.profile.userId?
                                <div key={index} className="chat-message">
                                  <div className="flex items-end">
                                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                                      <div>
                                        <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                                          {item.message}
                                        </span>
                                      </div>
                                    </div>
                                    <Image
                                      width={100}
                                      height={100}
                                      src={ (!item.user.photoURL || item.user.photoURL=="")?process.env.NEXT_PUBLIC_IMAGE_BASE+"web/assets/product/R0iNX0dTtE_default1.jpeg" : process.env.NEXT_PUBLIC_IMAGE_BASE+item.user.photoURL}
                                      alt="Profile"
                                      className="w-6 h-6 rounded-full order-1"
                                    />
                                  </div>
                                </div>:
                                  <div key = {index} className="chat-message">
                                  <div className="flex items-end justify-end">
                                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                      <div>
                                        <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                                          {item.message}
                                        </span>
                                      </div>
                                    </div>
                                    <Image
                                      width={100}
                                      height={100}
                                      src={ (!item.user.photoURL || item.user.photoURL=="")?process.env.NEXT_PUBLIC_IMAGE_BASE+"web/assets/product/R0iNX0dTtE_default1.jpeg" : process.env.NEXT_PUBLIC_IMAGE_BASE+item.user.photoURL}
                                      alt="My profile"
                                      className="w-6 h-6 rounded-full order-2"
                                    />
                                  </div>
                                </div> 
                              ))
                            }
                          
                            {/* <div className="chat-message">
                              <div className="flex items-end">
                                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                                  <div>
                                    <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                                      Can be verified on any platform using docker
                                    </span>
                                  </div>
                                </div>
                                <Image
                                  width={100}
                                  height={100}
                                  src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                                  alt="My profile"
                                  className="w-6 h-6 rounded-full order-1"
                                />
                              </div>
                            </div>
                            <div className="chat-message">
                              <div className="flex items-end justify-end">
                                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                                  <div>
                                    <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                                      Your error message says permission denied, npm global installs
                                      must be given root privileges.
                                    </span>
                                  </div>
                                </div>
                                <Image
                                  width={100}
                                  height={100}
                                  src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=144&h=144"
                                  alt="My profile"
                                  className="w-6 h-6 rounded-full order-2"
                                />
                              </div>
                            </div> */}
                            
                            
                          </div>
                          <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
                            <div className="relative flex">
                              {/* <span className="absolute inset-y-0 flex items-center">
                                <button
                                  type="button"
                                  className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-6 w-6 text-gray-600"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                  </svg>
                                </button>
                              </span> */}
                              <textarea
                                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-gray-200 rounded-md py-1"
                                onChange={(e)=>setMessage(e.target.value)}
                                value={message}
                              />
                              <button
                                  type="button"
                                  className="inline-flex items-center justify-center rounded-lg px-1 py-1 transition duration-500 ease-in-out text-white focus:outline-none"
                                  onClick={sendMessage}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="black"
                                    className="h-6 w-6 ml-2 transform rotate-90"
                                  >
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                  </svg>
                                </button>
                            </div>
                          
                          </div>
                        </div>


                      </section>

                    </div>
                  
                  </div>
                    
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      );
}

export default ChatCard;