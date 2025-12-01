"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeen, setHasSeen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const { toast } = useToast();

  // Substack Configuration
  const SUBSTACK_URL = "https://cksi.substack.com"; // REPLACE WITH YOUR SUBSTACK URL

  useEffect(() => {
    // Check if user has already closed/subscribed
    const seen = localStorage.getItem("cksi_newsletter_seen");
    if (seen) return;

    const handleScroll = () => {
      // Show after scrolling 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("cksi_newsletter_seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Since we can't directly POST to Substack due to CORS without a proxy,
      // we'll open the substack page in a new tab for them to confirm,
      // OR if you have a backend proxy setup, use that.
      // For now, let's simulate success and open the link.

      window.open(
        `${SUBSTACK_URL}/subscribe?email=${encodeURIComponent(email)}`,
        "_blank"
      );

      setStatus("success");
      setTimeout(() => {
        handleClose();
        toast({
          title: "Success",
          description: "Please confirm your subscription in the new tab!",
        });
      }, 2000);
    } catch (error) {
      setStatus("idle");
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 right-4 z-50 w-full max-w-md p-4"
        >
          <div className="relative bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden p-6">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0 text-blue-600">
                <Mail className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-blue-950">
                  Join the Family
                </h3>
                <p className="text-sm text-gray-500">
                  Get heartwarming stories and impact updates directly to your
                  inbox.
                </p>
              </div>
            </div>

            {status === "success" ? (
              <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-5 w-5" />
                Redirecting to Substack...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Join"
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
