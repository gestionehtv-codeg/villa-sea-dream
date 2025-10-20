import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";

interface Review {
  id: string;
  guest_name: string;
  content: string;
  rating: number;
  external_source?: string;
  external_link?: string;
  created_at: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "fill-primary text-primary" : "text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl mb-6 text-center">
            Recensioni
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Scopri cosa dicono i nostri ospiti della loro esperienza a Villa Mare
          </p>

          {loading ? (
            <p className="text-center">Caricamento recensioni...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nessuna recensione disponibile al momento.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{review.guest_name}</h3>
                        {review.external_source && (
                          <p className="text-sm text-muted-foreground capitalize">
                            {review.external_source}
                          </p>
                        )}
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-muted-foreground mb-4">{review.content}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString("it-IT")}
                      </span>
                      {review.external_link && (
                        <a
                          href={review.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          Vedi su {review.external_source || "piattaforma"}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;
