import { ThreeItemCardProps } from "@/app/types/CardType";
import CardHeading from "./CardHeading";
import BigCardBody from "./BigCardBody";
const ThreeItemCard2 = (props: ThreeItemCardProps) => {
    console.log("from component", props.data)
    return (
        <div className="w-full bg-[#6c6c6c12]">
            {/* <CardHeading {...props.header} /> */}
            <div className="w-full h-[67px] bg-[#F2F4FF] border-l-[5px] border-[#6A36FF] flex items-center">
                <div className="ml-[23px] text-black ">
                    <h1 className="font-bold text-base ">最近の人気商品</h1>
                    <h6 className="font-normal text-sm">
                    最も人気の商品
                </h6>
                </div>

            </div>
            <div className="md:grid-cols-3 grid grid-cols-1  sm:grid-cols-2  my-[14px]">
                {props.data?.map((item, index) => (

                    <BigCardBody key={index} dataItem={item} />
                ))}
            </div>

        </div>
    );
}

export default ThreeItemCard2;