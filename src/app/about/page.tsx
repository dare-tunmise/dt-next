import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageFrame, pageTitle } from "@/lib/typography";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dare Tunmise — software engineer and writer. Backend services, system architecture, and AI features in production. Available for AI and automation work.",
  keywords: [
    "Dare Tunmise",
    "about Dare Tunmise",
    "AI engineer for hire",
    "backend engineer",
    "AI consultant",
    "LLM engineer",
  ],
  alternates: { canonical: "https://daretunmise.com/about" },
  openGraph: {
    siteName: "Dare Tunmise",
    title: "About Dare Tunmise",
    description:
      "Software engineer and writer. Backend services, system architecture, and AI features in production.",
    url: "https://daretunmise.com/about",
    type: "profile",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Dare Tunmise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Dare Tunmise",
    description: "Software engineer and writer. Backend, systems, and AI features in production.",
    creator: "@Dare_Tunmise",
    images: ["/og-image.jpg"],
  },
};

const About = () => {
  return (
    <div className="min-h-screen">
    <Header />
      <main className={`${pageFrame} pb-16`}>
        <h1 className={`${pageTitle} mb-10 mt-16 sm:mt-20`}>
          About
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-6">Hi, </p>
          <p className="text-lg leading-relaxed mb-6">
            I’m Dare Tunmise — a software engineer and writer.
          </p>

          <p className="leading-relaxed mb-6">
            I currently work with a London-based travel-tech company, where I work on backend services, system architecture, cloud run applications and AI-powered features used in production. Most of my work centers on understanding how large language models behave under real-world constraints and using that understanding to solve practical problems for teams and businesses.
          </p>

          <p className="leading-relaxed mb-6">
            Outside work, I write. I’m the author of{" "}
            <Link href="/book" className="text-accent hover:underline">
              <em>A Failed Attempt at Undoing Memories</em>
            </Link>
            , a poetry collection published by the African Poetry Book Fund and Akashic Books. I write essays too — most of them end up{" "}
            <Link href="/writings" className="text-accent hover:underline">
              here
            </Link>
            .
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-12">What I Do</h2>

          <p className="leading-relaxed mb-6">I collaborate with companies and startups that want to integrate AI into their daily operations — whether that’s:</p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
              <span className="leading-relaxed">building custom AI agents</span>
            </li>
            <li className="flex items-start">
              <span className="flex h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
              <span className="leading-relaxed">automating internal workflows</span>
            </li>
            <li className="flex items-start">
              <span className="flex h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
              <span className="leading-relaxed">developing AI-powered dashboards and tooling</span>
            </li>
            <li className="flex items-start">
            <span className="flex h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
            <span className="leading-relaxed">structuring documents, conversations, and knowledge into actionable insights</span>
            </li>
          </ul>

          <p className="leading-relaxed mt-4 mb-6">
            Project engagements typically start at $5,000, with smaller Discovery/PoC phases beginning at $3,000 depending on scope and timeline.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-12">Get in Touch</h2>

          <p className="leading-relaxed mb-4">
            If you’d like to discuss a project or have something in mind, feel free to reach out.
          </p>

          <ul className="list-none pl-0 space-y-2 mb-8">
            <li>
              <a
                href="mailto:hello@daretunmise.com"
                className="text-accent hover:underline"
              >
                Email: hello@daretunmise.com
              </a>
            </li>
            <li>
              <a
                href="https://x.com/Dare_Tunmise"
                className="text-accent hover:underline"
              >
                Twitter: @daretunmise
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/dare-tunmise-47524519a/"
                className="text-accent hover:underline"
              >
                Linkedin: @daretunmise
              </a>
            </li>
            <li>
              <a
                href="https://github.com/dare-tunmise"
                className="text-accent hover:underline"
              >
                GitHub: @dare-tunmise
              </a>
            </li>
          </ul>
        </div>
      </main>
    <Footer />
    </div>
  );
};

export default About;
