import React, { FC } from "react";
import { Transition } from "@/app/(old)/headlessui";
import Prices from "@/components/Prices";
import { PRODUCTS } from "@/data/data";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";


const NotifyProfilePicUpload = ({
  show,
  status,
  data,
  body
}) => {

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">


        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{status}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    {data}
                  </span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>

                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <Transition
      appear
      show={show}
      className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
      enter="transition-all duration-150"
      enterFrom="opacity-0 translate-x-20"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-20"
    >
      <p className="block text-base font-semibold leading-none">
        {body}
      </p>
      <hr className=" border-slate-200 dark:border-slate-700 my-4" />
      {renderProductCartOnNotify()}
    </Transition>
  );
};

export default NotifyProfilePicUpload;
