import Header from "@/components/ui/Header"
import LoginForm from "@/components/ui/LoginForm"
import Footer from "@/components/ui/Footer"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex mt-30 justify-center h-screen">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
