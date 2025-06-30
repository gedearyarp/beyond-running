"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Search, ShoppingBag, User, LogOut } from "lucide-react";
import ShopSubmenu from "./mobile-menu/shop-submenu";
import PeripheralsSubmenu from "./mobile-menu/peripherals-submenu";
import CommunitySubmenu from "./mobile-menu/community-submenu";
import { useCollectionsStore } from "@/store/collections";
import { useAuth } from "@/contexts/AuthContext";

type MenuView = "main" | "shop" | "peripherals" | "community";

interface MobileMenuProps {
    onClose: () => void;
    onCartClick?: () => void;
    cartItemCount?: number;
}

export default function MobileMenu({ onClose, onCartClick, cartItemCount = 0 }: MobileMenuProps) {
    const [currentView, setCurrentView] = useState<MenuView>("main");
    const [isVisible, setIsVisible] = useState(false);
    const { refreshCollections } = useCollectionsStore();
    const { isAuthenticated, user, logout } = useAuth();

    // Animation effect when component mounts
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const navigateTo = (view: MenuView) => {
        setCurrentView(view);
        // Refresh collections when shop submenu is opened
        if (view === "shop") {
            refreshCollections();
        }
    };

    const goBack = () => {
        setCurrentView("main");
    };

    const handleCartClick = () => {
        onClose(); // Close mobile menu first
        onCartClick?.(); // Then open cart
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    };

    return (
        <div
            className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
                isVisible ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4">
                <button onClick={handleClose} aria-label="Close menu" className="cursor-pointer">
                    <X className="h-6 w-6" />
                </button>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-lg font-folio-bold">
                    <Link href="/">BEYOND:RUNNING</Link>
                </div>
            </div>

            {/* Back to Menu link (only shown in submenus) */}
            {currentView !== "main" && (
                <div className="px-2 py-2 animate-fade-in">
                    <button
                        onClick={goBack}
                        className="text-sm text-gray-800 underline cursor-pointer font-folio-medium"
                    >
                        &lt;Back to Menu
                    </button>
                </div>
            )}

            {/* Menu Content */}
            {currentView === "main" && (
                <div className="px-6 py-12">
                    <nav className="space-y-6">
                        {[
                            { text: "Shop", action: () => navigateTo("shop") },
                            { text: "Peripherals", action: () => navigateTo("peripherals") },
                            { text: "Community", action: () => navigateTo("community") },
                            { text: "About", href: "/about" },
                        ].map((item, index) => (
                            <div
                                key={item.text}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className="block font-folio-bold text-lg"
                                    >
                                        {item.text}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={item.action}
                                        className="block font-folio-bold text-lg text-left cursor-pointer"
                                    >
                                        {item.text}
                                    </button>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Authentication Section */}
                    <div
                        className="mt-40 space-y-4 animate-fade-in"
                        style={{ animationDelay: "600ms" }}
                    >
                        {isAuthenticated ? (
                            <>
                                {/* User Info - Clickable to Profile */}
                                <Link
                                    href="/profile"
                                    onClick={handleClose}
                                    className="flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer group"
                                >
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-200">
                                        <User className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-folio-bold text-lg text-gray-900 truncate">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            View Profile
                                        </p>
                                    </div>
                                </Link>

                                {/* Logout Button */}
                                <div className="pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-4 p-4 w-full text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-200">
                                            <LogOut className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <span className="font-folio-bold text-lg text-gray-900">
                                            Logout
                                        </span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* Unauthenticated User Options */
                            <div className="flex space-x-8">
                                <Link
                                    href="/signin"
                                    className="font-folio-medium text-lg underline"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="font-folio-medium text-lg underline"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Shop Submenu */}
            {currentView === "shop" && (
                <div className="animate-slide-in">
                    <ShopSubmenu />
                </div>
            )}

            {/* Peripherals Submenu */}
            {currentView === "peripherals" && (
                <div className="animate-slide-in">
                    <PeripheralsSubmenu />
                </div>
            )}

            {/* Community Submenu */}
            {currentView === "community" && (
                <div className="animate-slide-in">
                    <CommunitySubmenu />
                </div>
            )}
        </div>
    );
}
