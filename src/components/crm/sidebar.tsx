"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image'
import { usePathname } from "next/navigation";
import {
	BadgeIndianRupee,
	BookOpenText,
	Calculator,
	HandCoins,
	Handshake,
	House,
	Landmark,
	LogOutIcon,
	Megaphone,
	MessageSquareText,
	PanelLeftClose,
	Menu,
	X,
	Timer,
	Users,
} from "lucide-react";
import logo from "../../../public/assets/logo.png"; // Adjust the path as necessary
import { signOut } from "next-auth/react";

interface NavItem {
	href: string;
	label: string;
	icon: React.ReactNode;
}

const navItems: NavItem[] = [
	{ href: "", label: "Home", icon: <House /> },
	{ href: "/leads", label: "Leads", icon: <Users /> },
	{ href: "/loans", label: "Loans", icon: <HandCoins /> },
	{ href: "/govt-loans", label: "Govt. Loans", icon: <Landmark /> },
	{ href: "/insurance", label: "Insurance", icon: <Handshake /> },
	{ href: "/quick-loans", label: "Quick Loans", icon: <Timer /> },
	{ href: "/drafts", label: "Drafts", icon: <Timer /> },
	{
		href: "/campaign-marketing",
		label: "Campaign & Marketing",
		icon: <Megaphone />,
	},
	{ href: "/taxation", label: "Taxation", icon: <BadgeIndianRupee /> },
	{
		href: "/emi-calculator",
		label: "EMI Calculator",
		icon: <Calculator />,
	},
	{
		href: "/training-support",
		label: "Training & Support",
		icon: <BookOpenText />,
	},
	{
		href: "/feedback-grievance",
		label: "Feedback & Grievance",
		icon: <MessageSquareText />,
	},
];

const Sidebar = () => {
	const [open, setOpen] = useState(true); // Default state - will be adjusted in useEffect
	const [isMobile, setIsMobile] = useState(false);
	const baseUrl = "/crm";
	const pathname = usePathname();

	// Check if we're in a mobile viewport
	useEffect(() => {
		const checkIfMobile = () => {
			const isMobileView = window.innerWidth < 768;
			setIsMobile(isMobileView);
			
			// Close sidebar by default on mobile, keep open on desktop
			setOpen(!isMobileView);
		};

		// Initial check
		checkIfMobile();
		
		// Add resize listener
		window.addEventListener('resize', checkIfMobile);
		
		// Cleanup
		return () => window.removeEventListener('resize', checkIfMobile);
	}, []);

	const toggleSidebar = () => setOpen((prev) => !prev);

	return (
		<>
			{/* Mobile hamburger menu (only visible on mobile when sidebar is closed) */}
			{isMobile && !open && (
				<div className="fixed top-4 left-4 z-[1001]">
					<button
						onClick={toggleSidebar}
						className="p-2 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100"
						aria-label="Open sidebar"
					>
						<Menu size={24} className="text-black" />
					</button>
				</div>
			)}

			{/* Overlay for mobile (only visible when sidebar is open on mobile) */}
			{open && isMobile && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
					onClick={toggleSidebar}
					style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
				/>
			)}

			<aside
				className={`fixed md:relative flex flex-col bg-white shadow-lg h-full z-[1000] transition-all duration-300 ease-in-out
					${isMobile ? 
						(open ? "translate-x-0 w-64" : "-translate-x-full") : 
						(open ? "w-64" : "w-20")}
				`}
				style={{ position: 'fixed', top: 0, left: 0, bottom: 0 }}
			>
				<div>
					{/* Header */}
					<div className="text-black flex items-center justify-between px-4 py-4 border-b border-gray-200">
						<Link href="/crm">
							<Image
								src={logo}
								alt="Logo"
								width={40}
								height={40}
								className={`transition-all duration-300 ${open ? "w-10 h-10" : "w-0 h-0"}`}
								quality={100}
								placeholder="blur"
								blurDataURL="/placeholder.svg" // Placeholder image for blur effect
							/>
						</Link>

						{/* Toggle button */}
						<button
							onClick={toggleSidebar}
							aria-label="Toggle sidebar"
							className="p-1 rounded hover:bg-gray-200"
						>
							{isMobile ? (
								<X className="cursor-pointer" />
							) : (
								<PanelLeftClose className={`cursor-pointer ${!open ? 'rotate-180' : ''}`} />
							)}
						</button>
					</div>

					{/* Navigation */}
					<nav className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-80px)]">
						<ul className="flex flex-col gap-2">
							{navItems.map(({ href, label, icon }) => {
								const isActive = pathname === `${baseUrl}${href}`;
								return (
									<li key={href}>
										<Link
											href={`${baseUrl}${href}`}
											className={`flex items-center p-2 gap-3 rounded-lg text-sm transition-colors duration-200 ${isActive
												? "bg-[#f5d949] text-black"
												: "text-black hover:bg-gray-200"
												}`}
											onClick={isMobile ? toggleSidebar : undefined}
										>
											<div>{icon}</div>
											<span className={`${!open && !isMobile ? 'hidden' : 'block'}`}>{label}</span>
										</Link>
									</li>
								);
							})}
						</ul>

						{/* Logout */}
						<div
							onClick={() => {
								signOut();
								if (isMobile) toggleSidebar();
							}}
							className="flex items-center p-2 gap-3 rounded-lg text-sm text-neutral-500 hover:bg-gray-200 transition-colors duration-200 cursor-pointer mt-auto"
						>
							<LogOutIcon />
							<span className={`${!open && !isMobile ? 'hidden' : 'block'}`}>Log Out</span>
						</div>
					</nav>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
