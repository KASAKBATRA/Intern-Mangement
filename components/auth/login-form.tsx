"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Key } from "lucide-react"

interface LoginFormProps {
  onBackToHome?: () => void
  defaultTab?: "login" | "register"
}

export function LoginForm({ onBackToHome, defaultTab = "login" }: LoginFormProps) {
  const { login, register, isLoading } = useAuth()
  const [error, setError] = useState("")
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "otp" | "password">("email")
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("")
  const [forgotPasswordGeneratedOtp, setForgotPasswordGeneratedOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "" as UserRole | "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    role: "" as UserRole | "",
    department: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("[v0] Login attempt started", { email: loginData.email, role: loginData.role })

    if (!loginData.role) {
      setError("Please select a role")
      return
    }

    const success = await login(loginData.email, loginData.password, loginData.role)
    console.log("[v0] Login result:", success)

    if (!success) {
      setError("Invalid credentials. Try: password")
    } else {
      console.log("[v0] Login successful, should navigate to dashboard")
    }
  }

  const generateAndSendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    setOtpSent(true)

    // Simulate sending email (in real app, this would call an API)
    console.log(`[v0] OTP sent to ${registerData.email}: ${newOtp}`)
    alert(`OTP sent to ${registerData.email}: ${newOtp}`)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!registerData.role) {
      setError("Please select a role")
      return
    }

    // Show OTP verification step
    setShowOtpVerification(true)
    generateAndSendOtp()
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please check your email and try again.")
      return
    }

    // OTP verified, proceed with registration
    const success = await register(
      registerData.email,
      registerData.password,
      registerData.name,
      registerData.role,
      registerData.department || undefined,
    )

    if (!success) {
      setError("Registration failed")
    } else {
      // Reset states
      setShowOtpVerification(false)
      setOtp("")
      setGeneratedOtp("")
      setOtpSent(false)
    }
  }

  const handleBackToRegister = () => {
    setShowOtpVerification(false)
    setOtp("")
    setGeneratedOtp("")
    setOtpSent(false)
    setError("")
  }

  const handleForgotPasswordEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!forgotPasswordEmail) {
      setError("Please enter your email")
      return
    }

    // Generate and send OTP for password reset
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setForgotPasswordGeneratedOtp(newOtp)
    setForgotPasswordStep("otp")

    console.log(`[v0] Password reset OTP sent to ${forgotPasswordEmail}: ${newOtp}`)
    alert(`Password reset OTP sent to ${forgotPasswordEmail}: ${newOtp}`)
  }

  const handleForgotPasswordOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (forgotPasswordOtp !== forgotPasswordGeneratedOtp) {
      setError("Invalid OTP. Please check your email and try again.")
      return
    }

    setForgotPasswordStep("password")
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    // Simulate password reset success
    alert("Password reset successful! You can now login with your new password.")

    // Reset all forgot password states and go back to login
    setShowForgotPassword(false)
    setForgotPasswordStep("email")
    setForgotPasswordEmail("")
    setForgotPasswordOtp("")
    setForgotPasswordGeneratedOtp("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
    setForgotPasswordStep("email")
    setForgotPasswordEmail("")
    setForgotPasswordOtp("")
    setForgotPasswordGeneratedOtp("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
  }

  const roles: UserRole[] = ["CEO", "COO", "HOD", "Intern", "Admin"]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          {onBackToHome && !showOtpVerification && !showForgotPassword && (
            <div className="flex justify-start mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="text-slate-600 hover:text-black hover:bg-slate-100 p-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Button>
            </div>
          )}
          {showOtpVerification && (
            <div className="flex justify-start mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToRegister}
                className="text-slate-600 hover:text-black hover:bg-slate-100 p-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Register
              </Button>
            </div>
          )}
          {showForgotPassword && (
            <div className="flex justify-start mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToLogin}
                className="text-slate-600 hover:text-black hover:bg-slate-100 p-2"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Button>
            </div>
          )}
          <CardTitle className="text-2xl font-bold text-black">Renu Sharma Foundation</CardTitle>
          <CardDescription className="text-slate-600">Internship Management System</CardDescription>
        </CardHeader>
        <CardContent>
          {showForgotPassword ? (
            <div className="space-y-4">
              {forgotPasswordStep === "email" && (
                <>
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Key className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Reset Password</h3>
                    <p className="text-sm text-slate-600">
                      Enter your email address and we'll send you a verification code
                    </p>
                  </div>

                  <form onSubmit={handleForgotPasswordEmail} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="Enter your email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                        className="border-slate-200 focus:border-blue-400"
                      />
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full bg-black hover:bg-slate-800 text-white">
                      Send Verification Code
                    </Button>
                  </form>
                </>
              )}

              {forgotPasswordStep === "otp" && (
                <>
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Enter Verification Code</h3>
                    <p className="text-sm text-slate-600">
                      We've sent a 6-digit code to
                      <br />
                      <span className="font-medium text-black">{forgotPasswordEmail}</span>
                    </p>
                  </div>

                  <form onSubmit={handleForgotPasswordOtp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-otp">Enter Code</Label>
                      <Input
                        id="forgot-otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={forgotPasswordOtp}
                        onChange={(e) => setForgotPasswordOtp(e.target.value)}
                        maxLength={6}
                        required
                        className="border-slate-200 focus:border-blue-400 text-center text-lg tracking-widest"
                      />
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full bg-black hover:bg-slate-800 text-white">
                      Verify Code
                    </Button>
                  </form>
                </>
              )}

              {forgotPasswordStep === "password" && (
                <>
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Key className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-black">Create New Password</h3>
                    <p className="text-sm text-slate-600">Enter your new password below</p>
                  </div>

                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="border-slate-200 focus:border-blue-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border-slate-200 focus:border-blue-400"
                      />
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full bg-black hover:bg-slate-800 text-white">
                      Reset Password
                    </Button>
                  </form>
                </>
              )}
            </div>
          ) : showOtpVerification ? (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-black">Verify Your Email</h3>
                <p className="text-sm text-slate-600">
                  We've sent a 6-digit verification code to
                  <br />
                  <span className="font-medium text-black">{registerData.email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    className="border-slate-200 focus:border-blue-400 text-center text-lg tracking-widest"
                  />
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-black hover:bg-slate-800 text-white" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={generateAndSendOtp}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <Tabs defaultValue={defaultTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                <TabsTrigger value="login" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-role">Role</Label>
                    <Select
                      value={loginData.role}
                      onValueChange={(value: UserRole) => setLoginData({ ...loginData, role: value })}
                    >
                      <SelectTrigger className="border-slate-200 focus:border-blue-400">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full bg-black hover:bg-slate-800 text-white" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      className="border-slate-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-role">Role</Label>
                    <Select
                      value={registerData.role}
                      onValueChange={(value: UserRole) => setRegisterData({ ...registerData, role: value })}
                    >
                      <SelectTrigger className="border-slate-200 focus:border-blue-400">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(registerData.role === "HOD" || registerData.role === "Intern") && (
                    <div className="space-y-2">
                      <Label htmlFor="register-department">Department</Label>
                      <Input
                        id="register-department"
                        type="text"
                        placeholder="Enter your department"
                        value={registerData.department}
                        onChange={(e) => setRegisterData({ ...registerData, department: e.target.value })}
                        required
                        className="border-slate-200 focus:border-blue-400"
                      />
                    </div>
                  )}

                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full bg-black hover:bg-slate-800 text-white" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {!showOtpVerification && !showForgotPassword && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-600 font-medium mb-2">Demo Credentials:</p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>CEO: ceo@renu.org</p>
                <p>COO: coo@renu.org</p>
                <p>HOD: hod@renu.org</p>
                <p>Intern: intern@renu.org</p>
                <p>Admin: admin@renu.org</p>
                <p className="font-medium">Password: password</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
