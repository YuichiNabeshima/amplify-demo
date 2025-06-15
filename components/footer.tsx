import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About Us</h3>
            <p className="text-gray-600 text-sm">
              We connect customers with professional painting services, making home improvement easy and reliable.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/partners" className="text-gray-600 hover:text-primary text-sm">
                  Find a Partner
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-gray-600 hover:text-primary text-sm">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/auth/partner" className="text-gray-600 hover:text-primary text-sm">
                  Partner Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: support@example.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Hours: Mon-Fri 9:00-18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Painting Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 