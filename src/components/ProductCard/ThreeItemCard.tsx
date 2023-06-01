import { ThreeItemCardProps } from "@/app/types/CardType";
import CardHeading from "./CardHeading";
import BigCardBody from "./BigCardBody";
const ThreeItemCard = (props: ThreeItemCardProps) => {
    return (
        <div className="w-full bg-[#6c6c6c12]">
            {/* <CardHeading {...props.header} /> */}
            <div className="w-full h-[67px] bg-[#F2F4FF] border-l-[5px] border-[#6A36FF] flex items-center">
                <div className="ml-[23px] text-black ">
                    <h1 className="font-bold text-base ">スーパーDEAL</h1>
                    <h6 className="font-normal text-sm">
                    お得な情報を見つける
                </h6>
                </div>

            </div>
            {/* <div className="md:flex grid grid-cols-1  sm:grid-cols-2  my-[14px]"> */}
            <div className="md:grid-cols-3  grid grid-cols-1  sm:grid-cols-2  my-[14px]">
                {props.data?.map((item, index) => (

                    <BigCardBody key={index} dataItem={item} />
                ))}
            </div>

        </div>
    );
}

export default ThreeItemCard;