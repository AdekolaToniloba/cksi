"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container px-4 md:px-6">
          <Card className="max-w-2xl mx-auto text-center border-secondary/20">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">
                You've successfully subscribed to our newsletter. We'll keep you updated on our latest programs and
                impact.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container px-4 md:px-6">
        <Card className="max-w-2xl mx-auto border-secondary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Mail className="h-12 w-12 text-secondary" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Stay <span className="text-secondary">Connected</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Get updates on our programs, success stories, and ways you can make a difference in the lives of families
              and children across Nigeria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 border-secondary/30 focus:border-secondary"
                />
                <Button type="submit" disabled={isLoading} className="sm:w-auto bg-secondary hover:bg-secondary/90">
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
