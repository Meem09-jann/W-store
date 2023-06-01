import { Dialog, Transition } from "@/app/(old)/headlessui";
import { StarIcon } from "@heroicons/react/24/solid";
import ReviewItem from "@/components/ReviewItem";
import SortOrderFilter from "@/components/SectionGridMoreExplore/SortOrderFilter";
import React, { FC, Fragment, useState } from "react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import ReviewCard from "@/components/Review/ReviewCard";
import Label from "./Label/Label";
import Input from "@/shared/Input/Input";
import EmailIcon from "./EmailIcon";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { useCookies } from "react-cookie";


async function sendEmail(jwtToken: string, subject, message, userId, email, recieverId, productId, orderId ) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/contactmail/sendMail`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({subject, message, userId, recieverId, email, productId, orderId}),
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      'x-access-token': jwtToken,
    },
  });

  if (!res.ok) {
    throw new Error('Failed send Email');
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


export interface EmailCardProps{

    receiverId: string;
    productId: string;
    orderId: string;
    onClose: () => void;
    
}



const EmailCard:FC<EmailCardProps> = ({ receiverId, productId, orderId, onClose})=>{

    
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")

  const [cookies, setCookie, removeCookie] = useCookies([
    "jwtToken",
    "refreshToken",
    "profile",
  ]);

  const handleSendMessage = ()=>{
   
    
    if(subject == '' || message == '' || email == '')
      alert("Email, Subject and Message required!")
    
    sendEmail(cookies.jwtToken, subject, message, cookies.profile?cookies.profile.userId:"", email, receiverId, productId, orderId).then(data=>{
     
    })
  }

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
    
                        Cantact Us
                      </h3>
                      <span className="absolute left-3 top-3">
                        <ButtonClose onClick={onClose} />
                      </span>
                    </div>
                    <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-left">
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
                        
                  
  {/* Hello world */}
                      <section className="bg-white dark:bg-gray-900">
                        <div className="mx-auto max-w-screen-md">
                         
                             <div>
                              <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Your email*
                              </label>
                              <input
                                type="email"
                                id="email"
                                onChange={e=> setEmail(e.target.value)}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                                placeholder="name@18mall.com"
                                defaultValue={""}
                                value={cookies.profile?.email}
                                required
                              />
                            </div>
                           
                            <div>
                              <label
                                htmlFor="subject"
                                className="block mt-6 mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                              >
                                Subject*
                              </label>
                              <input
                                type="text"
                                id="subject"
                                onChange={e=> setSubject(e.target.value)}
                                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                                placeholder="Let us know how we can help you"
                                defaultValue={""}
                                required
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label
                                htmlFor="message"
                                className="block mt-6 mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                              >
                                Your message*
                              </label>
                              <textarea
                                id="message"
                                rows={6}
                                onChange={e=>setMessage(e.target.value)}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Leave a comment..."
                                defaultValue={""}
                                required
                              />
                            </div>
                            <button
                             className="w-full rounded-md mt-4 bg-blue-400 px-10 py-2 font-semibold text-white"
                              onClick={handleSendMessage}
                            >
                              Send
                            </button>
                        
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

export default EmailCard;