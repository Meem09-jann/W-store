import Image from "next/image";
import Link from "next/link";

let defaultimg =
  `${process.env.NEXT_PUBLIC_IMAGE_BASE}` +
  `web/assets/slider/37KZ7raEY2_No-Image-Placeholder.svg.png`;

const SmallCardBody = (props: any) => {
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
    // <div className="w-[137px] m-auto">
    <div className="w-[90%] md:h-90% m-auto">
      <Link href={"/productDetails/" + props.dataItem.id + "/" + props.dataItem.productId}>
        <Image
          className="w-full  h-[190px] md:h-[135px] 2xl:h-[150px]  5xl:h-[200px] rounded-[6px]"
          src={cover_image}
          alt={props.dataItem.name}
          width={137}
          height={100}
        />
        <p className="font-medium text-[15px] mt-[8px]">
          {props.dataItem.name}
        </p>
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
              {/* {props.dataItem.percentage || 0}% */}
              {percentage}
            </div>
          </div>
        </div>
       
      </Link>
    </div>
  );
};

export default SmallCardBody;
