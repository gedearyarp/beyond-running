import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function LoginForm() {
  return (
    <div className="min-w-sm mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">LOGIN</h1>

      <form className="space-y-8">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
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
          <label htmlFor="password" className="block text-sm font-medium">
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

        <button
          type="submit"
          className="w-full bg-black text-white py-3 font-medium hover:bg-gray-900 transition-colors"
        >
          LOGIN
        </button>
      </form>

      <div className="mt-6 text-sm">
        <span>Not a Member yet?</span>{" "}
        <Link href="/register" className="underline font-medium">
          Register Now
        </Link>
      </div>
    </div>
  )
}
