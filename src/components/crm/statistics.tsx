"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface StatsItem {
  label: string;
  value: string;
  bgColor: string;
  textColor: string;
}

const stats: StatsItem[] = [
  {
    label: "Approved",
    value: "20",
    bgColor: "bg-[#2d2c2c]",
    textColor: "text-white",
  },
  {
    label: "Rejected",
    value: "20",
    bgColor: "bg-[#f5d949]",
    textColor: "text-black",
  },
  {
    label: "Disbursed",
    value: "₹2000",
    bgColor: "bg-[#2d2c2c]",
    textColor: "text-white",
  },
];

const StatsCard: React.FC<StatsItem> = ({
  label,
  value,
  bgColor,
  textColor,
}) => (
  <div
    className={`${bgColor} ${textColor} rounded-lg p-3 md:p-5 text-center flex items-center justify-between font-semibold text-sm md:text-base`}
  >
    <p>{label}</p>
    <p className="text-lg md:text-xl font-bold">{value}</p>
  </div>
);

interface StatisticsProps {
  data: any;
}

const Statistics: React.FC<StatisticsProps> = ({ data }) => {
  const [stats, setStats] = useState([
  {
    label: "Approved",
    value: "0",
    bgColor: "bg-[#2d2c2c]",
    textColor: "text-white",
  },
  {
    label: "Rejected",
    value: "0",
    bgColor: "bg-[#f5d949]",
    textColor: "text-black",
  },
  {
    label: "Disbursed",
    value: "0",
    bgColor: "bg-[#2d2c2c]",
    textColor: "text-white",
  },
])
useEffect(() => {
  setStats((prev) => {
        return prev.map((card) => {
          if (card.label === "Approved") {
            const activeCount = data?.filter(lead => lead.status === "approved").length;
            return { ...card, value: activeCount };
          }
          if (card.label === "Rejected") {
            const activeCount = data?.filter(lead => lead.status === "rejected").length;
            return { ...card, value: activeCount };
          }
          if (card.label === "Disbursed") {
            const activeCount = data?.filter(lead => lead.status === "pending").length;
            return { ...card, value: activeCount };
          }
          return card;
        });
      });
}, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Stats column */}
      <div className="flex flex-col gap-2 p-3 md:p-4 justify-evenly bg-white shadow-md rounded-lg">
        <h3 className="text-base md:text-lg font-semibold mb-2 px-1">Loan Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {stats.map((item, idx) => (
            <StatsCard key={idx} {...item} />
          ))}
        </div>
      </div>

      {/* EMI Calculator column */}
      <div
        className="bg-[url('/emi-calc.svg')] bg-cover bg-center rounded-lg py-4 px-4 md:py-6 md:px-6 flex flex-col sm:flex-row items-center justify-between shadow-md shadow-black"
      >
        <Image
          src="/calculator.svg"
          alt="Calculator"
          width={160}
          height={160}
          className="object-contain w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-3 sm:mb-0"
          unoptimized
        />
        <div className="flex flex-col justify-center text-center sm:text-right sm:pl-4 md:pl-8">
          <h4 className="text-black text-base md:text-lg font-semibold">EMI Calculator</h4>
          <p className="text-black text-xs md:text-sm">Instantly check your loan EMI amount.</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;