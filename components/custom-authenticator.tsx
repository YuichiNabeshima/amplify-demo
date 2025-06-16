"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { post } from '@/src/lib/amplify'
import { AuthResponse } from '@/src/types/api'

interface AuthenticatorProps {
  userType: "customer" | "partner"
  onAuthSuccess?: (user: any) => void
}

interface FormData {
  email: string
  password: string
  confirmPassword: string
  name?: string
  companyName?: string
  businessPhone?: string
  address?: string
}

export function CustomAuthenticator({ userType, onAuthSuccess }: AuthenticatorProps) {
  const [activeTab, setActiveTab] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const isPartner = userType === "partner"
  const primaryColor = isPartner ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    companyName: "",
    businessPhone: "",
    address: "",
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    setError("")

    if (!formData.email) {
      setError("Email is required")
      return false
    }

    if (!formData.password) {
      setError("Password is required")
      return false
    }

    if (activeTab === "signup") {
      if (userType === "customer" && !formData.name) {
        setError("Name is required")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (userType === "partner") {
        if (!formData.companyName) {
          setError("Company name is required")
          return false
        }
        if (!formData.businessPhone) {
          setError("Business phone is required")
          return false
        }
        if (!formData.address) {
          setError("Business address is required")
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const response = await post({ 
        apiName: 'myHttpApi',
        path: activeTab === "signin" ? '/signin' : '/signup',
        options: {
          body: {
            email: formData.email,
          password: formData.password,
            userType,
            ...(activeTab === "signup" && {
              name: formData.name,
              companyName: formData.companyName,
              businessPhone: formData.businessPhone,
              address: formData.address,
            }),
          }
        }
      }).response;

      const data = await response.body.json() as unknown as AuthResponse;

      if (!data.token) {
        throw new Error("Authentication failed")
      }

      // Store the token
      document.cookie = `token=${data.token}; path=/`

      // Redirect based on user type
      if (userType === "partner") {
        window.location.href = "/partner/dashboard"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError(error instanceof Error ? error.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
    setIsLoading(true)
      setError("")

      await post({ 
        apiName: 'myHttpApi',
        path: '/signout'
      }).response;

      // Clear the token
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

      // Redirect to appropriate auth page based on user type
      if (userType === "partner") {
        window.location.href = "/auth/partner"
      } else {
        window.location.href = "/auth"
      }
    } catch (error) {
      console.error("Sign out error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign out")
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated && user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Welcome!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              {userType === "customer" ? "Customer" : "Partner"} Account
            </h3>
            <p className="text-green-700">
              Welcome, {user.name || user.companyName || user.email}!
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => {
                const dashboardPath = userType === "customer" ? "/dashboard" : "/dashboard/partner";
                window.location.href = dashboardPath;
              }}
            >
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          {userType === "customer" ? "Customer" : "Partner"} Portal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                    placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

              <Button
                type="submit"
                className={`w-full ${primaryColor}`}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

              {userType === "customer" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              {userType === "partner" && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

                  <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                    id="email"
                        type="email"
                    placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                    id="password"
                        type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                    id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                        value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                        className="pl-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

              {userType === "partner" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone</Label>
                        <Input
                          id="businessPhone"
                          type="tel"
                      placeholder="Enter business phone"
                          value={formData.businessPhone}
                      onChange={(e) =>
                        handleInputChange("businessPhone", e.target.value)
                      }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          type="text"
                      placeholder="Enter business address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

              <Button
                type="submit"
                className={`w-full ${primaryColor}`}
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
      </CardContent>
    </Card>
  )
} 