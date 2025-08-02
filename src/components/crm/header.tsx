"use client";
import NotificationPanel from "./notificationPanel";
import ProfilePanel from "./profilePanel";
import { useSession } from "next-auth/react";

interface NotificationPanel {
	userId: string;
}
interface ProfilePanel {
	 user: string;
}

export default function 	Header() {
	const { data: session } = useSession();

	return (
		<header className="bg-white shadow-md py-2 sm:py-3 px-3 sm:px-4 md:px-6 flex items-center justify-between z-50 sticky top-0 font-space-grotesk">
			{/* Left: Welcome text */}
			<div className="hidden lg:flex items-center">
				<span className="text-gray-700 text-sm sm:text-lg font-medium">
					Welcome,{" "}
					<span className="text-[#ffb700]">
						{session?.user?.name || "User"}
					</span>
				</span>
			</div>

			{/* Mobile: Company Logo or Name */}
			<div className="flex lg:hidden items-center">
				<span className="text-gray-900 text-sm font-bold">
					FundsRaize
				</span>
			</div>

			{/* Right: Notification & Profile */}
			<div className="flex items-center space-x-2 sm:space-x-4">
				<NotificationPanel userId={session?.user?.id || ""} pane="left" />
				<ProfilePanel user={{ 
					id: session?.user?.id || "", 
					name: session?.user?.name || "", 
					email: session?.user?.email || "" 
				}} />
			</div>
		</header>
	);
}