import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    icon_name: "Star",
  });

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

  const handleAddService = async () => {
    if (!newService.title || !newService.description) {
      toast.error("Inserisci titolo e descrizione");
      return;
    }

    const maxOrder = services.length > 0 
      ? Math.max(...services.map(s => s.display_order))
      : -1;

    const { error } = await supabase
      .from("services")
      .insert({
        ...newService,
        display_order: maxOrder + 1,
      });

    if (error) {
      console.error("Error adding service:", error);
      toast.error("Errore nell'aggiunta del servizio");
      return;
    }

    toast.success("Servizio aggiunto con successo");
    setNewService({ title: "", description: "", icon_name: "Star" });
    fetchServices();
  };

  const handleDeleteService = async (id: string) => {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting service:", error);
      toast.error("Errore nell'eliminazione");
      return;
    }

    toast.success("Servizio eliminato");
    fetchServices();
  };

  const handleUpdateService = async (id: string, field: string, value: string) => {
    const { error } = await supabase
      .from("services")
      .update({ [field]: value })
      .eq("id", id);

    if (error) {
      console.error("Error updating service:", error);
      toast.error("Errore nell'aggiornamento");
      return;
    }

    toast.success("Servizio aggiornato");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aggiungi Nuovo Servizio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={newService.title}
              onChange={(e) =>
                setNewService({ ...newService, title: e.target.value })
              }
              placeholder="Vista Mare"
            />
          </div>
          <div>
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              placeholder="Panorama mozzafiato sul Mediterraneo"
            />
          </div>
          <div>
            <Label htmlFor="icon_name">Nome Icona (Lucide React)</Label>
            <Input
              id="icon_name"
              value={newService.icon_name}
              onChange={(e) =>
                setNewService({ ...newService, icon_name: e.target.value })
              }
              placeholder="Waves, Home, Sparkles, etc."
            />
          </div>
          <Button onClick={handleAddService} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi Servizio
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label>Titolo</Label>
                      <Input
                        value={service.title}
                        onChange={(e) =>
                          handleUpdateService(service.id, "title", e.target.value)
                        }
                        onBlur={() => fetchServices()}
                      />
                    </div>
                    <div>
                      <Label>Descrizione</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) =>
                          handleUpdateService(service.id, "description", e.target.value)
                        }
                        onBlur={() => fetchServices()}
                      />
                    </div>
                    <div>
                      <Label>Icona</Label>
                      <Input
                        value={service.icon_name}
                        onChange={(e) =>
                          handleUpdateService(service.id, "icon_name", e.target.value)
                        }
                        onBlur={() => fetchServices()}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteService(service.id)}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;