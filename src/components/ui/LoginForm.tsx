import Link from "next/link"

export default function LoginForm() {
  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="text-4xl font-bold text-center mb-16 font-avant-garde">LOGIN</h1>

      <form className="space-y-10">
        <div className="space-y-2">
          <label htmlFor="email" className="block font-avant-garde text-lg">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-avant-garde"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block font-avant-garde text-lg">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-avant-garde"
            required
          />
        </div>

        <div className="text-left">
          <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-gray-600 font-avant-garde">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-4 font-medium hover:bg-gray-900 transition-colors font-avant-garde text-lg"
        >
          LOGIN
        </button>
      </form>

      <div className="mt-8 text-left">
        <span className="font-avant-garde">Not a Member yet?</span>{" "}
        <Link href="/register" className="underline font-medium font-avant-garde">
          Register Now
        </Link>
      </div>
    </div>
  )
}
