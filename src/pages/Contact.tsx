import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
}

const Contact = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching contact:", error);
      return;
    }

    if (data) {
      setContact(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 gradient-sand pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary text-center mb-4">
              Contatti
            </h1>
            <p className="text-xl text-secondary text-center mb-12">
              Siamo qui per rispondere alle tue domande
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-luxury">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Telefono</h3>
                      <a 
                        href={`tel:${contact?.phone}`}
                        className="text-secondary hover:text-primary transition-colors"
                      >
                        {contact?.phone || "In aggiornamento"}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-luxury">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Email</h3>
                      <a 
                        href={`mailto:${contact?.email}`}
                        className="text-secondary hover:text-primary transition-colors"
                      >
                        {contact?.email || "In aggiornamento"}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-luxury">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Indirizzo</h3>
                      <p className="text-secondary">
                        {contact?.address || "In aggiornamento"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {contact?.whatsapp && (
                <Card className="shadow-luxury">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <MessageCircle className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
                        <a 
                          href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary hover:text-primary transition-colors"
                        >
                          {contact.whatsapp}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {(contact?.instagram || contact?.facebook) && (
              <div className="mt-8 text-center">
                <h3 className="font-semibold text-lg mb-4">Seguici sui Social</h3>
                <div className="flex justify-center gap-4">
                  {contact.instagram && (
                    <a
                      href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {contact.facebook && (
                    <a
                      href={contact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
