import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast.error("Carica solo file immagine");
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      setNewImage({ ...newImage, image_url: publicUrl });
      toast.success("Immagine caricata");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Errore nel caricamento");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImage.image_url || !newImage.title) {
      toast.error("Inserisci immagine e titolo");
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
            <Label htmlFor="file_upload">Carica Immagine (JPG, PNG, etc.)</Label>
            <div className="flex gap-2">
              <Input
                id="file_upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                className="shrink-0"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {newImage.image_url && (
              <p className="text-xs text-muted-foreground mt-1">
                Immagine caricata ✓
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="image_url">Oppure URL Immagine</Label>
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
