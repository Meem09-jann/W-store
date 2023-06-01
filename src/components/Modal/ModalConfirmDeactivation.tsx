import { Dialog, Transition } from "@/app/(old)/headlessui";
import { StarIcon } from "@heroicons/react/24/solid";
import ReviewItem from "@/components/ReviewItem";
import SortOrderFilter from "@/components/SectionGridMoreExplore/SortOrderFilter";
import React, { FC, Fragment } from "react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import ReviewCard from "@/components/Review/ReviewCard";

export interface ModalConfirmDeactivationProps {
  data?: any;
  onclick?: any
  show: boolean;
  onCloseModalConfirmDeactivation: () => void;
}

const ModalConfirmDeactivation: FC<ModalConfirmDeactivationProps> = ({
  data,
  onclick,
  show,
  onCloseModalConfirmDeactivation,
}) => {

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onCloseModalConfirmDeactivation}
      >
        <div className="min-h-[200px] px-4 text-center">
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
            className="inline-block h-auto align-middle"
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
            <div className="inline-block py-8 h-auto w-auto min-w-[300px] max-w-5xl">
              <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="headlessui-dialog-title-70"
                  >

アカウントの無効化
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={onCloseModalConfirmDeactivation} />
                  </span>
                </div>
                <div className="px-8 my-5 flex justify-center flex-wrap">

                  <p>アカウントを無効にしてもよろしいですか。確認するとログインできなくなります。</p>
                </div>


                <div className="px-8 my-5 flex justify-center flex-wrap">

                  <button className="bg-sky-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-3 rounded" type="submit" onClick={() => onclick(data)}>はい</button>
                  <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-3 rounded" type="submit" onClick={onCloseModalConfirmDeactivation}>いいえ</button>
                </div>

              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalConfirmDeactivation;
