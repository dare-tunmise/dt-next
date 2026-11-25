import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageFrame, pageTitle, sectionLabel } from "@/lib/typography";

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
          <p className="text-lg leading-relaxed mb-6">
            I’m a software engineer and writer. I work across backend engineering, cloud infrastructure and applied AI, building products and the systems behind them.
          </p>

          <p className="leading-relaxed mb-6">
            I work at Vamoos, a London-based travel technology company, where I’ve built and worked on products including TripImport, Qtango and Imsert.
          </p>

          <p className="leading-relaxed mb-6">
            I’m also a co-founder of{" "}
            <a href="https://slategraph.com/" className="text-accent hover:underline">
              Slategraph
            </a>
            , alongside{" "}
            <a href="https://immanuelcaspian.com/" className="text-accent hover:underline">
              Kolapo Immanuel
            </a>
            . Slategraph is an AI startup building autonomous agents for marketing teams. I also volunteer engineering time at{" "}
            <a href="https://findr.ng/" className="text-accent hover:underline">
              Findr
            </a>
            , a platform for reporting and locating missing persons in Nigeria.
          </p>

          <p className="leading-relaxed mb-6">
            I studied Political Science at the University of Ibadan.
          </p>

          <p className="leading-relaxed mb-6">
            I write poetry and essays. My collection,{" "}
            <Link href="/book" className="text-accent hover:underline">
              <em>A Failed Attempt at Undoing Memories</em>
            </Link>
            , was selected by Kwame Dawes and Chris Abani for the African Poetry Book Fund and published by Akashic Books, New York, in 2024. I publish essays and other writing{" "}
            <Link href="/writings" className="text-accent hover:underline">
              here
            </Link>
            .
          </p>

          <section className="mt-12 border-t border-border pt-8">
            <h2 className={sectionLabel}>Elsewhere</h2>
            <ul className="mt-6 list-none pl-0 space-y-2">
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
                  X: @Dare_Tunmise
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/dare-tunmise-47524519a/"
                  className="text-accent hover:underline"
                >
                  LinkedIn: @daretunmise
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
          </section>
        </div>
      </main>
    <Footer />
    </div>
  );
};

export default About;
