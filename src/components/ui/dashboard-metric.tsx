import React from "react";

interface MetricGridProps {
	children: React.ReactNode;
	className?: string;
}

export function MetricGrid({ children, className }: MetricGridProps) {
	return (
		<div
			className={`grid grid-cols-4 gap-4 bg-white px-4 py-4 lg:py-6 rounded-lg shadow-md ${className}`}
		>
			{children}
		</div>
	);
}

interface MetricCardProps {
	label: string;
	value: string | number;
	icon?: React.ReactNode;
	variant?: "primary" | "secondary" | "columned";
	className?: string;
}

export function MetricCard({
	label,
	value,
	icon,
	variant = "primary",
	className,
}: MetricCardProps) {
	const baseStyles =
		"col-span-2 rounded lg:py-5 py-2 px-2 flex items-center justify-between text-md font-medium";
	const variantStyles = {
		primary: `${baseStyles} bg-[#f5d949] text-black`,
		secondary: ` ${baseStyles} bg-[#2d2c2c] text-white`,
		columned:
			"flex flex-col-reverse items-start col-span-1 px-6 py-3 rounded bg-[#f5d949] text-sm font-medium text-black",
	};

	return (
		<div className={`${variantStyles[variant]} ${className}`}>
			<span className="flex items-center gap-3">
				{icon && <span className="text-lg">{icon}</span>}
				{label}
			</span>
			<span className="text-lg font-bold">{value}</span>
		</div>
	);
}
