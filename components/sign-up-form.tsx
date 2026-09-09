'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    username: '',
  })

  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  const hasMinLength = password.length >= 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Signup submitted:', { ...formData, password })
    
    setIsLoading(false)
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
          Create Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Get started with your account
        </p>
      </div>

      {/* Sign Up Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            Username
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="johndoe"
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-sm"
          />
        </div>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-sm"
          />
        </div>

        {/* Password Requirements */}
        <div className="grid grid-cols-2 gap-y-1 text-xs py-1 text-muted-foreground">
          <span className={hasLowercase ? 'text-emerald-600 font-medium' : ''}>
            • One lowercase
          </span>
          <span className={hasSpecial ? 'text-emerald-600 font-medium' : ''}>
            • One special char
          </span>
          <span className={hasUppercase ? 'text-emerald-600 font-medium' : ''}>
            • One uppercase
          </span>
          <span className={hasMinLength ? 'text-emerald-600 font-medium' : ''}>
            • 8+ characters
          </span>
          <span className={hasNumber ? 'text-emerald-600 font-medium' : ''}>
            • One number
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent hover:opacity-90 text-accent-foreground font-medium py-2.5 px-4 rounded-md text-sm transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Get Started!'}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:underline font-semibold">
          Login
        </Link>
      </p>
    </div>
  )
}