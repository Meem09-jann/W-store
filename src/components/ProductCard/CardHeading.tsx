
const CardHeading = ({title}) => {
    return (
        <div className="w-full h-[67px] bg-[#F2F4FF] border-l-[5px] border-[#6A36FF] flex items-center">
            <div className="ml-[23px] text-black ">
                <h1 className="font-bold text-base ">{title.title}</h1>
                <h6 className="font-normal text-sm">
                    {title.description}
                </h6>
            </div>

        </div>
    );
}

export default CardHeading