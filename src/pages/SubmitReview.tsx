import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const SubmitReview = () => {
  const [reviewUrl, setReviewUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [formData, setFormData] = useState({
    guest_name: "",
    content: "",
    rating: 5,
    external_source: "",
    external_link: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleExtractFromUrl = async () => {
    if (!reviewUrl) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Inserisci un link alla recensione.",
      });
      return;
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-review', {
        body: { url: reviewUrl },
      });

      if (error) throw error;

      if (data.success) {
        setFormData({
          guest_name: data.data.guest_name,
          content: data.data.content,
          rating: data.data.rating,
          external_source: data.data.external_source,
          external_link: data.data.external_link,
        });
        toast({
          title: "Recensione estratta!",
          description: "I dati sono stati estratti automaticamente.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error extracting review:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile estrarre i dati dalla recensione.",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("reviews").insert([
      {
        guest_name: formData.guest_name,
        content: formData.content,
        rating: formData.rating,
        external_source: formData.external_source || null,
        external_link: formData.external_link || null,
        is_published: false, // Needs admin approval
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante l'invio della recensione.",
      });
    } else {
      toast({
        title: "Recensione inviata!",
        description:
          "La tua recensione è stata inviata e verrà pubblicata dopo la verifica.",
      });
      setFormData({ 
        guest_name: "", 
        content: "", 
        rating: 5,
        external_source: "",
        external_link: "",
      });
      setReviewUrl("");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-3xl text-center">
                Lascia una Recensione
              </CardTitle>
              <p className="text-muted-foreground text-center">
                Condividi la tua esperienza a Villa Mare
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h3 className="font-semibold mb-3">Genera recensione da link</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Incolla il link della recensione (Airbnb, Booking.com, ecc.) e i dati verranno estratti automaticamente.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://www.airbnb.com/reviews/..."
                    value={reviewUrl}
                    onChange={(e) => setReviewUrl(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={handleExtractFromUrl}
                    disabled={isExtracting}
                  >
                    {isExtracting ? "Estrazione..." : "Estrai"}
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="guest_name">Nome</Label>
                  <Input
                    id="guest_name"
                    value={formData.guest_name}
                    onChange={(e) =>
                      setFormData({ ...formData, guest_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Valutazione</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            star <= formData.rating
                              ? "fill-primary text-primary"
                              : "text-muted hover:text-primary"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Recensione</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Invio in corso..." : "Invia Recensione"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  La tua recensione sarà visibile dopo la verifica da parte del team.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitReview;
