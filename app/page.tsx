"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Star, Clock, Shield, ArrowRight, CheckCircle, MapPin } from "lucide-react"
import { Footer } from "@/components/footer"

const features = [
  {
    icon: Clock,
    title: "Same Day Service",
    description: "Professional painting completed in just one day",
  },
  {
    icon: Shield,
    title: "Verified Partners",
    description: "All painting contractors are vetted and insured",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    description: "High-quality results with satisfaction guarantee",
  },
  {
    icon: MapPin,
    title: "Local Experts",
    description: "Connect with trusted painters in your area",
  },
]

const stats = [
  { number: "500+", label: "Happy Customers" },
  { number: "50+", label: "Partner Companies" },
  { number: "1000+", label: "Projects Completed" },
  { number: "4.9", label: "Average Rating" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-accent/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">Professional Painting Services</Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Space in
              <span className="text-primary block">Just One Day</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with professional painting contractors who deliver exceptional quality and speed. From residential
              touch-ups to commercial projects.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/partners">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  <Users className="h-5 w-5 mr-2" />
                  Find Painters
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>

              <Link href="/auth/partner">
                <Button size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100">
                  <Building2 className="h-5 w-5 mr-2" />
                  Become a Partner
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We connect you with the best painting professionals in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your painting project done in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse & Choose</h3>
              <p className="text-gray-600">
                Browse verified painting contractors in your area and choose the perfect match for your project
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book & Schedule</h3>
              <p className="text-gray-600">
                Select your service plan, schedule your preferred date, and provide project details
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Relax & Enjoy</h3>
              <p className="text-gray-600">Sit back while professional painters transform your space in just one day</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Path</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you need painting services or want to offer them, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Customer Card */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">For Customers</h3>
                  <p className="text-gray-600">Need professional painting services for your home or business?</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Browse verified painting contractors</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Compare prices and services</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Book and manage appointments</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>Track project progress</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/partners">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Users className="h-4 w-4 mr-2" />
                      Find Painters
                    </Button>
                  </Link>
                  <Link href="/auth/customer">
                    <Button variant="outline" className="w-full">
                      Customer Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Partner Card */}
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">For Partners</h3>
                  <p className="text-gray-600">Professional painting contractor looking to grow your business?</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span>Get connected with customers</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span>Manage bookings and schedules</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span>Showcase your portfolio</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                    <span>Grow your business</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/auth/partner">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      Join as Partner
                    </Button>
                  </Link>
                  <Link href="/auth/partner">
                    <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50">
                      Partner Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and professional painters on our platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partners">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Users className="h-5 w-5 mr-2" />
                Browse Painters
              </Button>
            </Link>
            <Link href="/auth/partner">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-gray-100">
                <Building2 className="h-5 w-5 mr-2" />
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
