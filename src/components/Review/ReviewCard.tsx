import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC } from "react";
import Avatar from "@/shared/Avatar/Avatar";
import Image from "next/image";
interface ReviewItemDataType {
    name: string;
    avatar?: string;
    date: string;
    comment: string;
    starPoint: number;
}

export interface ReviewItemProps {
    className?: string;
    data?: any;
}


let defaultimg =
    `${process.env.NEXT_PUBLIC_IMAGE_BASE}` +
    `web/assets/slider/37KZ7raEY2_No-Image-Placeholder.svg.png`;

const ReviewCard: FC<ReviewItemProps> = ({
    className = "",
    data,
}) => {
    function getformatedDate(date: any) {
        const timestamp = new Date(date);
        // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        const dateString = timestamp.toLocaleDateString('en-US');
        // const dateString = timestamp.toLocaleDateString('en-US');
        return dateString;
    }
    return (
        <div className="nc-ReviewItem flex flex-col " data-nc-id="ReviewItem">
            <div className=" flex space-x-4 ">
                <div className="flex-shrink-0 pt-0.5"><div className="wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner rounded-full h-10 w-10 text-lg ring-1 ring-white dark:ring-neutral-900">
                    {/* <img alt={data.reviewer} loading="lazy" decoding="async" data-nimg="fill" className="absolute inset-0 w-full h-full object-cover rounded-full" sizes="100px" srcSet={data.photoURL} /> */}
                    {data.photoURL ? (<Image
                        sizes="(max-width: 640px) 50vw, 33vw"
                        fill
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}` + data.photoURL}
                        className="absolute inset-0 w-full h-full object-cover rounded-full"
                        alt={data.reviewer}
                    />) : (
                        <Image
                            sizes="(max-width: 640px) 50vw, 33vw"
                            fill
                            src={defaultimg}
                            className="absolute inset-0 w-full h-full object-cover rounded-full"
                            alt={data.reviewer}
                        />
                    )}
                    <span className="wil-avatar__name">C</span></div></div><div className="flex-1 flex justify-between">
                    <div className="text-sm sm:text-base"><span className="block font-semibold">{data.reviewer}</span>
                        <span className="block mt-0.5 text-slate-500 dark:text-slate-400 text-sm">
                            {
                                getformatedDate(data?.createdAt)
                            }
                        </span>
                    </div>
                    <div className="mt-0.5 flex text-yellow-500">
                        {data.rating}/5 <StarIcon className="w-5 h-5" />

                    </div>
                </div>
            </div>
            <div className="mt-4 prose prose-sm sm:prose dark:prose-invert sm:max-w-2xl">
                <p className="text-slate-600 dark:text-slate-300 break-words">{data.review}</p>
            </div>
        </div>

    );
};

export default ReviewCard;
