"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "@/components/mobile-menu"
import { PaintBucket } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { post } from '@/src/lib/amplify'

interface HeaderProps {
  userType?: "customer" | "partner" | null
  isAuthenticated?: boolean
}

export function Header({ userType, isAuthenticated }: HeaderProps) {
  const router = useRouter()
  const { loading } = useAuth()
  const isPartner = userType === "partner"
  const iconColor = isPartner ? "text-orange-500" : "text-primary"

  const handleSignOut = async () => {
    try {
      await post({ 
        apiName: 'myHttpApi',
        path: '/signout' 
      }).response;

      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </header>
    )
  }

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
          </nav>

          {/* Desktop Auth Buttons - Hidden on mobile, shown on medium+ screens */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/customer">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Customer Login
                  </Button>
                </Link>
                <Link href="/auth/partner">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Partner Login
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {userType === "customer" && (
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      My Dashboard
                    </Button>
                  </Link>
                )}
                {userType === "partner" && (
                  <Link href="/partner/dashboard">
                    <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                      Partner Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
              </>
            )}
          </div>

          {/* Mobile Menu - Only shown on mobile/tablet, hidden on desktop */}
          <MobileMenu userType={userType} isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />
        </div>
      </div>
    </header>
  )
}
