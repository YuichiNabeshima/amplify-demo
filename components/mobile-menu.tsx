"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PaintBucket, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface MobileMenuProps {
  userType?: "customer" | "partner" | null
  isAuthenticated?: boolean
  onSignOut: () => Promise<void>
}

export function MobileMenu({ userType, isAuthenticated, onSignOut }: MobileMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const isPartner = userType === "partner"
  const primaryColor = isPartner ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"
  const iconColor = isPartner ? "text-orange-500" : "text-primary"
  const hoverColor = isPartner ? "hover:text-orange-500" : "hover:text-primary"

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleSignOut = async () => {
    await onSignOut()
    setIsOpen(false)
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <PaintBucket className={`h-6 w-6 ${iconColor}`} />
              <span className="text-lg font-bold text-gray-900">
                Painting
                {isPartner && <span className="text-orange-500 ml-2">Partner</span>}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <Link
              href="/partners"
              className="block text-gray-600 hover:text-primary py-2"
              onClick={() => setIsOpen(false)}
            >
              Find Painters
            </Link>

            {!isAuthenticated ? (
              <>
                <Link href="/auth/customer" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    Customer Login
                  </Button>
                </Link>
                <Link href="/auth/partner" onClick={() => setIsOpen(false)}>
                  <Button className={`w-full ${primaryColor}`}>
                    Partner Login
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {userType === "customer" && (
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      My Dashboard
                    </Button>
                  </Link>
                )}
                {userType === "partner" && (
                  <Link href="/partner/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                      Partner Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
