import { Link } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineChat,
  HiOutlineChartBar,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineStar,
  HiOutlineGlobe,
  HiOutlineMail,
  HiOutlineHeart,
} from "react-icons/hi";

const features = [
  {
    icon: HiOutlineSparkles,
    title: "AI Planner",
    description: "Break any goal into actionable subtasks with Gemini-powered planning.",
    to: "/planner",
    color: "indigo",
  },
  {
    icon: HiOutlineLightningBolt,
    title: "Deadline Guardian",
    description: "Emergency rescue plans when deadlines are closing in fast.",
    to: "/rescue",
    color: "rose",
  },
  {
    icon: HiOutlineChat,
    title: "AI Coach",
    description: "Chat with your personal productivity coach anytime.",
    to: "/chat",
    color: "violet",
  },
  {
    icon: HiOutlineChartBar,
    title: "Analytics",
    description: "Track productivity trends and stay on top of your goals.",
    to: "/analytics",
    color: "emerald",
  },
];

const colorMap = {
  indigo: "bg-indigo-100 text-indigo-600",
  rose: "bg-rose-100 text-rose-600",
  violet: "bg-violet-100 text-violet-600",
  emerald: "bg-emerald-100 text-emerald-600",
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold">
            TP
          </div>
          <span className="text-lg font-semibold">TaskPilot AI</span>
        </div>
        <Link
          to="/dashboard"
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20"
        >
          Open App
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <section className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400 animate-pulse">
            Hackathon Edition
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">
            Your AI-powered
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              productivity copilot
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-300">
            Plan smarter, beat deadlines, and stay focused with Gemini-powered task planning,
            emergency rescue mode, and an AI productivity coach.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:bg-indigo-400 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/50"
            >
              Get Started Free
              <HiOutlineArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-105"
            >
              Try AI Planner
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400">No credit card required • Free forever</p>
        </section>

        <section className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, to, color }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
            >
              <div className={`inline-flex rounded-xl p-4 ${colorMap[color]}`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-400">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-400 group-hover:text-indigo-300">
                Explore <HiOutlineArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-32">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Why TaskPilot AI?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Built for developers, students, and anyone who wants to crush their goals
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="inline-flex rounded-xl bg-indigo-500/20 p-4 text-indigo-400">
                <HiOutlineSparkles className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">AI-Powered Planning</h3>
              <p className="mt-3 text-slate-400">
                Gemini breaks down complex tasks into actionable steps automatically
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="inline-flex rounded-xl bg-rose-500/20 p-4 text-rose-400">
                <HiOutlineLightningBolt className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">Deadline Guardian</h3>
              <p className="mt-3 text-slate-400">
                Emergency rescue plans when you're running out of time
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="inline-flex rounded-xl bg-violet-500/20 p-4 text-violet-400">
                <HiOutlineChat className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">24/7 AI Coach</h3>
              <p className="mt-3 text-slate-400">
                Get productivity advice anytime, anywhere
              </p>
            </div>
          </div>
        </section>

        <section className="mt-32">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Get started in three simple steps
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 text-2xl font-bold">
                1
              </div>
              <h3 className="mt-5 text-xl font-semibold">Add Your Tasks</h3>
              <p className="mt-3 text-slate-400">
                Import tasks or let AI break down your goals
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500 text-2xl font-bold">
                2
              </div>
              <h3 className="mt-5 text-xl font-semibold">Plan & Prioritize</h3>
              <p className="mt-3 text-slate-400">
                Use AI Planner or Deadline Guardian for smart scheduling
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold">
                3
              </div>
              <h3 className="mt-5 text-xl font-semibold">Crush Your Goals</h3>
              <p className="mt-3 text-slate-400">
                Track progress and stay focused with AI coaching
              </p>
            </div>
          </div>
        </section>

        <section className="mt-32">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">What Users Say</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Join thousands of productive users
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <HiOutlineStar key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-slate-300">
                "TaskPilot AI helped me finish my hackathon project 2 days early. The AI Planner is incredible!"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold">
                  JD
                </div>
                <div>
                  <p className="font-semibold">John Developer</p>
                  <p className="text-sm text-slate-400">Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <HiOutlineStar key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-slate-300">
                "The Deadline Guardian saved my thesis. I was panicking but it gave me a solid rescue plan."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-sm font-bold">
                  SM
                </div>
                <div>
                  <p className="font-semibold">Sarah Masters</p>
                  <p className="text-sm text-slate-400">Graduate Student</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <HiOutlineStar key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-slate-300">
                "Finally, a productivity tool that actually uses AI intelligently. The chat coach is my favorite."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-sm font-bold">
                  AK
                </div>
                <div>
                  <p className="font-semibold">Alex Kim</p>
                  <p className="text-sm text-slate-400">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-bold">
                  TP
                </div>
                <span className="text-lg font-semibold">TaskPilot AI</span>
              </div>
              <p className="mt-4 max-w-sm text-slate-400">
                Your AI-powered productivity copilot. Plan smarter, beat deadlines, and stay focused.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Product</h4>
              <ul className="mt-4 space-y-2 text-slate-400">
                <li>
                  <Link to="/planner" className="transition hover:text-white">
                    AI Planner
                  </Link>
                </li>
                <li>
                  <Link to="/rescue" className="transition hover:text-white">
                    Deadline Guardian
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="transition hover:text-white">
                    AI Coach
                  </Link>
                </li>
                <li>
                  <Link to="/analytics" className="transition hover:text-white">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Connect</h4>
              <ul className="mt-4 space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <HiOutlineGlobe className="h-4 w-4" />
                  <span>taskpilot.ai</span>
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineMail className="h-4 w-4" />
                  <span>hello@taskpilot.ai</span>
                </li>
                <li className="flex items-center gap-2">
                  <HiOutlineHeart className="h-4 w-4" />
                  <span>Made with ❤️</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
            © 2024 TaskPilot AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
