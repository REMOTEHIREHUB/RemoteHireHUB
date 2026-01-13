import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand - Larger Logo */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo.png"
                alt="RemoteHireHub"
                width={240}
                height={100}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your hub for remote opportunities worldwide. Find your dream remote job today and work from anywhere.
            </p>
            <div className="mt-6 flex gap-4">
              {/* Social Media Icons (add your links) */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Popular Categories</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/remote-software-development-jobs" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Software Development →
                </Link>
              </li>
              <li>
                <Link 
                  href="/remote-customer-support-jobs" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Customer Support →
                </Link>
              </li>
              <li>
                <Link 
                  href="/remote-marketing-growth-jobs" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Marketing & Growth →
                </Link>
              </li>
              <li>
                <Link 
                  href="/remote-design-creative-jobs" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Design & Creative →
                </Link>
              </li>
              <li>
                <Link 
                  href="/remote-jobs" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block font-medium"
                >
                  View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/blog" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Blog & Guides →
                </Link>
              </li>
              <li>
                <Link 
                  href="/remote-work-guide" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Remote Work Guide →
                </Link>
              </li>
              <li>
                <Link 
                  href="/salary-guide" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Salary Guide →
                </Link>
              </li>
              <li>
                <Link 
                  href="/remote-companies" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Remote Companies →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  About Us →
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Contact →
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Privacy Policy →
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Terms of Service →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} RemoteHireHub. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Built with ❤️ for remote workers worldwide 🌍
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}