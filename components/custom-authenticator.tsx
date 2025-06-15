"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, Building2, Phone } from "lucide-react"

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
}

export function CustomAuthenticator({ userType, onAuthSuccess }: AuthenticatorProps) {
  const [activeTab, setActiveTab] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    companyName: "",
    businessPhone: "",
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return false
    }

    if (activeTab === "signup") {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long")
        return false
      }
      if (userType === "partner" && !formData.companyName) {
        setError("Company name is required")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful authentication
      const mockUser = {
        email: formData.email,
        name: formData.name || formData.email.split("@")[0],
        companyName: formData.companyName,
        businessPhone: formData.businessPhone,
        userType,
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      onAuthSuccess?.(mockUser)
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setUser(null)
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      companyName: "",
      businessPhone: "",
    })
  }

  if (isAuthenticated && user) {
    const primaryButtonClass =
      userType === "partner" ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Welcome!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={`p-4 ${userType === "partner" ? "bg-orange-50" : "bg-green-50"} rounded-lg`}>
            <h3 className={`font-semibold ${userType === "partner" ? "text-orange-800" : "text-green-800"} mb-2`}>
              {userType === "partner" ? "Partner Account" : "Customer Account"}
            </h3>
            <p className={`${userType === "partner" ? "text-orange-700" : "text-green-700"}`}>
              Welcome, {user.companyName || user.name || user.email}!
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className={`w-full ${primaryButtonClass}`}
              onClick={() => {
                const dashboardUrl = userType === "partner" ? "/partner/dashboard" : "/dashboard"
                window.location.href = dashboardUrl
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

  const primaryButtonClass =
    userType === "partner" ? "bg-orange-500 hover:bg-orange-600" : "bg-primary hover:bg-primary/90"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{userType === "partner" ? "Partner Portal" : "Customer Portal"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signin-email"
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
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className={`w-full ${primaryButtonClass}`} disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">
                  {userType === "partner" ? "Business Email Address" : "Email Address"}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder={userType === "partner" ? "Enter your business email" : "Enter your email"}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {userType === "customer" && (
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name (Optional)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              {userType === "partner" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="signup-company">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-company"
                        type="text"
                        placeholder="Enter your company name"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Business Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="Enter your business phone number"
                        value={formData.businessPhone}
                        onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className={`w-full ${primaryButtonClass}`} disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
