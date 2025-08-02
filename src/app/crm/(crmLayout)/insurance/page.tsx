"use client";

import React, { useMemo, useState } from "react";
import { Building, Car, House, LandPlot, User, History } from "lucide-react";

// --- Mocked Components and Hooks ---
// The following are mock implementations to resolve the compilation and hook errors.
// In your actual project, you would use your real imports.

const Link = ({
  href,
  children,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <a href={href} {...props}>
    {children}
  </a>
);

const useSession = () => ({
  data: { user: { id: "mock-dsa-id-123" } },
  status: "authenticated",
});

const mockLoanData = [
  {
    _id: "LN001",
    loanType: "insurance",
    loanSubType: "Vehicle Insurance",
    mode: "Online",
    createdAt: "2023-10-26T10:00:00Z",
    subscriber: "subscriber1@example.com",
    rejectionMessage: "",
    status: "approved",
    values: [
      {
        fields: [
          { value: "Alice Johnson" },
          { value: "alice.j@example.com" },
          { value: "555-0101" },
        ],
      },
    ],
  },
  {
    _id: "LN002",
    loanType: "insurance",
    loanSubType: "Health Insurance",
    mode: "Offline",
    createdAt: "2023-10-25T11:30:00Z",
    subscriber: "subscriber2@example.com",
    rejectionMessage: "Incomplete documentation",
    status: "rejected",
    values: [
      {
        fields: [
          { value: "Bob Williams" },
          { value: "bob.w@example.com" },
          { value: "555-0102" },
        ],
      },
    ],
  },
  {
    _id: "LN003",
    loanType: "insurance",
    loanSubType: "Home Insurance",
    mode: "Online",
    createdAt: "2023-10-24T09:00:00Z",
    subscriber: "subscriber3@example.com",
    rejectionMessage: "",
    status: "pending",
    values: [
      {
        fields: [
          { value: "Charlie Brown" },
          { value: "charlie.b@example.com" },
          { value: "555-0103" },
        ],
      },
    ],
  },
];

const mockTemplateData = [
  {
    id: "template1",
    name: "Personal Accident",
    description: "Cover for accidents and more words to test wrapping",
    icon: "user",
  },
  {
    id: "template2",
    name: "Home Shield",
    description: "Protection for your house and property from various perils",
    icon: "home",
  },
  {
    id: "template3",
    name: "Auto Secure",
    description:
      "Comprehensive coverage for your vehicle, including theft and damage",
    icon: "car",
  },
  {
    id: "template4",
    name: "Business Policy",
    description: "Insurance for your business operations and assets",
    icon: "building",
  },
];

const useGetLoansByDsaIdQuery = (dsaId: string) => ({
  data: mockLoanData,
  isLoading: false,
});
const useGetLoanTemplatesByTypeQuery = (type: string) => ({
  data: mockTemplateData,
  isLoading: false,
});

const RequireFeature = ({
  children,
  feature,
}: {
  children: React.ReactNode;
  feature?: string;
}) => <>{children}</>;
const Loading = () => <div className="p-8 text-center text-lg">Loading...</div>;

// Mock UI Components - REVISED FOR RESPONSIVENESS AND HEIGHT CONSISTENCY
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`border bg-white ${props.className || ""}`} />
);
const Select = ({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`border bg-white ${props.className || ""}`}>
    {children}
  </select>
);

// Tabs Components - REVISED MOCKS
// Tabs is a simple wrapper for context, no style changes needed here.
const Tabs = ({ children }: { children: React.ReactNode }) => {
  const [activeValue, setActiveValue] = useState(""); // Internal state for Tabs context
  const contextValue = useMemo(
    () => ({ value: activeValue, setValue: setActiveValue }),
    [activeValue]
  );
  return (
    <React.Fragment>
      {" "}
      {/* Use fragment to avoid introducing an extra div if not strictly needed */}
      {/* Assuming TabsContext and useTabsContext are defined correctly in a real scenario */}
      {/* For this mock, we'll simplify and pass activeTab directly to TabsTrigger if needed or rely on parent state */}
      {children}
    </React.Fragment>
  );
};

