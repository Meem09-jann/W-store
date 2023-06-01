import Slider from "react-slick";
import React, { FC } from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export interface SliderItemProps {
    className?: string;
    data?: any;
}
const HomeSlider: FC<SliderItemProps> = ({
    className = "",
    data,
}) => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    return (
        <div className="mt-4 mb-8">
            <Slider {...settings}>
                {data.map((item, index) => (
                    // <div className="mt-10 lg:mt-0 lg:absolute right-0 bottom-0 top-0 w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
                    <div key={index} className="w-full h-[300px]  flex justify-center">
                        {/* <p className="m-4">{item.title}</p> */}
                        <img src={`${process.env.NEXT_PUBLIC_IMAGE_BASE}` + item.image} alt={item.title} className="w-full h-full object-cover" />

                    </div>
                ))}
            </Slider>
        </div>
    );

}

export default HomeSlider;
