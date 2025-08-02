"use client";
import React, { useState } from "react";
import { Users } from "lucide-react";
import { MetricGrid, MetricCard } from "@/components/ui/dashboard-metric";
import {
  TableWrapper,
  TableHeadings,
  TableRow,
  EmailCell,
  StatusBadge,
  ViewAllButton,
} from "@/components/ui/data-table";
import { useGetLoansByDsaIdQuery } from "@/redux/services/loanApi";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select"; // Assuming this is a custom Select component
import { RequireFeature } from "@/components/RequireFeature";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

type Tab = "Loans" | "Govt Loans" | "Insurance";

interface StatusCardData {
  label: string;
  value: string;
  variant?: "primary" | "secondary" | "columned";
  icon?: React.ReactNode;
  className?: string;
}

const TABS: Tab[] = ["Loans", "Govt Loans", "Insurance"];

const getDataByTab = (tab: Tab, loansData: any[] = []): StatusCardData[] => {
  if (tab === "Loans") {
    const allLoans = loansData.filter((loan) => loan.loanType === "private");
    const pendingLoans = allLoans.filter((loan) => loan.status === "pending");
    const approvedLoans = allLoans.filter((loan) => loan.status === "approved");
    const rejectedLoans = allLoans.filter((loan) => loan.status === "rejected");
    return [
      {
        label: "All Loans",
        value: allLoans.length.toString(),
        variant: "primary",
        icon: <Users />, // keep icon
        className: "font-bold",
      },
      {
        label: "Pending",
        value: pendingLoans.length.toString(),
        variant: "secondary",
      },
      {
        label: "Approved",
        value: approvedLoans.length.toString(),
        variant: "primary",
      },
      {
        label: "Disbursed",
        value: rejectedLoans.length.toString(),
        variant: "secondary",
      },
    ];
  }
  if (tab === "Govt Loans") {
    const allLoans = loansData.filter((loan) => loan.loanType === "government");
    const pendingLoans = allLoans.filter((loan) => loan.status === "pending");
    const approvedLoans = allLoans.filter((loan) => loan.status === "approved");
    const rejectedLoans = allLoans.filter((loan) => loan.status === "rejected");
    return [
      {
        label: "All Loans",
        value: allLoans.length.toString(),
        variant: "primary",
        icon: <Users />, // keep icon
        className: "font-bold",
      },
      {
        label: "Pending",
        value: pendingLoans.length.toString(),
        variant: "secondary",
      },
      {
        label: "Approved",
        value: approvedLoans.length.toString(),
        variant: "primary",
      },
      {
        label: "Disbursed",
        value: rejectedLoans.length.toString(),
        variant: "secondary",
      },
    ];
  }
  if (tab === "Insurance") {
    const allLoans = loansData.filter((loan) => loan.loanType === "insurance");
    const pendingLoans = allLoans.filter((loan) => loan.status === "pending");
    const approvedLoans = allLoans.filter((loan) => loan.status === "approved");
    const rejectedLoans = allLoans.filter((loan) => loan.status === "rejected");
    return [
      {
        label: "All Loans",
        value: allLoans.length.toString(),
        variant: "primary",
        icon: <Users />, // keep icon
        className: "font-bold",
      },
      {
        label: "Pending",
        value: pendingLoans.length.toString(),
        variant: "secondary",
      },
      {
        label: "Approved",
        value: approvedLoans.length.toString(),
        variant: "primary",
      },
      {
        label: "Disbursed",
        value: rejectedLoans.length.toString(),
        variant: "secondary",
      },
    ];
  }
  return [];
};