const TabsList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  // Changed to grid, added responsive grid columns
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-6 rounded-lg shadow-sm ${className}`}
  >
    {children}
  </div>
);

const TabsTrigger = ({
  children,
  isActive,
  ...props
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}) => {
  const baseClasses =
    "w-full flex items-center gap-4 text-left rounded-md border text-sm transition-all hover:shadow-md";
  // Adjusted padding for smaller screens (px-2 py-2) and consistent min-height for evenness
  const responsivePadding = "px-2 py-2 sm:px-4 sm:py-3";
  const consistentMinHeight = "min-h-[70px]"; // Adjusted from 50px to 70px for more content room
  const activeClasses =
    "bg-[#f5d949] border-yellow-300 font-semibold text-black"; // Added text-black
  const inactiveClasses = "bg-white border-neutral-600 text-gray-800"; // Adjusted text color

  return (
    <button
      {...props}
      className={`${baseClasses} ${responsivePadding} ${consistentMinHeight} ${
        isActive ? activeClasses : inactiveClasses
      }`}
    >
      {children}
    </button>
  );
};

const TabsIcon = ({
  children,
  isActive,
}: {
  children: React.ReactNode;
  isActive?: boolean;
}) => (
  // Ensured text-black is default, and active state changes text color
  <span className={`w-5 h-5 ${isActive ? "text-black" : "text-gray-600"}`}>
    {children}
  </span>
);

const TabsLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col flex-grow">
    {" "}
    {/* Use flex-col to stack label and description */}
    <div className="font-medium text-xs text-gray-800">{children}</div>
  </div>
);

const TabsDescription = ({ children }: { children: React.ReactNode }) => (
  // Set a consistent height for the description to ensure even tab heights
  // overflow-hidden and text-ellipsis to handle long descriptions gracefully
  <div className="text-[0.5rem] text-gray-600 mt-1 h-6 overflow-hidden text-ellipsis">
    {children}
  </div>
);

const TableWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`border rounded-lg ${className}`}>{children}</div>;
const TableHeadings = ({ columns }: { columns: string[] }) => (
  <thead>
    <tr className="bg-gray-50">
      {columns.map((col, i) => (
        <th
          key={i}
          className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {col}
        </th>
      ))}
    </tr>
  </thead>
);
const TableRow = ({ row }: { row: React.ReactNode[] }) => (
  <tr className="border-b hover:bg-gray-50">
    {row.map((cell, i) => (
      <td key={i} className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {cell}
      </td>
    ))}
  </tr>
);
const EmailCell = ({ email }: { email: string }) => (
  <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
    {email}
  </a>
);
const StatusBadge = ({ status }: { status: string }) => {
  const colorClasses: Record<"approved" | "pending" | "rejected", string> = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };
  const normalizedStatus = status.toLowerCase() as keyof typeof colorClasses;
  const badgeClass =
    normalizedStatus in colorClasses
      ? colorClasses[normalizedStatus]
      : "bg-gray-100 text-gray-800";
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}
    >
      {status}
    </span>
  );
};
const ViewAllButton = () => (
  <div className="mt-4 text-center">
    <button className="text-blue-600 hover:underline cursor-pointer">
      View All
    </button>
  </div>
);

// --- Main Page Component ---

export default function Page() {
  const session = useSession();
  const dsaId = session.data?.user?.id || "";

  const { data, isLoading: loansLoading } = useGetLoansByDsaIdQuery(dsaId);
  const { data: loansTemplates = [], isLoading: templatesLoading } =
    useGetLoanTemplatesByTypeQuery("insurance");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeTab, setActiveTab] = useState(loansTemplates[0]?.id || ""); // Initialize with first template's ID

  const loansData = useMemo(
    () => data?.filter((loan) => loan.loanType === "insurance") || [],
    [data]
  );

  const filteredLeads = useMemo(() => {
    let leads = [...loansData];
    if (search) {
      leads = leads.filter(
        (lead) =>
          (lead.values[0]?.fields[0].value || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (lead.values[0]?.fields[1].value || "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      leads = leads.filter(
        (lead) =>
          (lead.status || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    leads.sort((a, b) => {
      if (sortBy === "date-desc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "date-asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortBy === "name-asc") {
        const nameA = (a.values[0]?.fields[0].value || "").toLowerCase();
        const nameB = (b.values[0]?.fields[0].value || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "name-desc") {
        const nameA = (a.values[0]?.fields[0].value || "").toLowerCase();
        const nameB = (b.values[0]?.fields[0].value || "").toLowerCase();
        return nameB.localeCompare(nameA);
      }
      return 0;
    });
    return leads;
  }, [loansData, search, statusFilter, sortBy]);

  if (loansLoading || templatesLoading) {
    return <Loading />;
  }

  return (
    <RequireFeature feature="Insurance">
      {/* Overall page container with responsive padding */}
      <div className="max-w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-6">
        {/* Header section: Insurance Types title and Saved Drafts button */}
        {/* Stacks on mobile (flex-col), becomes row on small screens and up (sm:flex-row) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h4 className="font-semibold text-black mb-4 sm:mb-0">
            Insurance Types
          </h4>
          <Link href="/crm/drafts">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm w-full sm:w-auto justify-center">
              <History className="w-4 h-4" />
              Saved Drafts
            </button>
          </Link>
        </div>

        {/* Tabs Section */}
        <Tabs>
          {/* TabsList uses responsive grid classes (grid-cols-1 on xs, sm:grid-cols-2, lg:grid-cols-4) */}
          <TabsList>
            {loansTemplates.map((template) => {
              const isActive = activeTab === template.id;
              return (
                <Link
                  key={template.id}
                  href={`/crm/loan-form?id=${template.id}`}
                  onClick={() => setActiveTab(template.id)}
                >
                  {/* TabsTrigger now has responsive padding and min-height for consistency */}
                  <TabsTrigger isActive={isActive}>
                    <TabsIcon isActive={isActive}>
                      {template.icon === "user" ? (
                        <User />
                      ) : template.icon === "home" ? (
                        <House />
                      ) : template.icon === "car" ? (
                        <Car />
                      ) : template.icon === "building" ? (
                        <Building />
                      ) : template.icon === "landplot" ? (
                        <LandPlot />
                      ) : (
                        <User />
                      )}
                    </TabsIcon>
                    {/* TabsLabel has flex-col to stack its children */}
                    <TabsLabel>
                      {/* Name styling */}
                      <div
                        className={`text-sm ${
                          isActive ? "text-black" : "text-gray-800"
                        }`}
                      >
                        {template.name}
                      </div>
                      {/* Description with fixed height and overflow handling */}
                      <TabsDescription>
                        {template.description || "No description available"}
                      </TabsDescription>
                    </TabsLabel>
                  </TabsTrigger>
                </Link>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Insurance Leads Table Section */}
        <div className="mt-6">
          <div className="py-4">
            {/* Header for table: Insurance Leads title and filters/sort controls */}
            {/* Stacks on mobile (flex-col), becomes row on medium screens and up (md:flex-row) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h4 className="text-lg font-semibold text-black mb-4 md:mb-0">
                Insurance Leads
              </h4>
              {/* Filter/Sort controls: stack on mobile (flex-col), become row on small screens (sm:flex-row),
                  prevent wrapping on medium screens and up (md:flex-nowrap). Full width on mobile, auto on sm+. */}
              <div className="flex flex-col sm:flex-row md:flex-row md:flex-nowrap justify-end gap-2 mb-4 mt-0 md:mt-4 w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-2 py-1 rounded text-black placeholder:text-gray-500 w-full sm:w-auto"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 rounded text-gray-500 w-full sm:w-auto"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2 py-1 rounded text-gray-500 w-full sm:w-auto"
                >
                  <option value="date-desc">Sort by Latest</option>
                  <option value="date-asc">Sort by Oldest</option>
                  <option value="name-asc">Sort by Name (A-Z)</option>
                  <option value="name-desc">Sort by Name (Z-A)</option>
                </Select>
              </div>
            </div>

            {/* Table wrapper with horizontal overflow */}
            <TableWrapper className="overflow-x-auto">
              <table className="w-full bg-white text-sm whitespace-nowrap">
                <TableHeadings
                  columns={[
                    "File No.",
                    "Insurance Type",
                    "Mode",
                    "Applicant",
                    "Subscriber",
                    "Email",
                    "Phone",
                    "Review",
                    "Status",
                  ]}
                />
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <TableRow
                      key={index}
                      row={[
                        lead._id,
                        lead.loanSubType,
                        lead.mode ? lead.mode : "Online",
                        lead.values[0].fields[0].value,
                        <EmailCell
                          key={`email-sub-${index}`}
                          email={lead.subscriber}
                        />,
                        <EmailCell
                          key={`email-val-${index}`}
                          email={lead.values[0].fields[1].value}
                        />,
                        lead.values[0].fields[2].value,
                        lead.rejectionMessage || "N/A",
                        <StatusBadge
                          key={`status-${index}`}
                          status={lead.status.toLowerCase()}
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
    </RequireFeature>
  );
}
