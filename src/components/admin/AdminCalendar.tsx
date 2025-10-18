import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format, isSameDay } from "date-fns";
import { it } from "date-fns/locale";

interface AvailabilityDate {
  id: string;
  date: string;
  is_available: boolean;
  notes: string | null;
}

const AdminCalendar = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<AvailabilityDate[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchUnavailableDates();
  }, []);

  const fetchUnavailableDates = async () => {
    const { data } = await supabase
      .from("calendar_availability")
      .select("*")
      .eq("is_available", false);

    if (data) {
      setUnavailableDates(data);
    }
  };

  const toggleDateAvailability = async () => {
    if (selectedDates.length === 0) {
      toast.error("Seleziona almeno una data");
      return;
    }

    try {
      for (const date of selectedDates) {
        const dateStr = format(date, "yyyy-MM-dd");
        
        // Check if date already exists
        const existing = unavailableDates.find((d) => d.date === dateStr);

        if (existing) {
          // Toggle availability
          await supabase
            .from("calendar_availability")
            .update({ is_available: !existing.is_available, notes })
            .eq("id", existing.id);
        } else {
          // Create new unavailable date
          await supabase.from("calendar_availability").insert({
            date: dateStr,
            is_available: false,
            notes,
          });
        }
      }

      toast.success("Disponibilità aggiornata");
      setSelectedDates([]);
      setNotes("");
      fetchUnavailableDates();
    } catch (error) {
      console.error("Error updating availability:", error);
      toast.error("Errore nell'aggiornamento");
    }
  };

  const removeUnavailableDate = async (id: string) => {
    const { error } = await supabase
      .from("calendar_availability")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Errore nell'eliminazione");
      return;
    }

    toast.success("Data rimossa");
    fetchUnavailableDates();
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(
      (d) => !d.is_available && isSameDay(new Date(d.date), date)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-luxury">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Gestione Disponibilità</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => setSelectedDates(dates || [])}
              locale={it}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                unavailable: (date) => isDateUnavailable(date),
              }}
              modifiersStyles={{
                unavailable: {
                  backgroundColor: "hsl(var(--destructive) / 0.1)",
                  color: "hsl(var(--destructive))",
                },
              }}
            />
          </div>

          <div>
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Aggiungi note per le date selezionate..."
              rows={3}
            />
          </div>

          <Button
            onClick={toggleDateAvailability}
            disabled={selectedDates.length === 0}
            className="w-full gradient-ocean"
          >
            Imposta come Non Disponibile ({selectedDates.length} date)
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Le date evidenziate in rosso sono non disponibili per le prenotazioni
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-luxury">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Date Non Disponibili</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {unavailableDates.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nessuna data bloccata
              </p>
            ) : (
              unavailableDates
                .filter((d) => !d.is_available)
                .map((dateEntry) => (
                  <div
                    key={dateEntry.id}
                    className="flex justify-between items-start p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-semibold">
                        {format(new Date(dateEntry.date), "dd MMMM yyyy", {
                          locale: it,
                        })}
                      </p>
                      {dateEntry.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {dateEntry.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeUnavailableDate(dateEntry.id)}
                    >
                      Rimuovi
                    </Button>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCalendar;
