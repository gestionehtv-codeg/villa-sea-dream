import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
}

const AdminContacts = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
  });

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
      setFormData({
        phone: data.phone,
        email: data.email,
        address: data.address,
        whatsapp: data.whatsapp || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.phone || !formData.email || !formData.address) {
      toast.error("Inserisci almeno telefono, email e indirizzo");
      return;
    }

    if (contact) {
      const { error } = await supabase
        .from("contact_info")
        .update(formData)
        .eq("id", contact.id);

      if (error) {
        console.error("Error updating contact:", error);
        toast.error("Errore nell'aggiornamento");
        return;
      }
    } else {
      const { error } = await supabase
        .from("contact_info")
        .insert(formData);

      if (error) {
        console.error("Error creating contact:", error);
        toast.error("Errore nella creazione");
        return;
      }
    }

    toast.success("Contatti salvati con successo");
    fetchContact();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestisci Informazioni di Contatto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="phone">Telefono *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="+39 123 456 7890"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="info@villamare.it"
          />
        </div>
        <div>
          <Label htmlFor="address">Indirizzo *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Via Mare, 123 - Località"
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) =>
              setFormData({ ...formData, whatsapp: e.target.value })
            }
            placeholder="+39 123 456 7890"
          />
        </div>
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={formData.instagram}
            onChange={(e) =>
              setFormData({ ...formData, instagram: e.target.value })
            }
            placeholder="@villamare"
          />
        </div>
        <div>
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={formData.facebook}
            onChange={(e) =>
              setFormData({ ...formData, facebook: e.target.value })
            }
            placeholder="facebook.com/villamare"
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Salva Contatti
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminContacts;
