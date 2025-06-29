import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      // Redirect to home page after successful login
      router.push('/')
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.response?.data?.message || 'Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="md:text-4xl text-xl font-bold text-center mb-16 font-itc-demi">LOGIN</h1>

      <form className="space-y-10" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="block font-folio-bold text-sm md:text-lg">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-folio-light"
              required
              disabled={isLoading}
            />
            <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block font-folio-bold text-sm md:text-lg">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-folio-light"
              required
              disabled={isLoading}
              minLength={6}
            />
            <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 md:py-4 font-folio-bold text-sm md:text-lg transition-all duration-300 ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 cursor-pointer"
          }`}
        >
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      <div className="mt-8 text-left md:text-lg text-sm font-folio-medium">
        <span className="">Don't have an account?</span>{" "}
        <Link href="/register" className="underline cursor-pointer">
          Sign Up
        </Link>
      </div>
    </div>
  )
}
