import Button, { ButtonProps } from "@/shared/Button/Button";
import React from "react";

export interface ButtonDisableProps extends ButtonProps {}

const ButtonDisable: React.FC<ButtonDisableProps> = ({
  className = "",
  ...args
}) => {
  return (
    <>
        {/* <Button
          className={`ttnc-ButtonPrimary disabled:bg-opacity-90 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl`} disabled
          /> */}
          <button type="button" className="px-20 py-3 text-white bg-gray-300 rounded focus:outline-none" disabled>Checkout</button></>
    
  );
};

export default ButtonDisable;
