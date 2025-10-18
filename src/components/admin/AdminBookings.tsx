import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Check, X, Trash2, Calendar, Mail, Phone, Users } from "lucide-react";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in: string;
  check_out: string;
  guests_count: number;
  message: string | null;
  status: string;
  created_at: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Errore nel caricamento delle prenotazioni");
      return;
    }

    setBookings(data || []);
    setLoading(false);
  };

  const updateBookingStatus = async (id: string, status: "confirmed" | "cancelled" | "pending") => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Errore nell'aggiornamento dello stato");
      return;
    }

    toast.success(`Prenotazione ${status === "confirmed" ? "confermata" : "annullata"}`);
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa prenotazione?")) return;

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      toast.error("Errore nell'eliminazione");
      return;
    }

    toast.success("Prenotazione eliminata");
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      confirmed: "default",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      pending: "In Attesa",
      confirmed: "Confermata",
      cancelled: "Annullata",
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nessuna prenotazione presente
          </CardContent>
        </Card>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.id} className="shadow-luxury">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{booking.guest_name}</CardTitle>
                  <div className="mt-2">{getStatusBadge(booking.status)}</div>
                </div>
                <div className="flex gap-2">
                  {booking.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateBookingStatus(booking.id, "confirmed")}
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateBookingStatus(booking.id, "cancelled")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteBooking(booking.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Check-in:</strong>{" "}
                    {format(new Date(booking.check_in), "dd/MM/yyyy", { locale: it })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Check-out:</strong>{" "}
                    {format(new Date(booking.check_out), "dd/MM/yyyy", { locale: it })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.guest_email}</span>
                </div>
                {booking.guest_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guest_phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.guests_count} ospiti</span>
                </div>
              </div>
              {booking.message && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Messaggio:</strong> {booking.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminBookings;
