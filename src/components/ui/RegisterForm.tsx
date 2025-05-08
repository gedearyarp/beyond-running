import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function SignupForm() {
  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-16">CREATE AN ACCOUNT</h1>

      <form className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="block">
              First Name
            </label>
            <div className="relative">
              <input
                id="firstName"
                type="text"
                className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black"
                required
              />
              <ArrowRight className="absolute right-0 bottom-2 h-5 w-5" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="lastName" className="block">
              Last Name
            </label>
            <div className="relative">
              <input
                id="lastName"
                type="text"
                className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black"
                required
              />
              <ArrowRight className="absolute right-0 bottom-2 h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black"
              required
            />
            <ArrowRight className="absolute right-0 bottom-2 h-5 w-5" />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black"
              required
            />
            <ArrowRight className="absolute right-0 bottom-2 h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="newsletter" className="h-4 w-4 border-gray-300 focus:ring-black" />
          <label htmlFor="newsletter" className="text-sm font-medium">
            Subscribe to Our Newsletter
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 font-medium hover:bg-gray-900 transition-colors"
        >
          LOGIN
        </button>
      </form>

      <div className="mt-6 text-sm">
        <span>Already a Member?</span>{" "}
        <Link href="/login" className="underline font-medium">
          Login
        </Link>
      </div>
    </div>
  )
}
