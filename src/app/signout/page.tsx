import Header from "@/components/ui/Header"
import SignupForm from "@/components/ui/RegisterForm"
import Footer from "@/components/ui/Footer"

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
}
