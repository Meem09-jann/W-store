import downImage from "@/images/card/redDownArrow.png";
import Image from "next/image";
import Link from "next/link";
import Prices from "../Prices";
import DisPrices from "../DisPrices";
let defaultimg =
  `${process.env.NEXT_PUBLIC_IMAGE_BASE}` +
  `web/assets/slider/37KZ7raEY2_No-Image-Placeholder.svg.png`;
const BigCardBody = (props: any) => {
  const style = {
    className: "h-[10px] ml-1",
  };
  let cover_image = props.dataItem.cover_image
    ? process.env.NEXT_PUBLIC_IMAGE_BASE + props.dataItem.cover_image
    : defaultimg;
  let percentage = props.dataItem.percentage;
  if(percentage==0){
    percentage = ''
  }else{
    percentage = percentage+' %';
  }
  return (
    // <div className="w-[190px] relative m-auto mb-4 ">
    <div className="w-[90%] md:h-90% relative m-auto mb-4 ">
      <Link href={"/productDetails/" + props.dataItem.id + "/" + props.dataItem.productId}>
        <div className="font-medium text-xs text-white top-[5px] left-[1px] w-[122px] h-[26px] absolute bg-[#00000066] flex justify-center items-center">
          {props.dataItem.name}
        </div>
        <Image
          // className="w-full h-[115px]"
          className="w-full h-[200px] 2xl:h-[165px] 4xl:h-[190px] 5xl:h-[290px] rounded-[6px]"
          // src={cardImage}
          src={cover_image}
          alt={props.dataItem.name}
          width={190}
          height={115}
        />
        <p className="font-medium text-xs mt-[8px]">{props.dataItem.name}</p>
        {/* <div className="flex mt-[7px]">
          <div className="font-bold text-[10px] text-[#FB0000] flex items-center">
            <p>{props.dataItem.percentage}%</p>
            <Image
              src={downImage}
              alt="down Arrow"
              width={10}
              height={5}
              {...style}
            />
          </div>

          <p className="font-bold text-[11px] ml-[20px]">
            ${props.dataItem.dis_price}
          </p>
          <p className="text-[11px] ml-[20px] line-through">
            ${props.dataItem.price}
          </p>
        </div> */}
        <div className="flex flex-col justify-start items-start text-[13px]">
          <div className={`flex items-center py-1 pr-2 md:py-1.5 md:pr-2.5 text-[18px] font-medium`}>
            <span className="text-green-500 !leading-none ">{String(props.dataItem.dis_price)} ¥</span>
          </div>
          <div className="flex">
            {props.dataItem.percentage > 0 &&
              <div className={`flex items-center py-1 pr-2 md:py-1.5 md:pr-2.5 font-small font-medium`}>
                <span className="text-slate-400 !leading-none line-through">{String(props.dataItem.price)} ¥</span>
              </div>
            }

            <div className="flex items-center mb-0.5 text-red-500">
              {percentage}

            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BigCardBody;
