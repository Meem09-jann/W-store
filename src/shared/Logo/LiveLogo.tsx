import React from "react";
import logoImg from "@/images/logo/store-live-logo.png";
// import logoLightImg from "@/images/logo-light.svg";
// import logo from "@/images/logo/logo.png";
import logoLightImg from "@/images/logo/store-live-logo.png";
import logo from "@/images/logo/store-live-logo.png";
import Link from "next/link";
import Image from "next/image";

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
}

const LiveLogo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = logoLightImg,
  className = "flex-shrink-0",
}) => {
  return (
    <Link
      href="http://live.18mall.shop"
      className={`ttnc-logo inline-block text-slate-600 ${className}`}
    >
      {/* THIS USE FOR MY CLIENT */}
      {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}
      {img ? (
        // <Image
        //   className={`block h-8 sm:h-10 w-auto ${
        //     imgLight ? "dark:hidden" : ""
        //   }`}
        //   src={img}
        //   alt="Logo"
        //   sizes="200px"
        //   priority
        // />
        <Image className={`block h-4 sm:h-6 w-auto ${imgLight ? "dark:hidden" : ""
          }`}
          src={logo} alt={'W Live'} width={140} height={48}
          priority></Image>
      ) : (
        "Logo Here"
      )}
      {imgLight && (
        // <Image
        //   className="hidden h-8 sm:h-10 w-auto dark:block"
        //   src={imgLight}
        //   alt="Logo-Light"
        //   sizes="200px"
        //   priority
        // />
        <Image className="hidden h-4 sm:h-6 w-auto dark:block"
          src={imgLight} alt={'W Live'} width={140} height={48}
          priority></Image>
      )}
    </Link>
  );
};

export default LiveLogo;
