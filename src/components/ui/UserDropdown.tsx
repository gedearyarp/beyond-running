"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
    const { user, logout } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen || !user) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-slide-down"
        >
            {/* User Info */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-folio-bold text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
                <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                >
                    <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    <span className="font-folio-medium">My Profile</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group"
                >
                    <LogOut className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    <span className="font-folio-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
