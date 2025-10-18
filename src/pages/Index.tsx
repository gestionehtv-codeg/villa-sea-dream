import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import villaHero from "@/assets/villa-hero.jpg";
import villaPool from "@/assets/villa-pool.jpg";
import villaInterior from "@/assets/villa-interior.jpg";
import { Waves, Home, Sparkles, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${villaHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-background/90" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-background animate-fade-in">
            Villa Mare
          </h1>
          <p className="text-xl md:text-2xl text-background/90 mb-8 animate-fade-in">
            Il tuo paradiso privato sul Mediterraneo
          </p>
          <Link to="/booking">
            <Button size="lg" className="gradient-sunset text-lg px-8 py-6 hover-lift">
              Prenota il Tuo Soggiorno
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 gradient-sand">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 text-primary">
            Lusso & Comfort
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="hover-lift bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Waves className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Vista Mare</h3>
                <p className="text-sm text-muted-foreground">
                  Panorama mozzafiato sul Mediterraneo
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Home className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Design Esclusivo</h3>
                <p className="text-sm text-muted-foreground">
                  Architettura moderna e minimalista
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Piscina Infinity</h3>
                <p className="text-sm text-muted-foreground">
                  Piscina a sfioro con vista oceano
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Privacy Totale</h3>
                <p className="text-sm text-muted-foreground">
                  Villa esclusiva per il tuo relax
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 text-primary">
            Scopri la Villa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="relative h-96 overflow-hidden rounded-lg shadow-luxury group">
              <img
                src={villaPool}
                alt="Piscina Villa"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg shadow-luxury group">
              <img
                src={villaInterior}
                alt="Interni Villa"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          <div className="text-center">
            <Link to="/gallery">
              <Button variant="outline" size="lg" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                Vedi Tutte le Foto
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-ocean text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Pronto per la Tua Vacanza da Sogno?
          </h2>
          <p className="text-xl mb-8 text-background/90">
            Prenota ora la tua villa esclusiva sul mare
          </p>
          <Link to="/booking">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 hover-lift">
              Verifica Disponibilità
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
