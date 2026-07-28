import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { pageFrame, pageTitle, sectionLabel } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Book — A Failed Attempt at Undoing Memories",
  description:
    "\"A Failed Attempt at Undoing Memories\" — a poetry collection by Dare Tunmise, selected and edited by Kwame Dawes and Chris Abani, published by the African Poetry Book Fund and Akashic Books.",
  keywords: [
    "Dare Tunmise",
    "A failed attempt at undoing memories",
    "African Poetry Book Fund",
    "Kwame Dawes",
    "Chris Abani",
    "African poetry",
    "Akashic Books",
    "poetry collection",
  ],
  alternates: { canonical: "https://www.daretunmise.com/book" },
  openGraph: {
    siteName: "Dare Tunmise",
    title: "A Failed Attempt at Undoing Memories — Dare Tunmise",
    description:
      "A poetry collection by Dare Tunmise exploring memory's complexity and resilience. Selected and edited by Kwame Dawes and Chris Abani.",
    url: "https://www.daretunmise.com/book",
    type: "book",
    images: [
      {
        url: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/b6f4bccb-7e88-4b72-8835-1fcf2b2cf838.__CR0,0,300,300_PT0_SX300_V1___.jpg",
        width: 300,
        height: 300,
        alt: "A Failed Attempt at Undoing Memories — Book Cover",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "A Failed Attempt at Undoing Memories — Dare Tunmise",
    description: "Poetry by Dare Tunmise. Selected and edited by Kwame Dawes and Chris Abani.",
    images: ["https://m.media-amazon.com/images/S/aplus-media-library-service-media/b6f4bccb-7e88-4b72-8835-1fcf2b2cf838.__CR0,0,300,300_PT0_SX300_V1___.jpg"],
  },
};


const Book = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className={`${pageFrame} pb-16`}>
        <div className="mt-16 sm:mt-20">
          <p className={sectionLabel}>Poetry</p>
          <h1 className={`${pageTitle} mt-4`}>
            A failed attempt at undoing memories
          </h1>
        </div>

        {/* Cover sits beside the credits rather than above them. Rendered at
            260px because the source is only 300px wide — any larger and it
            upscales into softness. */}
        <div className="mt-12 flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-12">
          <img
            src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/b6f4bccb-7e88-4b72-8835-1fcf2b2cf838.__CR0,0,300,300_PT0_SX300_V1___.jpg"
            alt="A failed attempt at undoing memories — book cover"
            width={300}
            height={300}
            className="w-full max-w-[260px] self-center rounded shadow-2xl sm:self-start"
          />

          <dl className="flex-1 space-y-8">
            <div>
              <dt className={sectionLabel}>Selected and edited by</dt>
              <dd className="mt-2 text-lg">Kwame Dawes and Chris Abani</dd>
            </div>
            <div>
              <dt className={sectionLabel}>Published by</dt>
              <dd className="mt-2 text-lg">
                African Poetry Book Fund and Akashic Books
              </dd>
            </div>
          </dl>
        </div>

        {/* The blurb is the strongest thing on this page, so it gets the size. */}
        <figure className="mt-16 border-t border-border pt-10 sm:mt-20">
          <blockquote className="text-xl italic leading-relaxed sm:text-2xl">
            “Tunmise writes in praise of memory’s complexity and resilience. He is
            mindful of the ways in which memory stores and is the store; the ways in
            which it is beholden to naming and ordering, as well as how it represents
            reality.”
          </blockquote>
          <figcaption className={`${sectionLabel} mt-6`}>
            Tjawangwa Dema, from the preface
          </figcaption>
        </figure>

        <section className="mt-16 border-t border-border pt-10 sm:mt-20">
          <h2 className={sectionLabel}>Keep up</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            New writing goes out through the feed.
          </p>
          <a
            href="/feed.xml"
            className="mt-6 inline-block text-lg underline underline-offset-4 transition-colors hover:text-accent"
          >
            Subscribe via RSS →
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Book;
