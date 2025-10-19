import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Trash2 } from "lucide-react";

interface DailyPrice {
  id: string;
  date: string;
  price: number;
}

const AdminPrices = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [price, setPrice] = useState("");
  const [dailyPrices, setDailyPrices] = useState<DailyPrice[]>([]);

  useEffect(() => {
    fetchDailyPrices();
  }, []);

  const fetchDailyPrices = async () => {
    const { data, error } = await supabase
      .from("daily_prices")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching daily prices:", error);
      return;
    }

    if (data) {
      setDailyPrices(data);
    }
  };

  const handleSavePrice = async () => {
    if (!selectedDate || !price) {
      toast.error("Seleziona una data e inserisci un prezzo");
      return;
    }

    const dateStr = selectedDate.toISOString().split("T")[0];
    
    const { error } = await supabase
      .from("daily_prices")
      .upsert({
        date: dateStr,
        price: parseFloat(price),
      });

    if (error) {
      console.error("Error saving price:", error);
      toast.error("Errore nel salvataggio del prezzo");
      return;
    }

    toast.success("Prezzo salvato con successo");
    setPrice("");
    setSelectedDate(undefined);
    fetchDailyPrices();
  };

  const handleDeletePrice = async (id: string) => {
    const { error } = await supabase
      .from("daily_prices")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting price:", error);
      toast.error("Errore nell'eliminazione del prezzo");
      return;
    }

    toast.success("Prezzo eliminato");
    fetchDailyPrices();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Imposta Prezzi Giornalieri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Seleziona Data</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
            />
          </div>
          <div>
            <Label htmlFor="price">Prezzo (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="150.00"
            />
          </div>
          <Button onClick={handleSavePrice} className="w-full">
            Salva Prezzo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prezzi Impostati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dailyPrices.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {new Date(item.date).toLocaleDateString("it-IT")}
                  </p>
                  <p className="text-sm text-muted-foreground">€{item.price}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePrice(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {dailyPrices.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nessun prezzo impostato
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrices;