const LeadActivityStatus: React.FC = () => {
  const session = useSession();
  const dsaId = session.data?.user?.id || "";
  const [activeTab, setActiveTab] = useState<Tab>("Loans");
  const { data: loansData = [], isLoading } = useGetLoansByDsaIdQuery(dsaId);
  const data = getDataByTab(activeTab, loansData);
  // New state for search/filter/sort
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // default to latest

  // Filtered and sorted data
  const filteredLeads = useMemo(() => {
    let leads = loansData;
    // Search
    if (search) {
      leads = leads.filter(
        (lead: any) =>
          (lead.values[0]?.fields[0].value || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (lead.values[0]?.fields[1].value || "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }
    // Status filter (case-insensitive)
    if (statusFilter) {
      leads = leads.filter(
        (lead: any) =>
          (lead.status || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }
    // Sort
    leads = leads.slice().sort((a: any, b: any) => {
      if (sortBy === "date-desc") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateA === dateB) {
          return (b._id || "").localeCompare(a._id || "");
        }
        return dateB - dateA; // latest first
      }
      if (sortBy === "date-asc") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateA === dateB) {
          return (a._id || "").localeCompare(b._id || "");
        }
        return dateA - dateB; // oldest first
      }
      if (sortBy === "name-asc") {
        // Assuming 'Name' is in lead.values[0].fields[0].value or similar
        const nameA = (a.values?.[0]?.fields?.[0]?.value || "").toLowerCase();
        const nameB = (b.values?.[0]?.fields?.[0]?.value || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "name-desc") {
        // Assuming 'Name' is in lead.values[0].fields[0].value or similar
        const nameA = (a.values?.[0]?.fields?.[0]?.value || "").toLowerCase();
        const nameB = (b.values?.[0]?.fields?.[0]?.value || "").toLowerCase();
        return nameB.localeCompare(nameA);
      }
      return 0;
    });
    return leads;
  }, [loansData, search, statusFilter, sortBy]);

  return (
    <RequireFeature feature="Leads">
      {isLoading ? (
        <Loading />
      ) : (
      <div>
        <h4 className="font-semibold mb-6 text-black">Lead Activity Status</h4>

        {/* Tabs */}
        {/* Added flex-wrap for responsiveness on smaller screens */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              // Adjusted padding for smaller screens, px-4 py-2 is more suitable for mobile, px-12 for desktop
              className={`text-sm px-4 py-2 md:px-12 md:py-2 rounded ${
                tab === activeTab
                  ? "bg-[#f5d949] text-black"
                  : "bg-white text-black border-gray-300 border"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Metric Grid - Assuming MetricGrid handles its own responsiveness internally,
            e.g., via grid-cols-1 on small, grid-cols-2 on medium, grid-cols-4 on large.
            If not, Tailwind's responsive grid classes (e.g., grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
            would be applied directly to MetricGrid or its parent.
        */}
        <MetricGrid>
          {data.map(({ label, value, variant, icon, className }, index) => (
            <MetricCard
              key={index}
              label={label}
              value={value}
              icon={icon}
              variant={variant}
              className={className}
            />
          ))}
        </MetricGrid>

        {/* Search, Filter, Sort Controls */}
        <div className="mt-6">
          <div className="py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center"> {/* Changed to flex-col on mobile, flex-row on md+ */}
              <h4 className="text-lg font-semibold text-black mb-4 md:mb-0">All Leads</h4> {/* Added margin-bottom for mobile */}
              {/* Updated flex behavior for controls to ensure single line on desktop */}
              <div className="flex flex-col sm:flex-row md:flex-row md:flex-nowrap justify-end gap-2 mb-4 mt-0 md:mt-4 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border bg-white px-2 py-1 rounded w-full sm:w-auto" // Added w-full for mobile, w-auto for sm+
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border bg-white px-2 py-1 rounded w-full sm:w-auto" // Added w-full for mobile, w-auto for sm+
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border bg-white px-2 py-1 rounded w-full sm:w-auto" // Added w-full for mobile, w-auto for sm+
                >
                  <option value="date-desc">Sort by Latest</option>
                  <option value="date-asc">Sort by Oldest</option>
                  <option value="name-asc">Sort by Name (A-Z)</option>
                  <option value="name-desc">Sort by Name (Z-A)</option>
                </Select>
              </div>
            </div>

            {/* TableWrapper now has overflow-x-auto for horizontal scrolling on small screens */}
            <TableWrapper className="overflow-x-auto">
              <table className="w-full bg-white overflow-hidden text-sm">
                <TableHeadings
                  columns={[
                    "File No.",
                    "Loan",
                    "Loan Mode",
                    "Applicant",
                    "Subscriber",
                    "Email",
                    "Phone",
                    "Review",
                    "Status",
                  ]}
                />
                <tbody>
                  {filteredLeads.map((lead: any, index: number) => (
                    <TableRow
                      key={index}
                      row={[
                        lead._id,
                        lead.loanSubType,
                        lead.mode ? lead.mode : "Online",
                        lead.values[0].fields[0].value,
                        <EmailCell key={`sub-${index}`} email={lead.subscriber} />,
                        <EmailCell key={`email-${index}`} email={lead.values[0].fields[1].value} />,
                        lead.values[0].fields[2].value,
                        lead.rejectionMessage,
                        <StatusBadge
                          key={`status-${index}`}
                          status={
                            lead.status.toLowerCase() as
                              | "approved"
                              | "pending"
                              | "rejected"
                          }
                        />,
                      ]}
                    />
                  ))}
                </tbody>
              </table>
            </TableWrapper>

            <ViewAllButton />
          </div>
        </div>
      </div>
      )}
    </RequireFeature>
  );
};

export default LeadActivityStatus;