import Link from "next/link"
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"
import { authApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Button from "./button"
import toast from "react-hot-toast"

interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    newsletter: false
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false
  })

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required'
        if (value.trim().length < 2) return 'First name must be at least 2 characters'
        if (value.trim().length > 50) return 'First name must be less than 50 characters'
        if (!/^[a-zA-Z\s]*$/.test(value.trim())) return 'First name can only contain letters'
        return ''
      case 'lastName':
        if (!value.trim()) return 'Last name is required'
        if (value.trim().length < 2) return 'Last name must be at least 2 characters'
        if (value.trim().length > 50) return 'Last name must be less than 50 characters'
        if (!/^[a-zA-Z\s]*$/.test(value.trim())) return 'Last name can only contain letters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return ''
      case 'password':
        if (!value.trim()) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        if (value.length > 128) return 'Password must be less than 128 characters'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))

    // Clear validation error when user starts typing
    if (validationErrors[id as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [id]: ''
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setTouched(prev => ({
      ...prev,
      [id]: true
    }))

    const error = validateField(id, value)
    setValidationErrors(prev => ({
      ...prev,
      [id]: error
    }))
  }

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    
    Object.keys(formData).forEach(key => {
      if (key !== 'newsletter') {
        const error = validateField(key, formData[key as keyof typeof formData])
        if (error) {
          errors[key as keyof ValidationErrors] = error
        }
      }
    })

    setValidationErrors(errors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true
    })

    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

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

      toast.success('Account created successfully! Please log in to continue.')
      router.push('/signin')
    } catch (error: any) {
      console.error('Signup error:', error)
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const hasErrors = Object.values(validationErrors).some(error => error)

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="md:text-4xl text-xl font-bold text-center mb-16 font-itc-demi">CREATE AN ACCOUNT</h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
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
                onBlur={handleBlur}
                className={`w-full border-b pb-2 focus:outline-none font-folio-light transition-colors duration-200 ${
                  validationErrors.firstName && touched.firstName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-black'
                }`}
                required
                disabled={isLoading}
                placeholder="First name"
                minLength={2}
                maxLength={50}
              />
              <ArrowRight className="absolute right-0 bottom-2 h-3 w-3 md:h-5 md:w-5" />
            </div>
            {validationErrors.firstName && touched.firstName && (
              <div className="flex items-center space-x-2 mt-1">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-red-500 text-sm font-folio-medium">{validationErrors.firstName}</p>
              </div>
            )}
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
                onBlur={handleBlur}
                className={`w-full border-b pb-2 focus:outline-none font-folio-light transition-colors duration-200 ${
                  validationErrors.lastName && touched.lastName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-black'
                }`}
                required
                disabled={isLoading}
                placeholder="Last name"
                minLength={2}
                maxLength={50}
              />
              <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
            </div>
            {validationErrors.lastName && touched.lastName && (
              <div className="flex items-center space-x-2 mt-1">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-red-500 text-sm font-folio-medium">{validationErrors.lastName}</p>
              </div>
            )}
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
              onBlur={handleBlur}
              className={`w-full border-b pb-2 focus:outline-none font-folio-light transition-colors duration-200 ${
                validationErrors.email && touched.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-black'
              }`}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
            <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
          </div>
          {validationErrors.email && touched.email && (
            <div className="flex items-center space-x-2 mt-1">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-red-500 text-sm font-folio-medium">{validationErrors.email}</p>
            </div>
          )}
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
              onBlur={handleBlur}
              className={`w-full border-b pb-2 focus:outline-none font-folio-light transition-colors duration-200 ${
                validationErrors.password && touched.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-black'
              }`}
              required
              disabled={isLoading}
              placeholder="Create a password"
              minLength={6}
            />
            <ArrowRight className="absolute right-0 bottom-2 h-3 w-3" />
          </div>
          {validationErrors.password && touched.password && (
            <div className="flex items-center space-x-2 mt-1">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-red-500 text-sm font-folio-medium">{validationErrors.password}</p>
            </div>
          )}
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

        <button
          type="submit"
          disabled={isLoading || hasErrors}
          className={`w-full py-3 md:py-4 font-folio-bold text-sm md:text-lg transition-all duration-300 rounded-sm ${
            isLoading || hasErrors
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>CREATING ACCOUNT...</span>
            </div>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>
      </form>

      <div className="mt-8 text-left md:text-lg text-sm font-folio-medium">
        <span className="">Already a Member?</span>{" "}
        <Link href="/signin" className="underline cursor-pointer hover:text-gray-600 transition-colors">
          Login
        </Link>
      </div>
    </div>
  )
}
