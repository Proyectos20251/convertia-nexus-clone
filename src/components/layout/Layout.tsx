
import React from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className="flex h-full bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col md:ml-[250px]">
        <Header />
        
        <main className={cn("flex-1 p-4 overflow-y-auto", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
