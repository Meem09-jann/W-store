import { TwoItemCardProps } from "@/app/types/CardType";
import CardHeading from "./CardHeading";
import SmallCardBody from "./SmallCardBody";
const TwoItemCard = (props: TwoItemCardProps) => {
    let data = {
        "title": props.data.title,
        "description": props.data.description,

    }
    return (
        <div className="w-full  bg-[#6c6c6c12]">

            < CardHeading title={
                data
            } />

            {/* <div className="grid grid-rows-1  xs:flex xs:justify-evenly my-[14px]"> */}
            <div className="grid grid-cols-1  xs:grid-cols-2  my-[14px]">
                {/* <SmallCardBody {...props.item1} />
                <SmallCardBody {...props.item2} /> */}
                {props.data.product?.map((item, index) => (

                    <SmallCardBody key={index} dataItem={item} />
                ))}
            </div>

        </div>
    );
}

export default TwoItemCard;