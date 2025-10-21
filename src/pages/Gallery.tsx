import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useSiteContent } from "@/hooks/useSiteContent";
import villaHero from "@/assets/villa-hero.jpg";
import villaPool from "@/assets/villa-pool.jpg";
import villaInterior from "@/assets/villa-interior.jpg";
import villaBedroom from "@/assets/villa-bedroom.jpg";
import beachView from "@/assets/beach-view.jpg";
import villaTerrace from "@/assets/villa-terrace.jpg";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string | null;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const { getContent } = useSiteContent("gallery");

  const defaultImages = [
    { id: "1", image_url: villaHero, title: "Vista Principale", description: "La villa con piscina infinity" },
    { id: "2", image_url: villaPool, title: "Piscina al Tramonto", description: "Relax e panorami mozzafiato" },
    { id: "3", image_url: villaInterior, title: "Living Room", description: "Spazi luminosi e moderni" },
    { id: "4", image_url: villaBedroom, title: "Camera da Letto", description: "Comfort e vista mare" },
    { id: "5", image_url: beachView, title: "La Spiaggia", description: "Acque cristalline del Mediterraneo" },
    { id: "6", image_url: villaTerrace, title: "Terrazza", description: "Cene romantiche sotto le stelle" },
  ];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching images:", error);
      setImages(defaultImages);
      return;
    }

    if (data && data.length > 0) {
      setImages(data);
    } else {
      setImages(defaultImages);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">
              {getContent("page_title", "Galleria Fotografica")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {getContent("page_subtitle", "Esplora ogni angolo della nostra villa di lusso sul mare")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-luxury hover-lift"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.image_url}
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
              {getContent("features_title", "Caratteristiche della Villa")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{getContent("bedrooms", "5")}</div>
                <div className="text-muted-foreground">{getContent("bedrooms_label", "Camere da Letto")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{getContent("bathrooms", "4")}</div>
                <div className="text-muted-foreground">{getContent("bathrooms_label", "Bagni")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{getContent("surface", "300m²")}</div>
                <div className="text-muted-foreground">{getContent("surface_label", "Superficie")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{getContent("max_guests", "12")}</div>
                <div className="text-muted-foreground">{getContent("max_guests_label", "Ospiti Max")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{getContent("pool", "∞")}</div>
                <div className="text-muted-foreground">{getContent("pool_label", "Piscina Infinity")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">{getContent("beach_distance", "100m")}</div>
                <div className="text-muted-foreground">{getContent("beach_distance_label", "Dalla Spiaggia")}</div>
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
