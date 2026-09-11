'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Login submitted:', formData)
    
    setIsLoading(false)
    // Redirect to dashboard after login
    // router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Logo Section */}
      <div className="flex justify-center">
        <Image
          src="/DW_FullLogo.png"
          alt="Company Logo"
          width={72}
          height={72}
          priority
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-serif">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Please login to your account
        </p>
      </div>

      {/* Sign In Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Email address
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="john@example.com"
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-sm"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-semibold text-primary">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-accent hover:underline font-medium"
            >
              {showPassword ? '👁️ Hide' : '👁️ Show'}
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-sm"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link 
            href="/auth/forgot-password" 
            className="text-xs text-accent hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent hover:opacity-90 text-accent-foreground font-medium py-2.5 px-4 rounded-md text-sm transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account{' '}
        <Link href="/signup" className="text-accent hover:underline font-semibold">
          Signup
        </Link>
      </p>

      {/* Footer Legal Links */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-400">
        <Link href="/terms" className="hover:text-accent transition-colors">
          Terms of Service
        </Link>
        <span className="w-px h-3 bg-gray-300"></span>
        <Link href="/privacy" className="hover:text-accent transition-colors">
          Privacy Policy
        </Link>
        <span className="w-px h-3 bg-gray-300"></span>
        <Link href="/help" className="hover:text-accent transition-colors">
          Help Center
        </Link>
      </div>
    </div>
  )
}