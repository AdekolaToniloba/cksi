"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Milestone {
  year: string;
  title: string;
  description: string;
}

export function AboutJourney({ history }: { history: Milestone[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="bg-[#151C27] py-24 lg:py-32 overflow-hidden" ref={timelineRef}>
      <div className="container px-4 md:px-6 max-w-[1000px] mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-serif text-white mb-4"
          >
            Our Journey
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base font-sans text-white/70 max-w-xl mx-auto"
          >
            Tracing our path of impact and growth.
          </motion.p>
        </div>

        <div className="relative">
          {/* Timeline Background Line */}
          <div className="absolute left-8 sm:left-1/2 transform sm:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
          
          {/* Animated Timeline Line */}
          <motion.div 
            className="absolute left-8 sm:left-1/2 transform sm:-translate-x-1/2 top-0 w-[1px] bg-gradient-to-b from-cksi-brand-red via-cksi-brand-red/50 to-transparent origin-top"
            style={{ height: lineHeight }}
          />

          <div className="space-y-16 sm:space-y-24">
            {history.map((milestone, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between w-full relative z-10 pl-16 sm:pl-0 ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`w-full sm:w-5/12 ${index % 2 === 0 ? "text-left sm:text-right pr-0 sm:pr-12" : "text-left sm:text-left pl-0 sm:pl-12"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="p-6 sm:p-0 rounded-2xl sm:rounded-none bg-white/5 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border border-white/10 sm:border-transparent"
                  >
                    <span className="block font-serif text-2xl text-cksi-brand-red mb-2">
                      {milestone.year}
                    </span>
                    <h3 className="font-sans font-bold text-sm text-white tracking-widest uppercase mb-4">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-white/70 text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>

                {/* Node */}
                <div className="absolute left-8 sm:left-1/2 transform -translate-x-1/2 top-8 sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center w-8 h-8">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className={`w-3 h-3 rounded-full ${index < 2 ? "bg-cksi-brand-red ring-4 ring-[#151C27]" : "bg-white ring-4 ring-[#151C27]"}`} 
                  />
                </div>

                {/* Empty space for balance on Desktop */}
                <div className="hidden sm:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
