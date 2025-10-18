import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import villaHero from "@/assets/villa-hero.jpg";
import villaPool from "@/assets/villa-pool.jpg";
import villaInterior from "@/assets/villa-interior.jpg";
import villaBedroom from "@/assets/villa-bedroom.jpg";
import beachView from "@/assets/beach-view.jpg";
import villaTerrace from "@/assets/villa-terrace.jpg";

const Gallery = () => {
  const images = [
    { src: villaHero, title: "Vista Principale", description: "La villa con piscina infinity" },
    { src: villaPool, title: "Piscina al Tramonto", description: "Relax e panorami mozzafiato" },
    { src: villaInterior, title: "Living Room", description: "Spazi luminosi e moderni" },
    { src: villaBedroom, title: "Camera da Letto", description: "Comfort e vista mare" },
    { src: beachView, title: "La Spiaggia", description: "Acque cristalline del Mediterraneo" },
    { src: villaTerrace, title: "Terrazza", description: "Cene romantiche sotto le stelle" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">
              Galleria Fotografica
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Esplora ogni angolo della nostra villa di lusso sul mare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-luxury hover-lift"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-serif font-bold text-background mb-2">
                    {image.title}
                  </h3>
                  <p className="text-background/90 text-sm">
                    {image.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-lg gradient-sand shadow-luxury">
            <h2 className="text-2xl font-serif font-bold mb-4 text-primary text-center">
              Caratteristiche della Villa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">5</div>
                <div className="text-muted-foreground">Camere da Letto</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">4</div>
                <div className="text-muted-foreground">Bagni</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">300m²</div>
                <div className="text-muted-foreground">Superficie</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">12</div>
                <div className="text-muted-foreground">Ospiti Max</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">∞</div>
                <div className="text-muted-foreground">Piscina Infinity</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">100m</div>
                <div className="text-muted-foreground">Dalla Spiaggia</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
