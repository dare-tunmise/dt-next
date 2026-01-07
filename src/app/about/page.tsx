import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About | Dare Tunmise - Writer & Software Engineer",
  description:
    "Learn about Dare Tunmise, a software engineer building backend systems and AI-powered tools. Specializing in LLMs, system architecture, and workflow automation.",
  openGraph: {
    title: "About Dare Tunmise",
    description: "Software Engineer & Writer building at the intersection of AI and human behavior.",
    url: "https://www.daretunmise.com/about",
    images: [
      {
        url: "https://www.daretunmise.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dare Tunmise Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Dare Tunmise",
    description: "Writer and Software Engineer.",
    creator: "@Dare_Tunmise",
    images: ["https://www.daretunmise.com/og-image.jpg"],
  },
};

const About = () => {
  return (
    <div className="min-h-screen">
    <Header />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 border-b border-border pb-4">
          About
        </h1>

        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-6">Hi, </p>
          <p className="text-lg leading-relaxed mb-6">
            I’m Dare Tunmise — a software engineer and writer.
            I build backend systems, AI-powered tools, and thoughtful products on the web that make work easier for people.
          </p>

          <p className="leading-relaxed mb-6">
            I currently work with a London-based travel-tech company, where I build backend services, design system architecture, and develop AI-powered features used in production. My work centers on understanding how large language models behave under real-world constraints and using that understanding to solve practical problems for teams and businesses.
          </p>

          <p className="leading-relaxed mb-6">
            Outside work, I explore ideas, write, and build products that sit at the intersection of technology, structure, and human behaviour. I enjoy taking messy workflows, ambiguous information, or complex processes and designing systems that make them simple and usable.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-12">What I Do</h2>

          <p className="leading-relaxed mb-6">I collaborate with companies that want to integrate AI into their daily operations — whether that’s:</p>
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
            Projects typically start from $3,000, depending on scope.
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
