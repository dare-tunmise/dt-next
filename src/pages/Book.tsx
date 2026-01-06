import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Book = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-12 text-center">
          A failed attempt at undoing memories
        </h1>
        
        <div className="max-w-md mx-auto mb-12">
          <img 
            src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/b6f4bccb-7e88-4b72-8835-1fcf2b2cf838.__CR0,0,300,300_PT0_SX300_V1___.jpg" 
            alt="A failed attempt at undoing memories - Book Cover"
            className="w-full rounded-lg shadow-2xl"
          />
        </div>

        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground mb-2">
            Edited by <span className="text-foreground font-semibold">Kwame Dawes</span> and <span className="text-foreground font-semibold">Chris Abani</span>
          </p>
          <p className="text-muted-foreground">
            Published by <span className="text-foreground font-semibold">African Poetry Book Fund</span> and <span className="text-foreground font-semibold">Akashic Books</span>
          </p>
        </div>

        <div className="prose prose-invert max-w-none mb-12">
          <p className="text-lg leading-relaxed text-center">
“Tunmise writes in praise of memory’s complexity and resilience. He is mindful of the ways in which memory stores and is the store; the ways in which it is beholden to naming and ordering, as well as how it represents reality.”

-Tjawangwa Dema
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to receive updates about new writings, projects, and book releases.
          </p>
          <form className="space-y-4">
            <input 
              type="email" 
              placeholder="Your email address"
              className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <button 
              type="submit"
              className="w-full px-6 py-3 bg-accent text-accent-foreground font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
      </main>

     <Footer />
    </div>
  );
};

export default Book;
