import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?: number;
  currency?: string;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({
  className = "",
  price = 33,
  currency = "¥",
  contentClass = "py-1 pr-2 md:py-1.5 md:pr-2.5 text-[21px] font-medium",
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={` items-center ${contentClass}`}
      >
        {/* <span className="text-green-500 !leading-none ">{String(price)} {String(currency)}</span> */}
        <span className="text-green-500 !leading-none ">{String(price)} {currency}</span>
      </div>
    </div>
  );
};

export default Prices;
