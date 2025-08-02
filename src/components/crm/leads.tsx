"use client";
import { Eye, Plus, ArrowUpRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function LeadOverview({data}) {
  const session = useSession();
  const [overview, setOverview] = useState([
  {
    titleName: "Funds Raize's Gold Plan",
    type: "plan",
    bgImage: "/plan.svg",
    renewal: "",
    user: "",
  },
  {
    titleName: "All Leads",
    type: "leads",
    count: 0,
    buttonLabel: "Add Leads",
    buttonIcon: <Plus className="h-4 w-4" />,
    bgImage: "/all-leads.svg",
    link:"/crm/loans",
  },
  {
    titleName: "Active Leads",
    type: "active",
    count: 0,
    buttonLabel: "View Leads",
    buttonIcon: <Eye className="h-4 w-4" />,
    bgImage: "/active-leads.svg",
    link:"/crm/leads",
  },
])
  useEffect(() => {
   setOverview((prev) => {
    return prev.map((card) => {
      if (card.type === "plan") {
        return {
          ...card,
          user: session.data?.user?.name,
          titleName: `Funds Raize's ${session.data?.user?.planName }`,
        };
      }
      return card;
    });
  });
  }, [session.data]);

  useEffect(() => {
    if (data) {
      setOverview((prev) => {
        return prev.map((card) => {
          if (card.type === "leads") {
            const count = data?.length;
            return { ...card, count };
          }
          if (card.type === "active") {
            const activeCount = data?.filter(lead => lead.status === "approved").length;
            return { ...card, count: activeCount };
          }
          return card;
        });
      });
    }
  }, [data]);

  return (
    <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {overview.map((card, index) => {
        if (card.type === "plan") {
          return (
            <div
              key={index}
              className="relative aspect-[16/9] md:aspect-auto md:h-36 bg-center bg-cover rounded-lg flex flex-col justify-end shadow-sm shadow-neutral-400"
              style={{ backgroundImage: `url(${card.bgImage})` }}
            >
              <h5 className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-inter text-black drop-shadow">
                {card.titleName}
              </h5>
              <div className="bg-gradient-to-br from-[#121212] to-[#353535] px-3 py-2 md:px-4 md:py-3 rounded-b-lg flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-white text-xs md:text-sm">{card.user}</span>
                </div>
                <Link href="/#plans" className="bg-[#f5d949] text-black text-[10px] md:text-xs px-2 py-1 md:px-2.5 md:py-1 rounded-md flex items-center gap-1 shadow-md">
                  <span>UPGRADE</span>
                  <div className="bg-black rounded p-0.5">
                    <ArrowUpRight className="w-3 h-3 text-white" />
                  </div>
                </Link>
              </div>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="relative aspect-[16/9] md:aspect-auto md:h-36 bg-cover bg-center rounded-lg flex flex-col justify-between p-3 md:p-4 shadow-sm shadow-neutral-400"
            style={{ backgroundImage: `url(${card.bgImage})` }}
          >
            <h4 className="text-lg md:text-xl font-bold text-black drop-shadow">
              {card.titleName}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-xl md:text-2xl font-bold text-black drop-shadow">
                {card.count}
              </span>
              <Link href={card.link} className="text-xs md:text-sm bg-black text-white px-3 py-1 md:px-4 md:py-1 rounded-md flex items-center gap-1 shadow-sm">
                <span>{card.buttonLabel}</span>
                {card.buttonIcon}
              </Link>
            </div>
          </div>
        );
      })}
    </section>
  );
}