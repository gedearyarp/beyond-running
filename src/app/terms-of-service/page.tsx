"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function TermsOfServicePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-[56px] md:pt-[73px] pb-16 animate-fade-in">
                <section className="relative max-w-4xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12 md:pb-20">
                    {/* Hero Section */}
                    <div className="mb-12 md:mb-16 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-itc-demi text-black animate-slide-down mb-4 tracking-tight">Terms of Service</h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl font-folio-light text-gray-700 animate-fade-in">
                            Welcome to Beyond Running! Please read our terms carefully before using our website and services.
                        </p>
                    </div>
                    {/* Content Section */}
                    <section className="space-y-10 text-base md:text-lg font-itc-md leading-relaxed bg-white/90 p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
                        <p>
                            These Terms of Service ("Terms") govern your use of the Beyond Running website, located at <a href="https://www.beyond-running.com/" className="underline hover:text-[#d17928]" target="_blank" rel="noopener noreferrer">https://www.beyond-running.com/</a> (the "Site"), and all services provided by Beyond Running. By accessing or using our Site, you agree to be bound by these Terms.
                        </p>
                        <ol className="list-decimal pl-6 space-y-6">
                            <li>
                                <strong>Acceptance of Terms</strong><br />
                                By creating an account, making a purchase, subscribing to our newsletter, registering for events, or otherwise using any part of the Site, you signify your agreement to these Terms. If you do not agree to these Terms, you may not access or use the Site.
                            </li>
                            <li>
                                <strong>Changes to Terms</strong><br />
                                Beyond Running reserves the right to modify or revise these Terms at any time. We will notify you of any changes by posting the updated Terms on the Site. Your continued use of the Site after any such changes constitutes your acceptance of the new Terms.
                            </li>
                            <li>
                                <strong>Privacy Policy</strong><br />
                                Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your personal information.
                            </li>
                            <li>
                                <strong>Website Purpose and Services</strong><br />
                                Beyond Running is an online platform for a running apparel brand based in Jakarta, Indonesia. Our Site serves to:
                                <ul className="list-disc pl-6 mt-2">
                                    <li>Showcase and sell running apparel.</li>
                                    <li>Provide information about new product collections and drops.</li>
                                    <li>Feature "Story Behind From Our Runners" content and articles related to running.</li>
                                    <li>Promote and facilitate registration for running events.</li>
                                    <li>Allow users to subscribe for updates, insights, and runner stories.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>E-commerce and Purchases</strong><br />
                                <ul className="list-disc pl-6 mt-2">
                                    <li><strong>Product Information:</strong> We strive to ensure that all product descriptions, prices, and availability are accurate. However, errors may occur. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.</li>
                                    <li><strong>Order Acceptance:</strong> Your placement of an order does not necessarily assure our acceptance of your order. We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in the description or price of the product, or error in your order.</li>
                                    <li><strong>Payment:</strong> All payments are processed through secure third-party payment gateways. Beyond Running does not store your credit card details.</li>
                                    <li><strong>Shipping and Returns:</strong> Please refer to our separate Shipping Policy and Return Policy (if available on the Site) for details regarding delivery, returns, and exchanges.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>User Accounts</strong><br />
                                <ul className="list-disc pl-6 mt-2">
                                    <li><strong>Account Creation:</strong> You may be required to create an account to access certain features or make purchases on the Site. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
                                    <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account. You agree to notify Beyond Running immediately of any unauthorized use of your account.</li>
                                    <li><strong>Account Termination:</strong> Beyond Running reserves the right to suspend or terminate your account at its sole discretion, without notice or liability, for conduct that we believe violates these Terms or is harmful to other users of the Site, us, or third parties, or for any other reason.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Community Features and Content</strong><br />
                                <ul className="list-disc pl-6 mt-2">
                                    <li><strong>User-Generated Content:</strong> If the Site allows you to post comments, stories, or other content ("User Content"), you are solely responsible for your User Content. You agree that your User Content will not violate any law or infringe the rights of any third party.</li>
                                    <li><strong>Content License:</strong> By submitting User Content, you grant Beyond Running a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform your User Content in connection with the Site and Beyond Running's business.</li>
                                    <li><strong>Monitoring:</strong> Beyond Running reserves the right, but has no obligation, to monitor, edit, or remove User Content that we determine in our sole discretion to be unlawful, offensive, threatening, libelous, defamatory, obscene, or otherwise objectionable.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Event Registration</strong><br />
                                <ul className="list-disc pl-6 mt-2">
                                    <li><strong>Participation:</strong> By registering for events promoted on the Site, you agree to comply with all rules and regulations set forth by Beyond Running or the event organizers.</li>
                                    <li><strong>Liability:</strong> You acknowledge and agree that participation in running events carries inherent risks. Beyond Running is not responsible for any injuries, damages, or losses incurred during your participation in such events.</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Intellectual Property</strong><br />
                                All content on the Site, including text, graphics, logos, images, product designs, and software, is the property of Beyond Running or its content suppliers and is protected by intellectual property laws. You may not use, reproduce, distribute, or create derivative works from any content without our express written permission.
                            </li>
                            <li>
                                <strong>Disclaimer of Warranties</strong><br />
                                The Site and all products and services offered through it are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. Beyond Running does not warrant that the Site will be uninterrupted, error-free, secure, or free from viruses or other harmful components.
                            </li>
                            <li>
                                <strong>Limitation of Liability</strong><br />
                                To the fullest extent permitted by law, Beyond Running shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your access to or use of the Site or products purchased through the Site.
                            </li>
                            <li>
                                <strong>Governing Law</strong><br />
                                These Terms shall be governed by and construed in accordance with the laws of Indonesia, without regard to its conflict of law principles.
                            </li>
                            <li>
                                <strong>Contact Information</strong><br />
                                If you have any questions about these Terms, please contact us through the contact information provided on our Site.
                            </li>
                        </ol>
                    </section>
                </section>
            </main>
            <Footer />
        </div>
    );
} 