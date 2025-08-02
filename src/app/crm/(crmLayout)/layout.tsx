import React from "react";
import Banner from "@/components/crm/banner";

export default async function CrmLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-gray-100 px-2 lg:px-8 pt-8 font-space-grotesk overflow-hidden">
			<Banner />
			{children}
		</div>
	);
}
