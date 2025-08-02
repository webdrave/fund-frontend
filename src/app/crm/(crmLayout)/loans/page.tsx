"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsIcon,
  TabsLabel,
  TabsDescription,
} from "@/components/ui/tab"; // This import now pulls the responsive TabsList
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import {
  TableWrapper,
  TableHeadings,
  TableRow,
  EmailCell,
  StatusBadge,
  ViewAllButton,
} from "@/components/ui/data-table";
import { House, User, Car, Building, LandPlot, History } from "lucide-react";
import Link from "next/link";
import { useGetLoansByDsaIdQuery } from "@/redux/services/loanApi";
import { RequireFeature } from "@/components/RequireFeature";
import { useGetLoanTemplatesByTypeQuery } from "@/redux/services/loanTemplateApi";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

export default function Page() {
  const session = useSession();
  const dsaId = session.data?.user?.id || "";
  const { data, isLoading } = useGetLoansByDsaIdQuery(dsaId);
  const loansData = data?.filter((loan: any) => loan.loanType === "private") || [];
  const { data: loansTemplates = [], isLoading: isTemplatesLoading } =
    useGetLoanTemplatesByTypeQuery("private");

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
        const nameA = (a.values?.[0]?.fields?.[0]?.value || "").toLowerCase();
        const nameB = (b.values?.[0]?.fields?.[0]?.value || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "name-desc") {
        const nameA = (a.values?.[0]?.fields?.[0]?.value || "").toLowerCase();
        const nameB = (b.values?.[0]?.fields?.[0]?.value || "").toLowerCase();
        return nameB.localeCompare(nameA);
      }
      return 0;
    });
    return leads;
  }, [loansData, search, statusFilter, sortBy]);

  return (
    <RequireFeature feature="Loans">
      {(isLoading || isTemplatesLoading) ? (
        <Loading />
      ) : (
      <div className="max-w-full overflow-hidden sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          {/* Added margin-bottom for mobile */}
          <h4 className="font-semibold text-black mb-4 sm:mb-0">Loan Types</h4>
          <Link href="/crm/drafts">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm w-full sm:w-auto justify-center"> {/* Added w-full sm:w-auto justify-center for responsiveness */}
              <History className="w-4 h-4" />
              Saved Drafts
            </button>
          </Link>
        </div>

        <Tabs defaultValue="personal">
          {/* Removed className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" from here
              because it's now handled internally by TabsList component itself for robustness.
          */}
          <TabsList>
            {loansTemplates.map((template: any) => (
              <Link key={template.id} href={`/crm/loan-form?id=${template.id}`}>
                <TabsTrigger value={template.id}>
                  <TabsIcon>
                    {template.icon === "user" ? (
                      <User className="text-black" />
                    ) : template.icon === "home" ? (
                      <House className="text-black" />
                    ) : template.icon === "car" ? (
                      <Car className="text-black" />
                    ) : template.icon === "building" ? (
                      <Building className="text-black" />
                    ) : template.icon === "landplot" ? (
                      <LandPlot className="text-black" />
                    ) : (
                      <User className="text-black" />
                    )}
                  </TabsIcon>
                  <TabsLabel>
                    <div className="text-black">
                      {template.name}
                      </div>
                    <TabsDescription>
                      {template.description || "No description available"}
                    </TabsDescription>
                  </TabsLabel>
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </Tabs>

        {/* Loan Leads Table */}
        <div className="mt-6">
          <div className="py-4">
            {/* Flex container for "All Leads" title and controls: stacks on mobile, row on md+ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h4 className="text-lg font-semibold text-black mb-4 md:mb-0">All Leads</h4>
              {/* Controls: flex-col on mobile, sm:flex-row on small mobile to allow side-by-side if space,
                  md:flex-row and no-wrap for desktop. Added gap-2 for spacing.
                  w-full on mobile, md:w-auto for desktop.
              */}
              <div className="flex flex-col sm:flex-row md:flex-row md:flex-nowrap justify-end gap-2 mb-4 mt-0 md:mt-4 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white px-2 py-1 rounded w-full sm:w-auto" // w-full on mobile, w-auto on sm+
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border bg-white px-2 py-1 rounded w-full sm:w-auto" // w-full on mobile, w-auto on sm+
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border bg-white px-2 py-1 rounded w-full sm:w-auto" // w-full on mobile, w-auto on sm+
                >
                  <option value="date-desc">Sort by Latest</option>
                  <option value="date-asc">Sort by Oldest</option>
                  <option value="name-asc">Sort by Name (A-Z)</option>
                  <option value="name-desc">Sort by Name (Z-A)</option>
                </Select>
              </div>
            </div>

            {/* TableWrapper with horizontal scrolling for overflow */}
            <TableWrapper className="overflow-x-auto">
              <table className="w-full bg-white text-sm whitespace-nowrap"> {/* Added whitespace-nowrap to prevent cell content wrapping */}
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
}