import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import toast from "react-hot-toast"

interface ValidationErrors {
  email?: string
  password?: string
}

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return ''
      case 'password':
        if (!value.trim()) return 'Password is required'
        if (value.length < 6) return 'Password must be at least 6 characters'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
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
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        errors[key as keyof ValidationErrors] = error
      }
    })

    setValidationErrors(errors)
    setTouched({
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
      await login(formData.email, formData.password)
      toast.success('Successfully logged in! Welcome back!')
      router.push('/')
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 'Invalid email or password. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const hasErrors = Object.values(validationErrors).some(error => error)

  return (
    <div className="w-full max-w-md mx-auto px-6">
      <h1 className="md:text-4xl text-xl font-bold text-center mb-16 font-itc-demi">LOGIN</h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
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
              <span>LOGGING IN...</span>
            </div>
          ) : (
            "LOGIN"
          )}
        </button>
      </form>

      <div className="mt-8 text-left md:text-lg text-sm font-folio-medium">
        <span className="">Don't have an account?</span>{" "}
        <Link href="/register" className="underline cursor-pointer hover:text-gray-600 transition-colors">
          Sign Up
        </Link>
      </div>
    </div>
  )
}
