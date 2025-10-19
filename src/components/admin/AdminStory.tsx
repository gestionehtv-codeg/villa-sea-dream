import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface StoryContent {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
}

const AdminStory = () => {
  const [story, setStory] = useState<StoryContent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
  });

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    const { data, error } = await supabase
      .from("story_content")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching story:", error);
      return;
    }

    if (data) {
      setStory(data);
      setFormData({
        title: data.title,
        content: data.content,
        image_url: data.image_url || "",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Inserisci titolo e contenuto");
      return;
    }

    if (story) {
      const { error } = await supabase
        .from("story_content")
        .update(formData)
        .eq("id", story.id);

      if (error) {
        console.error("Error updating story:", error);
        toast.error("Errore nell'aggiornamento");
        return;
      }
    } else {
      const { error } = await supabase
        .from("story_content")
        .insert(formData);

      if (error) {
        console.error("Error creating story:", error);
        toast.error("Errore nella creazione");
        return;
      }
    }

    toast.success("Storia salvata con successo");
    fetchStory();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestisci La Nostra Storia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Titolo</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="La Storia di Villa Mare"
          />
        </div>
        <div>
          <Label htmlFor="image_url">URL Immagine (opzionale)</Label>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            placeholder="https://..."
          />
        </div>
        <div>
          <Label htmlFor="content">Contenuto</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Racconta la storia della villa..."
            rows={10}
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Salva Storia
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminStory;
