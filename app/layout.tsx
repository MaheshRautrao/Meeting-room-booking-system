import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { House, User } from "lucide-react";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigations = [
    {
      label: "Application",
      items: [{ title: "Meetings", url: "/meetings", icon: <House /> }],
    },
    {
      label: "Admin",
      items: [
        {
          title: "Meeting Rooms",
          url: "/admin/meeting-rooms",
          icon: <House />,
        },
        { title: "Users", url: "/admin/users", icon: <User /> },
      ],
    },
  ];
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar navigations={navigations} />
          <SidebarTrigger />
          <div className="w-full">
            {children}
            <Toaster richColors position="top-right" />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
