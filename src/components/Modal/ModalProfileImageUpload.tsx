import { Dialog, Transition } from "@/app/(old)/headlessui";
import { StarIcon } from "@heroicons/react/24/solid";
import ReviewItem from "@/components/ReviewItem";
import SortOrderFilter from "@/components/SectionGridMoreExplore/SortOrderFilter";
import React, { FC, Fragment, useRef, useState } from "react";
import ButtonClose from "@/shared/ButtonClose/ButtonClose";
import ReviewCard from "@/components/Review/ReviewCard";
import { useCookies } from "react-cookie";
import Image from "next/image";
import toast from "react-hot-toast";
import NotifyProfilePicUpload from "@/components/Toast/NotifyProfilePicUpload";
export interface ModalProfileImageUploadProps {
  data?: any;
  onclick?: any
  show: boolean;
  onCloseModalProfileImageUpload: () => void;
}

const ModalProfileImageUpload: FC<ModalProfileImageUploadProps> = ({
  data,
  onclick,
  show,
  onCloseModalProfileImageUpload,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken', 'refreshToken', 'profile']);
  const fileInputRef = useRef<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  async function getPreSignedUrl(jwtToken: string, filename: string, type: string = 'profile') {
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/upload/signed-url`;

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        filename,
        type,
      }),
      headers: {
        'content-type': 'application/json',
        'x-access-token': jwtToken,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to get upload url');
    }

    const { output } = await res.json();

    return output;
  }
  const uploadUsingPresignedUrl = async (preSignedUrl: string, file: File) => {
    await fetch(preSignedUrl, {
      method: 'PUT',
      body: file,
    });
  };
  const handleImageUpload = async (jwtToken: string, file: File) => {
    const { uploadUrl, filePath } = await getPreSignedUrl(jwtToken, file.name);

    try {
      await uploadUsingPresignedUrl(uploadUrl, file);
    } catch (error) {
      console.error('Failed to upload image');
    }
    return filePath;
  };

  const handleFileChange = (event) => {
    let file = event.target.files[0]
    setSelectedImageFile(file)
    setSelectedImage(URL.createObjectURL(file));
  };

  function confirmImageHandle() {
    handleImageUpload(cookies.jwtToken, selectedImageFile)
      // handleImageUpload("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyMXUwV1ZkQ2FMaVQiLCJyb2xlIjoiQURNSU4iLCJwcm92aWRlcklkIjoiY21zIiwiZmVkZXJhdGVkSWQiOiJyMXUwV1ZkQ2FMaVQiLCJpYXQiOjE2ODQyMTQ1NzksImV4cCI6MTY4NDgxOTM3OX0.qFXdqQ4wH1Ew0qgaI0yJrNt8YrmcUcatCVHK5Qc8cjQ", selectedImageFile)
      .then(async (path) => {
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_API_VERSION}/users/profile/propicUpdate`;
        const updateData = {
          "userId": cookies.profile.userId,
          "proPic": path
        }
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(updateData),
          headers: {
            'content-type': 'application/json',
            'x-access-token': cookies.jwtToken,
          },
        });
        try {
          const data = await res.json();
          const { status, message } = data;
          if (status == 'failed') {
            // throw new Error(message);
            console.error(message);
          }

          toast.custom(
            (t) => (
              <NotifyProfilePicUpload
                show={t.visible}
                status={status}
                data={message}
                body={"Profile Image Upload " + status}
              />
            ),
            { position: "top-right", id: "nc-product-notify", duration: 7000 }
          );

        } catch (error) {
          throw error;
        }
      })
      .catch((error) => {
        console.error(error);

      });
    resetAll();
  }

  function resetAll() {
    setSelectedImageFile(null)
    setSelectedImage(null);
    onCloseModalProfileImageUpload();
  }
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={resetAll}
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

                    Upload image
                  </h3>
                  <span className="absolute left-3 top-3">
                    <ButtonClose onClick={resetAll} />
                  </span>
                </div>
                <div className="px-8 my-5 flex justify-center flex-wrap">


                  <div className="relative rounded-full overflow-hidden flex">
                    <div onClick={handleImageClick} className="absolute inset-0 z-10 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span className="mt-1 text-xs">Change Image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />

                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="avatar"
                        width={128}
                        height={128}
                        className="w-32 h-32 rounded-full object-cover z-0"
                      />
                    ) : (<Image
                      src="https://dyez0ftqpcowi.cloudfront.net/web/assets/slider/37KZ7raEY2_No-Image-Placeholder.svg.png"
                      alt="avatar"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover z-0"
                    />)}
                  </div>

                </div>


                <div className="px-8 my-5 flex justify-center flex-wrap">

                  {selectedImageFile && <button className="bg-sky-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-3 rounded" type="submit" onClick={confirmImageHandle}>Confirm</button>}
                  <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-3 rounded" type="submit" onClick={resetAll}>Cancel</button>
                </div>

              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalProfileImageUpload;
