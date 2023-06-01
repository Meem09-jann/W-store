import Logo from "@/shared/Logo/Logo";
import SocialsList1 from "@/shared/SocialsList1/SocialsList1";
import { CustomLink } from "@/data/types";
import CompanyLogo from "@/images/logo/store-light-logo.png";
import React from "react";
import Image from "next/image";
const Footer: React.FC = () => {

  return (
    <div className="footer-bg nc-Footer relative py-10 lg:pt-20 lg:pb-16 border-t border-neutral-200 dark:border-neutral-700">
      <div className="footer-content container relative">
        <p className="footer-information">
          <span className="content-divider">주소: 서울특별시 구로구 디지털로 31길 41 이앤씨벤처드림타워6차 708호</span>
          <span className="content-divider">대표자: 이희대 </span>
          <span className="content-divider"> 사업자등록번호: 220-88-30372</span>
          <span className="content-divider">전화: 070-7416-7890</span>
          <span className="content-divider">팩스:  02-6008-8107</span>
          <span>이메일 <a href="mailto:help@hdtel.biz" target="_blank">help@hdtel.biz</a></span>
        </p>
        <div className="footer-copyright">
          <Image className="footer-logo w-[100px]"
            src={CompanyLogo}
            alt="placeholder"
            width={68}
            height={9}
          />
          <p>Copyright ⓒ<a href='http://hdtel.biz' target="_blank">hdtelecom Corp.</a>All rights reserved.</p>
          <a className="flex flex-col" href='/faq'>FAQ</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;