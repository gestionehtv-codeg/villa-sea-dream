import { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

const Footer = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    const { data } = await supabase
      .from("contact_info")
      .select("phone, email, address")
      .limit(1)
      .maybeSingle();

    if (data) {
      setContact(data);
    }
  };

  return (
    <footer className="gradient-sand py-12 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold text-primary mb-4">Villa Mare</h3>
            <p className="text-muted-foreground">
              La tua oasi di lusso sul mare Mediterraneo
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contatti</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{contact?.email || "info@villamare.it"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{contact?.phone || "+39 123 456 7890"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{contact?.address || "Costa Mediterranea, Italia"}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Link Rapidi</h4>
            <div className="space-y-2">
              <a href="#/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#/gallery" className="block text-muted-foreground hover:text-primary transition-colors">
                Galleria
              </a>
              <a href="#/booking" className="block text-muted-foreground hover:text-primary transition-colors">
                Prenota
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; 2024 Villa Mare. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
