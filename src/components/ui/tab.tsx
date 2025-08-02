"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

interface TabsContextType {
    value: string;
    setValue: (val: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
    const context = useContext(TabsContext);
    if (!context) throw new Error("Tabs components must be used inside <Tabs>");
    return context;
}

interface TabsProps {
    defaultValue?: string;
    children: React.ReactNode;
    className?: string;
}

export function Tabs({ defaultValue = "", children, className }: TabsProps) {
    const [value, setValue] = useState(defaultValue);

    const contextValue = useMemo(() => ({ value, setValue }), [value]);

    return (
        <TabsContext.Provider value={contextValue}>
            <div className={`w-full ${className || ''}`}>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-2 lg:p-6 rounded-lg shadow-sm
                ${className || ''}`}
        >
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
    const { value: active, setValue } = useTabsContext();
    const isActive = value === active;

    return (
        <button
            onClick={() => setValue(value)}
            // Adjusted horizontal padding for responsiveness (px-3 py-2 sm:px-4 sm:py-3)
            // min-h-[70px] for consistent height, ensuring content fits.
            className={`w-full flex items-center gap-4 text-left rounded-md border text-sm transition-all hover:shadow-md
                px-3 py-2 sm:px-4 sm:py-3 min-h-[70px]
                ${isActive ? "bg-[#f5d949] border-yellow-300 font-semibold text-black" : "bg-white border-neutral-600 text-gray-800"},
                ${className || ''}`}
        >
            {children}
        </button>
    );
}

interface TabsIconProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsIcon({ children, className }: TabsIconProps) {
    return <div className={`w-5 h-5 flex-shrink-0 ${className || ''}`}>{children}</div>;
}

interface TabsLabelProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsLabel({ children, className }: TabsLabelProps) {
    return (
        // Changed to flex-col to stack name and description vertically
        <div className={`flex flex-col flex-grow ${className || ''}`}>
            {children}
        </div>
    );
}

interface TabsDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function TabsDescription({ children, className }: TabsDescriptionProps) {
    return (
        // h-6 with overflow-hidden for consistent height of description
        <div className={`text-[0.5rem] text-gray-600 mt-1 h-6 overflow-hidden text-ellipsis ${className || ''}`}>
            {children}
        </div>
    );
}