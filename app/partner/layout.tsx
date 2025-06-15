"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header userType="partner" isAuthenticated={true} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex space-x-4 mb-8">
          <Link href="/partner/dashboard">
            <Button
              variant={pathname === "/partner/dashboard" ? "default" : "outline"}
              className={pathname === "/partner/dashboard" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/partner/settings">
            <Button
              variant={pathname === "/partner/settings" ? "default" : "outline"}
              className={pathname === "/partner/settings" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        {children}
      </div>
      <Footer />
    </div>
  )
} 