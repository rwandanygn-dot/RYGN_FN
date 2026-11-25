'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useNavigationStore } from '@/store';

export function Navigation() {
  const isOpen = useNavigationStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useNavigationStore((state) => state.toggleMobileMenu);
  const closeMobileMenu = useNavigationStore((state) => state.closeMobileMenu);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/programs', label: 'Programs' },
    { href: '/team', label: 'Team' },
    { href: '/gallery', label: 'Gallery' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 p-1">
              <img
                src="/images/logo.PNG"
                alt="RYGN Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-[#1a3a52] text-lg leading-tight">RYGN</div>
              <div className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">OPERATION IN NUCLEAR</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-[#2d9c4a] font-medium transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Join Us & Donate Buttons and Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/get-involved"
              className="hidden sm:inline-block bg-[#1a3a52] text-white px-5 py-2 rounded hover:bg-[#0f2847] transition-colors font-medium text-sm"
            >
              Join Us
            </Link>
            <Link
              href="/donate"
              className="hidden sm:inline-block bg-[#2d9c4a] text-white px-5 py-2 rounded hover:bg-[#239a41] transition-colors font-medium text-sm"
            >
              Donate
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-700"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 px-4 pt-2">
              <Link
                href="/get-involved"
                className="block bg-[#1a3a52] text-white px-4 py-2 rounded hover:bg-[#0f2847] transition-colors font-medium text-center text-sm"
                onClick={closeMobileMenu}
              >
                Join Us
              </Link>
              <Link
                href="/donate"
                className="block bg-[#2d9c4a] text-white px-4 py-2 rounded hover:bg-[#239a41] transition-colors font-medium text-center text-sm"
                onClick={closeMobileMenu}
              >
                Donate
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
