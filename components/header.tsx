"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { PaintBucket } from "lucide-react"

interface HeaderProps {
  userType?: "customer" | "partner" | null
  isAuthenticated?: boolean
}

export function Header({ userType, isAuthenticated }: HeaderProps) {
  const isPartner = userType === "partner"
  const primaryColor = isPartner ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"
  const iconColor = isPartner ? "text-orange-500" : "text-primary"

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <PaintBucket className={`h-6 w-6 md:h-8 md:w-8 ${iconColor}`} />
            <span className="text-lg md:text-2xl font-bold text-gray-900 truncate">
              Painting
              {isPartner && <span className="text-orange-500 ml-2">Partner</span>}
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile/tablet, shown on large screens */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/partners"
              className={`text-gray-600 hover:${isPartner ? "text-orange-500" : "text-primary"} transition-colors`}
            >
              Find Painters
            </Link>
            <Link
              href="/about"
              className={`text-gray-600 hover:${isPartner ? "text-orange-500" : "text-primary"} transition-colors`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-gray-600 hover:${isPartner ? "text-orange-500" : "text-primary"} transition-colors`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons - Hidden on mobile, shown on medium+ screens */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/customer">
                  <Button variant="outline">Customer Login</Button>
                </Link>
                <Link href="/auth/partner">
                  <Button className={primaryColor}>Partner Login</Button>
                </Link>
              </>
            ) : (
              <>
                {userType === "customer" && (
                  <Link href="/dashboard">
                    <Button variant="outline">My Dashboard</Button>
                  </Link>
                )}
                {userType === "partner" && (
                  <Link href="/partner/dashboard">
                    <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                      Partner Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost">Sign Out</Button>
              </>
            )}
          </div>

          {/* Mobile Menu - Only shown on mobile/tablet, hidden on desktop */}
          <MobileMenu userType={userType} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </header>
  )
}
