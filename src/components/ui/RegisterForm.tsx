import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { authApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Button from "./button"

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    newsletter: false
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Generate username from first and last name
      const username = `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}`
      
      // Send signup request with all required fields
      await authApi.signup({
        username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      })

      // If newsletter is checked, add to Supabase newsletter_subscribers
      if (formData.newsletter) {
        try {
          const { error: newsletterError } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email: formData.email }])

          if (newsletterError) {
            console.error('Newsletter subscription failed:', newsletterError)
          }
        } catch (newsletterError) {
          console.error('Newsletter subscription failed:', newsletterError)
        }
      }

      // Redirect to signin page after successful registration
      router.push('/signin')
    } catch (error: any) {
      console.error('Signup error:', error)
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="md:text-4xl text-xl font-bold text-center mb-16 font-itc-demi">CREATE AN ACCOUNT</h1>

      <form className="space-y-10 text" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block font-folio-bold text-sm md:text-lg">
              First Name
            </label>
            <div className="relative">
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-folio-light"
                required
                disabled={isLoading}
                minLength={2}
                maxLength={50}
              />
              <ArrowRight className="absolute right-0 bottom-2 h-3 w-3 md:h-5 md:w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block font-folio-bold text-sm md:text-lg">
              Last Name
            </label>
            <div className="relative">
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border-b border-gray-300 pb-2 focus:outline-none focus:border-black font-folio-light"
                required
                disabled={isLoading}
                minLength={2}
                maxLength={50}
              />
              <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
            </div>
          </div>
        </div>

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

        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="newsletter"
            checked={formData.newsletter}
            onChange={handleChange}
            className="h-5 w-5 border-gray-300 focus:ring-black"
            disabled={isLoading}
          />
          <label htmlFor="newsletter" className="text-sm md:text-lg text-[#292929] font-folio-bold">
            Subscribe to Our Newsletter
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full py-2 md:py-4 font-folio-bold text-sm md:text-lg"
          loading={isLoading}
          loadingText="CREATING ACCOUNT..."
        >
          CREATE ACCOUNT
        </Button>
      </form>

      <div className="mt-8 text-left md:text-lg text-sm font-folio-medium">
        <span className="">Already a Member?</span>{" "}
        <Link href="/signin" className="underline cursor-pointer">
          Login
        </Link>
      </div>
    </div>
  )
}
