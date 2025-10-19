import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string | null;
  display_order: number;
}

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newImage, setNewImage] = useState({
    image_url: "",
    title: "",
    description: "",
  });

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
      return;
    }

    if (data) {
      setImages(data);
    }
  };

  const handleAddImage = async () => {
    if (!newImage.image_url || !newImage.title) {
      toast.error("Inserisci URL e titolo dell'immagine");
      return;
    }

    const maxOrder = images.length > 0 
      ? Math.max(...images.map(img => img.display_order))
      : -1;

    const { error } = await supabase
      .from("gallery_images")
      .insert({
        ...newImage,
        display_order: maxOrder + 1,
      });

    if (error) {
      console.error("Error adding image:", error);
      toast.error("Errore nell'aggiunta dell'immagine");
      return;
    }

    toast.success("Immagine aggiunta con successo");
    setNewImage({ image_url: "", title: "", description: "" });
    fetchImages();
  };

  const handleDeleteImage = async (id: string) => {
    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting image:", error);
      toast.error("Errore nell'eliminazione dell'immagine");
      return;
    }

    toast.success("Immagine eliminata");
    fetchImages();
  };

  const handleUpdateImage = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from("gallery_images")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Error updating image:", error);
      toast.error("Errore nell'aggiornamento");
      return;
    }

    toast.success("Immagine aggiornata");
    fetchImages();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aggiungi Nuova Immagine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="image_url">URL Immagine</Label>
            <Input
              id="image_url"
              value={newImage.image_url}
              onChange={(e) =>
                setNewImage({ ...newImage, image_url: e.target.value })
              }
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={newImage.title}
              onChange={(e) =>
                setNewImage({ ...newImage, title: e.target.value })
              }
              placeholder="Vista mare"
            />
          </div>
          <div>
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={newImage.description}
              onChange={(e) =>
                setNewImage({ ...newImage, description: e.target.value })
              }
              placeholder="Descrizione dell'immagine"
            />
          </div>
          <Button onClick={handleAddImage} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi Immagine
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-32 h-32 object-cover rounded-md"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    value={image.title}
                    onChange={(e) =>
                      handleUpdateImage(image.id, "title", e.target.value)
                    }
                    onBlur={() => fetchImages()}
                  />
                  <Textarea
                    value={image.description || ""}
                    onChange={(e) =>
                      handleUpdateImage(image.id, "description", e.target.value)
                    }
                    onBlur={() => fetchImages()}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
