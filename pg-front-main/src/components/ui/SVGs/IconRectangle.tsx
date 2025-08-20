import React from "react";

export const IconRectangle: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="55"
      height="41"
      viewBox="0 0 55 41"
      fill="none"
    >
      <g filter="url(#filter0_d_260_238)">
        <path
          d="M2.56775 0.0932617L54.4151 5.90672L51.8083 38.0192H4.5953L2.56775 0.0932617Z"
          fill="#FAF7FF"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_260_238"
          x="0.530964"
          y="0.0932617"
          width="53.8842"
          height="39.9626"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-2.03678" dy="2.03678" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_260_238"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_260_238"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
