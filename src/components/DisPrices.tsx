import React, { FC } from "react";

export interface DisPricesProps {
  className?: string;
  price?: number;
  currency?: string;
  contentClass?: string;
}

const DisPrices: FC<DisPricesProps> = ({
  className = "",
  price = 33,
  currency = "¥",
  contentClass = "py-1 pr-2 md:py-1.5 md:pr-2.5 font-small",
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center ${contentClass}`}
      >
        {/* <span className="text-slate-300 !leading-none line-through">{String(price)} {String(currency)}</span> */}
        <span className="text-slate-400 !leading-none line-through">{String(price)} {currency}</span>
      </div>
    </div>
  );
};

export default DisPrices;
