"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PaintBucket, Menu, X } from "lucide-react"

interface MobileMenuProps {
  userType?: "customer" | "partner" | null
  isAuthenticated?: boolean
}

export function MobileMenu({ userType, isAuthenticated }: MobileMenuProps) {
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
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        <div className="relative w-5 h-5">
          {/* Animated Menu/Close Icon */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"}`}
          >
            <Menu className="h-5 w-5" />
          </div>
          <div
            className={`absolute inset-0 transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "rotate-180 opacity-0"}`}
          >
            <X className="h-5 w-5" />
          </div>
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with fade animation */}
          <div
            className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
              isAnimating ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMenu}
          />

          {/* Menu Panel with slide animation */}
          <div
            className={`fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              isAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2 opacity-0 animate-fade-in-delay-1">
                  <PaintBucket className={`h-6 w-6 ${iconColor}`} />
                  <span className="text-lg font-bold text-gray-900">
                    Painting
                    {isPartner && <span className="text-orange-500 block text-sm font-normal">Partner Portal</span>}
                  </span>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 opacity-0 animate-fade-in-delay-1"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links with staggered animation */}
              <nav className="flex flex-col p-4 border-b">
                <Link
                  href="/partners"
                  className={`py-3 text-gray-600 ${hoverColor} transition-all duration-200 border-b border-gray-100 last:border-b-0 opacity-0 animate-fade-in-delay-2 hover:translate-x-1`}
                  onClick={closeMenu}
                >
                  Find Painters
                </Link>
                <Link
                  href="/about"
                  className={`py-3 text-gray-600 ${hoverColor} transition-all duration-200 border-b border-gray-100 last:border-b-0 opacity-0 animate-fade-in-delay-3 hover:translate-x-1`}
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className={`py-3 text-gray-600 ${hoverColor} transition-all duration-200 border-b border-gray-100 last:border-b-0 opacity-0 animate-fade-in-delay-4 hover:translate-x-1`}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </nav>

              {/* Auth Buttons with animation */}
              <div className="flex flex-col p-4 space-y-3 mt-auto">
                {!isAuthenticated ? (
                  <>
                    <Link href="/auth/customer" onClick={closeMenu}>
                      <Button
                        variant="outline"
                        className="w-full opacity-0 animate-fade-in-delay-5 hover:scale-105 transition-all duration-200"
                      >
                        Customer Login
                      </Button>
                    </Link>
                    <Link href="/auth/partner" onClick={closeMenu}>
                      <Button
                        className={`${primaryColor} w-full opacity-0 animate-fade-in-delay-6 hover:scale-105 transition-all duration-200`}
                      >
                        Partner Login
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    {userType === "customer" && (
                      <Link href="/dashboard" onClick={closeMenu}>
                        <Button
                          variant="outline"
                          className="w-full opacity-0 animate-fade-in-delay-5 hover:scale-105 transition-all duration-200"
                        >
                          My Dashboard
                        </Button>
                      </Link>
                    )}
                    {userType === "partner" && (
                      <Link href="/partner/dashboard" onClick={closeMenu}>
                        <Button
                          variant="outline"
                          className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 opacity-0 animate-fade-in-delay-5 hover:scale-105 transition-all duration-200"
                        >
                          Partner Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full opacity-0 animate-fade-in-delay-6 hover:scale-105 transition-all duration-200"
                      onClick={closeMenu}
                    >
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
