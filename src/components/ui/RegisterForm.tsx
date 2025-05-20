import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function SignupForm() {
  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="md:text-4xl text-xl font-bold text-center mb-16 font-avant-garde">CREATE AN ACCOUNT</h1>

      <form className="space-y-10 text">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block font-avant-garde text-sm md:text-lg">
              First Name
            </label>
            <div className="relative">
              <input
                id="firstName"
                type="text"
                className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-avant-garde"
                required
              />
              <ArrowRight className="absolute right-0 bottom-2 h-3 w-3 md:h-5 md:w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block font-avant-garde text-sm md:text-lg">
              Last Name
            </label>
            <div className="relative">
              <input
                id="lastName"
                type="text"
                className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-avant-garde"
                required
              />
              <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block font-avant-garde text-sm md:text-lg">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-avant-garde"
              required
            />
            <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block font-avant-garde text-sm md:text-lg">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-avant-garde"
              required
            />
            <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input type="checkbox" id="newsletter" className="h-5 w-5 border-gray-300 focus:ring-black" />
          <label htmlFor="newsletter" className="text-sm md:text-lg font-avant-garde">
            Subscribe to Our Newsletter
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 md:py-4 font-medium hover:bg-gray-900 transition-colors font-avant-garde text-sm md:text-lg"
        >
          LOGIN
        </button>
      </form>

      <div className="mt-8 text-left md:text-lg text-sm">
        <span className="font-avant-garde">Already a Member?</span>{" "}
        <Link href="/login" className="underline font-medium font-avant-garde">
          Login
        </Link>
      </div>
    </div>
  )
}
