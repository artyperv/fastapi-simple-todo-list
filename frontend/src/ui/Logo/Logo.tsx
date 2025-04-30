import React from "react";

interface LogoProps {
}

const Logo: React.FC<LogoProps> = () => {
  return (
    <svg
      width="40"
      height="20"
      viewBox="0 0 40 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33.3726 0.524956C33.2548 0.208742 32.9499 0 32.6093 0H7.8617C7.51895 0 7.21405 0.210809 7.0984 0.524956L0.283294 18.9274C0.0898388 19.4482 0.483058 20 1.0466 20H13.5602C13.903 20 14.2079 19.7892 14.3235 19.475L19.469 5.57818C19.7277 4.87755 20.737 4.87755 20.9978 5.57818L24.4589 14.9282C24.6524 15.449 24.2592 16.0008 23.6956 16.0008H19.5006C19.1578 16.0008 18.8529 16.2116 18.7373 16.5258L17.8478 18.9274C17.6543 19.4482 18.0476 20 18.6111 20H39.4202C39.9837 20 40.377 19.4482 40.1835 18.9274L33.3726 0.524956Z"
        fill="url(#a)"
      />
      <defs>
        <linearGradient
          id="a"
          x1="-20.497"
          y1="10"
          x2="100"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#c4a3f5" />
          <stop offset=".76" stopColor="#8f99ee" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
