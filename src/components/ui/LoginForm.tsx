import Link from "next/link"
import { useState } from "react"
import { authApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
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
      await authApi.login({
        email: formData.email,
        password: formData.password
      })

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
          className={`w-full bg-black text-white py-2 md:py-4 transition-colors font-folio-bold text-sm md:text-lg ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-900 cursor-pointer'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </form>

      <div className="mt-8 text-left md:text-lg text-sm font-folio-medium">
        <span className="">Not a Member yet?</span>{" "}
        <Link href="/register" className="underline cursor-pointer">
          Register Now
        </Link>
      </div>
    </div>
  )
}
