import { Dialog, Transition } from "@/app/(old)/headlessui";
import { StarIcon } from "@heroicons/react/24/solid";
import ReviewItem from "@/components/ReviewItem";
import SortOrderFilter from "@/components/SectionGridMoreExplore/SortOrderFilter";
import React, { FC, Fragment, useState } from "react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import Label from "@/components/Label/Label";
import Input from "@/shared/Input/Input";
import { useCookies } from "react-cookie";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";
import NotifyAddTocart from "@/components/NotifyAddTocart";
import NotifyReviewAdded from "@/components/Toast/NotifyReviewAdded";

export interface ModalViewAllReviewsProps {
  productId: any;
  user_id: any;
  owner_id: any
  show: boolean;
  onCloseModalSubmitReviews: () => void;
}

const ModalViewSubmitReview: FC<ModalViewAllReviewsProps> = ({
  productId,
  user_id,
  owner_id,
  show,
  onCloseModalSubmitReviews,
}) => {

  const [cookies, setCookie, removeCookie] = useCookies([
    "jwtToken",
    "refreshToken",
    "profile",
  ]);
  const [review, setReview] = useState("");
  const [rate, setRate] = useState(1);

  async function confirmReview(jwtToken: string, review: any) {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/content/product/reviewRating`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "content-type": "application/json",
        "x-access-token": jwtToken,
      },
    });

    try {
      const data = await res.json();

      const { status, message } = data;
      if (status == "failed") {
        return { status, message };
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  function submitReview() {
    onCloseModalSubmitReviews()
    const ratingString = rate.toString();
    const reviewdata = {
      "review": review,
      "product_id": productId,
      "owner_id": owner_id,
      "user_id": user_id,
      "rating": ratingString,
    }

    confirmReview(cookies.jwtToken, reviewdata).then((data) => {
      // console.log("meem", data)
      // if (data?.status == "failed") {
      //   toast.error(data?.message);
      // } else {
      //   toast.success(data?.message);
      // }
      toast.custom(
        (t) => (
          <NotifyReviewAdded
            show={t.visible}
            status={data?.status}
            data={

              data?.message
            }
          />
        ),
        { position: "top-right", id: "nc-product-notify", duration: 7000 }
      );
    });

  }

  const rateValueCheck = (event) => {
    const inputValue = event.target.value;

    if (inputValue >= 1 && inputValue <= 5) {
      setRate(inputValue);
    }
  };
  return (

    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onCloseModalSubmitReviews}
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
            <div className="inline-block py-8 h-auto w-full max-w-5xl">
              <div className="inline-flex pb-2 flex-col w-full text-left align-middle transition-all transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 dark:text-neutral-100 shadow-xl h-full">
                <div className="relative flex-shrink-0 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 text-center">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="headlessui-dialog-title-70"
                  >
                    {/* Add Your Review */}
                    レビューを書く
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={onCloseModalSubmitReviews} />
                  </span>
                </div>

                <div className="px-8 py-8 border-t border-slate-200 dark:border-slate-700 overflow-auto grid grid-cols-1">
                  <div className="w-full mb-3">
                    <Label className="text-sm">
                      {/* Your Review */}
                      レビュー本文
                    </Label>
                    <Input
                      className="mt-1.5"
                      placeholder=""
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      type={"text"}
                    />

                  </div>
                  <div className="w-full mb-3">
                    <Label className="text-sm">
                      {/* Rate Product */}
                      満足度
                    </Label>
                    <Input
                      className="mt-1.5"
                      placeholder=""
                      value={rate}
                      onChange={rateValueCheck}
                      type={"number"}
                    />

                  </div>
                  <button onClick={() => submitReview()} className="nc-Button relative h-auto inline-flex items-center justify-center rounded-full transition-colors text-sm sm:text-base font-medium py-3 px-4 sm:py-3.5 sm:px-6  ttnc-ButtonSecondary bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 mt-10 border border-slate-300 dark:border-slate-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0">レビューを投稿</button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalViewSubmitReview;
