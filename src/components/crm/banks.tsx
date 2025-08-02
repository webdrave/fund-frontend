"use client";

import Image from "next/image";
import React from "react";

// Import your bank logos
import boi from "../../../public/assets/Bank-of-India-Logo.png";
import hdfc from "../../../public/assets/hdfc.png";
import axis from "../../../public/assets/axis.png";
import idbi from "../../../public/assets/idbi.png";
import kotak from "../../../public/assets/kotak.jpg";
import icici from "../../../public/assets/icici.png";
import yes from "../../../public/assets/yes.png";
import sbi from "../../../public/assets/sbi.jpg";
import pnb from "../../../public/assets/pnb.png";
import bob from "../../../public/assets/bob.png";
import canara from "../../../public/assets/canara.jpg";
import union from "../../../public/assets/union.svg";

interface Bank {
  src: any;
  alt: string;
}

const Banks: React.FC = () => {
  const banks: Bank[] = [
    { src: boi, alt: "Bank of India" },
    { src: hdfc, alt: "HDFC Bank" },
    { src: axis, alt: "Axis Bank" },
    { src: idbi, alt: "IDBI Bank" },
    { src: kotak, alt: "Kotak Mahindra Bank" },
    { src: icici, alt: "ICICI Bank" },
    { src: yes, alt: "Yes Bank" },
    { src: sbi, alt: "State Bank of India" },
    { src: pnb, alt: "Punjab National Bank" },
    { src: bob, alt: "Bank of Baroda" },
    { src: canara, alt: "Canara Bank" },
    { src: union, alt: "Union Bank" },
  ];

  // Duplicate banks for seamless looping (twice is sufficient)
  const duplicatedBanks = [...banks, ...banks];

  return (
    <div className="relative overflow-hidden bg-white shadow-md rounded-lg mb-6 py-4 sm:py-8">
      <h3 className="text-base md:text-lg font-semibold mb-4 px-4 sm:px-6">Our Partner Banks</h3>
      
      {/* Gradient overlays for fade effect */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      {/* Single responsive loop */}
      <div className="flex animate-infinite-scroll">
        {duplicatedBanks.map((bank, index) => (
          <div 
            key={index} 
            className="mx-3 sm:mx-4 md:mx-6 lg:mx-8 flex-shrink-0"
          >
            <Image
              src={bank.src}
              alt={bank.alt}
              width={0}
              height={0}
              sizes="(max-width: 640px) 60px, (max-width: 1024px) 100px, 140px"
              className="w-auto h-6 sm:h-8 md:h-10 lg:h-[60px] object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll {
          display: flex;
          animation: scroll 40s linear infinite;
          width: max-content;
        }
        @media (max-width: 768px) {
          .animate-infinite-scroll {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  );
};

export default Banks;