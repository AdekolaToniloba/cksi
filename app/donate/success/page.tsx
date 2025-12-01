"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, Home, HeartHandshake } from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function DonationSuccessPage() {
  useEffect(() => {
    // Trigger confetti on load
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-green-50 p-8 flex justify-center">
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </motion.div>
            </div>
          </div>

          <CardContent className="text-center p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
              <p className="text-gray-500 text-lg">
                Your donation has been received successfully.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
              <p>A receipt has been sent to your email address.</p>
              <p className="mt-2">
                Your support makes a real difference in the lives of families
                and children.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                asChild
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" /> Return Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12">
                <Link href="/work">
                  <HeartHandshake className="mr-2 h-4 w-4" /> See Your Impact
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
