"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const SUBSTACK_URL = "https://cksi.substack.com";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(
      `${SUBSTACK_URL}/subscribe?email=${encodeURIComponent(email)}`,
      "_blank"
    );
  };

  return (
    <section className="py-24 bg-blue-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm"
          >
            <Mail className="h-6 w-6" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Stay Connected to Our Mission
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg max-w-xl mx-auto"
          >
            Join 5,000+ supporters receiving monthly updates on our programs,
            success stories, and events.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/70 h-12 rounded-full px-6 focus:bg-white/20 transition-all"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              size="lg"
              className="h-12 rounded-full bg-white text-blue-950 hover:bg-blue-50 font-semibold px-8"
            >
              Subscribe <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.form>

          <p className="text-sm text-blue-300/60">
            Powered by Substack. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
