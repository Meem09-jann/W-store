import React, { FC } from "react";

interface EmailIconProps {
  className?: string;
}

const EmailIcon: FC<EmailIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg className={className} viewBox="0 0 9 9" fill="none">
      <path
       d="M17.8571 2H2.14286C0.961429 2 0 2.97891 0 4.18182V15.8182C0 17.0211 0.961429 18 2.14286 18H17.8571C19.0386 18 20 17.0211 20 15.8182V4.18182C20 2.97891 19.0386 2 17.8571 2ZM10.4294 9.85455C10.1765 10.0472 9.82367 10.048 9.618 9.89302L2.50453 3.45437H17.4968L10.4298 9.85437L10.4294 9.85455ZM5.87306 8.44725L1.42939 15.2342V4.42772L5.87306 8.44725ZM6.95167 9.42259L8.71522 11.0182C9.08736 11.3026 9.53314 11.4466 9.98453 11.4466C10.4509 11.4466 10.9246 11.2924 11.3331 10.9798L13.0516 9.42408L17.7137 16.5447H2.28714L6.95082 9.42201L6.95167 9.42259ZM14.1296 8.44871L18.5725 4.42759V15.234L14.1296 8.44871Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.8571 2H2.14286C0.961429 2 0 2.97891 0 4.18182V15.8182C0 17.0211 0.961429 18 2.14286 18H17.8571C19.0386 18 20 17.0211 20 15.8182V4.18182C20 2.97891 19.0386 2 17.8571 2ZM10.4294 9.85455C10.1765 10.0472 9.82367 10.048 9.618 9.89302L2.50453 3.45437H17.4968L10.4298 9.85437L10.4294 9.85455ZM5.87306 8.44725L1.42939 15.2342V4.42772L5.87306 8.44725ZM6.95167 9.42259L8.71522 11.0182C9.08736 11.3026 9.53314 11.4466 9.98453 11.4466C10.4509 11.4466 10.9246 11.2924 11.3331 10.9798L13.0516 9.42408L17.7137 16.5447H2.28714L6.95082 9.42201L6.95167 9.42259ZM14.1296 8.44871L18.5725 4.42759V15.234L14.1296 8.44871Z"
        fill="black"
      />
    </svg>
  );
};

export default EmailIcon;