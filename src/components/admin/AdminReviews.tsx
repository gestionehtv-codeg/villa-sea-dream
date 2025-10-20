import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trash2, ExternalLink } from "lucide-react";

interface Review {
  id: string;
  guest_name: string;
  content: string;
  rating: number;
  external_source?: string;
  external_link?: string;
  is_published: boolean;
  created_at: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewUrl, setReviewUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [newReview, setNewReview] = useState({
    guest_name: "",
    content: "",
    rating: 5,
    external_source: "",
    external_link: "",
    is_published: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
  };

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
        setNewReview({
          guest_name: data.data.guest_name,
          content: data.data.content,
          rating: data.data.rating,
          external_source: data.data.external_source,
          external_link: data.data.external_link,
          is_published: true,
        });
        setReviewUrl("");
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

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("reviews").insert([
      {
        ...newReview,
        external_source: newReview.external_source || null,
        external_link: newReview.external_link || null,
      },
    ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile aggiungere la recensione.",
      });
    } else {
      toast({
        title: "Recensione aggiunta!",
      });
      setNewReview({
        guest_name: "",
        content: "",
        rating: 5,
        external_source: "",
        external_link: "",
        is_published: true,
      });
      fetchReviews();
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_published: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile aggiornare lo stato.",
      });
    } else {
      toast({
        title: currentStatus ? "Recensione nascosta" : "Recensione pubblicata",
      });
      fetchReviews();
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa recensione?")) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile eliminare la recensione.",
      });
    } else {
      toast({
        title: "Recensione eliminata",
      });
      fetchReviews();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-primary text-primary" : "text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Aggiungi Nuova Recensione</CardTitle>
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

          <form onSubmit={handleAddReview} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guest_name">Nome Ospite</Label>
                <Input
                  id="guest_name"
                  value={newReview.guest_name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, guest_name: e.target.value })
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
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <Star
                        className={`w-6 h-6 cursor-pointer ${
                          star <= newReview.rating
                            ? "fill-primary text-primary"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Contenuto</Label>
              <Textarea
                id="content"
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="external_source">
                  Piattaforma Esterna (opzionale)
                </Label>
                <Input
                  id="external_source"
                  placeholder="es. Airbnb, Booking.com"
                  value={newReview.external_source}
                  onChange={(e) =>
                    setNewReview({ ...newReview, external_source: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="external_link">Link Esterno (opzionale)</Label>
                <Input
                  id="external_link"
                  type="url"
                  placeholder="https://..."
                  value={newReview.external_link}
                  onChange={(e) =>
                    setNewReview({ ...newReview, external_link: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={newReview.is_published}
                onCheckedChange={(checked) =>
                  setNewReview({ ...newReview, is_published: checked })
                }
              />
              <Label htmlFor="is_published">Pubblica immediatamente</Label>
            </div>

            <Button type="submit">Aggiungi Recensione</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recensioni Esistenti</h3>
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{review.guest_name}</h4>
                    {renderStars(review.rating)}
                  </div>
                  {review.external_source && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{review.external_source}</span>
                      {review.external_link && (
                        <a
                          href={review.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={review.is_published ? "default" : "secondary"}>
                    {review.is_published ? "Pubblicata" : "Bozza"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(review.id, review.is_published)}
                  >
                    {review.is_published ? "Nascondi" : "Pubblica"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteReview(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground mb-2">{review.content}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString("it-IT")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
