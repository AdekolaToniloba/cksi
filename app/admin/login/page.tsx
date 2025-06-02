"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Mail, Lock, AlertTriangle } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [configError, setConfigError] = useState("")
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Dynamically import and initialize Supabase to catch configuration errors
    const initializeSupabase = async () => {
      try {
        const { supabase: supabaseClient } = await import("@/lib/supabase")
        setSupabase(supabaseClient)
      } catch (error: any) {
        console.error("Supabase configuration error:", error)
        setConfigError(error.message || "Failed to initialize Supabase")
      }
    }

    initializeSupabase()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!supabase) {
      setError("Supabase is not properly configured. Please check your environment variables.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // Check if user is admin
        const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", email).single()

        if (adminUser) {
          router.push("/admin")
        } else {
          setError("Access denied. Admin privileges required.")
          await supabase.auth.signOut()
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError("An unexpected error occurred: " + (err.message || "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // For demo purposes, redirect to admin dashboard
    router.push("/admin")
  }

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-600">Configuration Error</CardTitle>
            <CardDescription>Supabase is not properly configured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">{configError}</AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>To fix this:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>
                  Create a Supabase project at{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    supabase.com
                  </a>
                </li>
                <li>Get your project URL (format: https://your-project.supabase.co)</li>
                <li>Get your anon key from Settings → API</li>
                <li>Add them to your .env.local file</li>
              </ol>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleDemoLogin} variant="outline" className="w-full">
                Continue with Demo Mode
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Demo mode uses sample data and doesn't require database setup
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Access the CKSI admin dashboard to manage content and programs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cksi.org.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {error && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading || !supabase}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t">
            <Button onClick={handleDemoLogin} variant="outline" className="w-full">
              Demo Mode
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">Try the admin interface with sample data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
