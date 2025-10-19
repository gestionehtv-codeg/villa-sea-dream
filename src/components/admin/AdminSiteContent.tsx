import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface SiteContent {
  id: string;
  page: string;
  section: string;
  content_key: string;
  content_value: string;
}

const AdminSiteContent = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [newContent, setNewContent] = useState({
    page: "",
    section: "",
    content_key: "",
    content_value: "",
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("page", { ascending: true })
      .order("section", { ascending: true });

    if (error) {
      console.error("Error fetching contents:", error);
      return;
    }

    if (data) {
      setContents(data);
    }
  };

  const handleAddContent = async () => {
    if (!newContent.page || !newContent.section || !newContent.content_key || !newContent.content_value) {
      toast.error("Compila tutti i campi");
      return;
    }

    const { error } = await supabase
      .from("site_content")
      .insert(newContent);

    if (error) {
      console.error("Error adding content:", error);
      toast.error("Errore nell'aggiunta del contenuto");
      return;
    }

    toast.success("Contenuto aggiunto");
    setNewContent({ page: "", section: "", content_key: "", content_value: "" });
    fetchContents();
  };

  const handleUpdateContent = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from("site_content")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Error updating content:", error);
      toast.error("Errore nell'aggiornamento");
      return;
    }

    toast.success("Contenuto aggiornato");
  };

  const handleDeleteContent = async (id: string) => {
    const { error } = await supabase
      .from("site_content")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting content:", error);
      toast.error("Errore nell'eliminazione");
      return;
    }

    toast.success("Contenuto eliminato");
    fetchContents();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aggiungi Nuovo Contenuto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="page">Pagina</Label>
              <Input
                id="page"
                value={newContent.page}
                onChange={(e) =>
                  setNewContent({ ...newContent, page: e.target.value })
                }
                placeholder="home, booking, gallery, etc."
              />
            </div>
            <div>
              <Label htmlFor="section">Sezione</Label>
              <Input
                id="section"
                value={newContent.section}
                onChange={(e) =>
                  setNewContent({ ...newContent, section: e.target.value })
                }
                placeholder="hero, cta, footer, etc."
              />
            </div>
          </div>
          <div>
            <Label htmlFor="content_key">Chiave</Label>
            <Input
              id="content_key"
              value={newContent.content_key}
              onChange={(e) =>
                setNewContent({ ...newContent, content_key: e.target.value })
              }
              placeholder="title, subtitle, description, etc."
            />
          </div>
          <div>
            <Label htmlFor="content_value">Contenuto</Label>
            <Textarea
              id="content_value"
              value={newContent.content_value}
              onChange={(e) =>
                setNewContent({ ...newContent, content_value: e.target.value })
              }
              placeholder="Il testo che apparirà sul sito"
              rows={3}
            />
          </div>
          <Button onClick={handleAddContent} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi Contenuto
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {contents.map((content) => (
          <Card key={content.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs">Pagina</Label>
                      <Input
                        value={content.page}
                        onChange={(e) =>
                          handleUpdateContent(content.id, "page", e.target.value)
                        }
                        onBlur={() => fetchContents()}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Sezione</Label>
                      <Input
                        value={content.section}
                        onChange={(e) =>
                          handleUpdateContent(content.id, "section", e.target.value)
                        }
                        onBlur={() => fetchContents()}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Chiave</Label>
                      <Input
                        value={content.content_key}
                        onChange={(e) =>
                          handleUpdateContent(content.id, "content_key", e.target.value)
                        }
                        onBlur={() => fetchContents()}
                        className="h-8"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Contenuto</Label>
                    <Textarea
                      value={content.content_value}
                      onChange={(e) =>
                        handleUpdateContent(content.id, "content_value", e.target.value)
                      }
                      onBlur={() => fetchContents()}
                      rows={2}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteContent(content.id)}
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

export default AdminSiteContent;