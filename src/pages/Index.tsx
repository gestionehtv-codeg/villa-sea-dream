import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import villaHero from "@/assets/villa-hero.jpg";
import villaPool from "@/assets/villa-pool.jpg";
import villaInterior from "@/assets/villa-interior.jpg";
import * as LucideIcons from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
}

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching services:", error);
      return;
    }

    if (data) {
      setServices(data);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Star;
    return Icon;
  };

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const Icon = getIcon(service.icon_name);
              return (
                <Card key={service.id} className="hover-lift bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
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
