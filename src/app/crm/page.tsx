"use client";
import Banner from "@/components/crm/banner";
import LeadOverview from "@/components/crm/leads";
import Statistics from "@/components/crm/statistics";
import Banks from "@/components/crm/banks";
import Testimonials from "@/components/crm/testimonials";
import Footer from "@/components/crm/footer";
import {
  useGetLoansByDsaIdQuery,
} from "@/redux/services/loanApi";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
export default function Page() {
  const session = useSession();
  const dsaId = session.data?.user?.id || "";
  const { data, isLoading } = useGetLoansByDsaIdQuery(dsaId);
  return (
    <div className="px-4 sm:px-6 md:px-8 py-4">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Banner />
          <LeadOverview data={data} />
          <Statistics data={data} />
          <Banks />
          <Testimonials />
          <Footer />
        </>
      )}
    </div>
  );
}
