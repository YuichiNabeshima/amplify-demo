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
  const [isAnimating, setIsAnimating] = useState(false)

  const isPartner = userType === "partner"
  const primaryColor = isPartner ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"
  const iconColor = isPartner ? "text-orange-500" : "text-primary"
  const hoverColor = isPartner ? "hover:text-orange-500" : "hover:text-primary"

  const openMenu = () => {
    setIsOpen(true)
    setIsAnimating(true)
  }

  const closeMenu = () => {
    setIsAnimating(false)
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsOpen(false)
    }, 300)
  }

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const handleSignOut = async () => {
    await onSignOut()
    closeMenu()
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
        closeMenu()
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

      {isOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 px-4">
          <div className="space-y-4">
            <Link
              href="/partners"
              className="block text-gray-600 hover:text-primary"
              onClick={closeMenu}
            >
              Find Painters
            </Link>
            <Link
              href="/about"
              className="block text-gray-600 hover:text-primary"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-600 hover:text-primary"
              onClick={closeMenu}
            >
              Contact
            </Link>

            {!isAuthenticated ? (
              <>
                <Link href="/auth/customer" onClick={closeMenu}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    Customer Login
                  </Button>
                </Link>
                <Link href="/auth/partner" onClick={closeMenu}>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Partner Login
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {userType === "customer" && (
                  <Link href="/dashboard" onClick={closeMenu}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      My Dashboard
                    </Button>
                  </Link>
                )}
                {userType === "partner" && (
                  <Link href="/dashboard/partner" onClick={closeMenu}>
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
      )}
    </div>
  )
}
