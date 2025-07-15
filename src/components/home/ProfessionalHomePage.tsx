
import React from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// ───────────────────────── Dummy Data ──────────────────────────
const features = [
  { id: 1, title: "Real‑Time Insights", icon: "📊", desc: "Live analytics and customizable dashboards." },
  { id: 2, title: "AI‑Powered Forecasts", icon: "🤖", desc: "Predict trends with built‑in ML models." },
  { id: 3, title: "Collaboration Hub", icon: "💬", desc: "Comment, tag, and share instantly." },
  { id: 4, title: "Automated Reports", icon: "📈", desc: "Schedule PDF or CSV exports to your inbox." },
  { id: 5, title: "Secure Access", icon: "🔒", desc: "Granular roles & SSO for peace of mind." },
  { id: 6, title: "Drag‑and‑Drop Widgets", icon: "🧩", desc: "Build pages with zero code." },
  { id: 7, title: "Mobile‑First", icon: "📱", desc: "Optimized for every screen size." },
  { id: 8, title: "Marketplace", icon: "🛒", desc: "Plug‑in extensions from our ecosystem." }
];

const testimonials = [
  {
    id: 1,
    name: "Jane Doe",
    role: "Head of Product @ FinTechX",
    quote: "The speed at which we ship dashboards has tripled. Our execs are finally looking at the same truth!"
  },
  {
    id: 2,
    name: "Carlos R.",
    role: "CTO @ HealthIQ",
    quote: "Migration was painless—and the Framer‑smooth UI delights both our team and investors."
  },
  {
    id: 3,
    name: "Li Wei",
    role: "Data Lead @ ShopWave",
    quote: "The AI forecasts alone paid for the platform in the first month."
  }
];

// ───────────────────────── Animations ──────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.7, ease: "easeOut" }
  })
};

export const ProfessionalHomePage = () => {
  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] text-center bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white">
        {/* Animated Gradient Blobs */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 4 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.2),transparent)] mix-blend-overlay"
        />

        <motion.h1
          className="relative z-10 text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Accelerate Your Workflow
        </motion.h1>
        <motion.p
          className="relative z-10 max-w-2xl mt-6 text-lg md:text-xl backdrop-blur-sm"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          Unlock the full potential of your data with our AI‑powered, real‑time dashboard platform.
        </motion.p>
        <motion.div
          className="relative z-10 mt-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <Button size="lg" className="px-8 py-4 text-lg font-bold">
            Get Started Free
          </Button>
        </motion.div>
      </section>

      {/* ─── Features ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <motion.h2
            className="mb-12 text-4xl font-bold text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            Powerful Features
          </motion.h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.id}
                className="p-6 bg-gray-50 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl"
                whileHover={{ y: -6 }}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <motion.h2
            className="mb-12 text-4xl font-bold text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            Loved by Teams Worldwide
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
              >
                <div className="flex items-center mb-4 gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-6 italic leading-relaxed text-gray-700">"{t.quote}"</p>
                <h4 className="font-semibold">{t.name}</h4>
                <span className="text-sm text-gray-500">{t.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Call‑to‑Action ─────────────────────────────────── */}
      <section className="py-24 text-white bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700">
        <div className="container px-4 mx-auto text-center">
          <motion.h2
            className="mb-6 text-4xl font-bold"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            Ready to Transform Your Data?
          </motion.h2>

          <ul className="grid max-w-4xl gap-4 mx-auto mb-10 sm:grid-cols-3 text-left">
            {[
              "Unlimited Dashboards",
              "Built‑in AI Forecasts",
              "Enterprise‑grade Security"
            ].map((item, i) => (
              <motion.li
                key={item}
                className="flex items-center gap-2"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
              >
                <Check className="w-5 h-5" /> {item}
              </motion.li>
            ))}
          </ul>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button size="lg" variant="secondary" className="text-indigo-700 bg-white px-10 py-4 text-lg font-bold">
              Start Your Free Trial
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
