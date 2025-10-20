import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingCalendar from "@/components/BookingCalendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CreditCard, Wallet } from "lucide-react";

const Booking = () => {
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    message: "",
    payment_method: "credit_card",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRange.from || !selectedRange.to) {
      toast.error("Seleziona le date di check-in e check-out");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("bookings").insert({
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone,
        check_in: format(selectedRange.from, "yyyy-MM-dd"),
        check_out: format(selectedRange.to, "yyyy-MM-dd"),
        guests_count: parseInt(formData.guests),
        message: formData.message,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Richiesta di prenotazione inviata con successo!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        guests: "2",
        message: "",
        payment_method: "credit_card",
      });
      setSelectedRange({});
      
      // Navigate to home after short delay
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Errore nell'invio della richiesta. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-primary">
              Prenota Villa Mare
            </h1>
            <p className="text-xl text-muted-foreground">
              Seleziona le date e compila il modulo per richiedere una prenotazione
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card className="shadow-luxury">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Disponibilità</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <BookingCalendar
                  selectedRange={selectedRange}
                  onRangeSelect={setSelectedRange}
                />
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="shadow-luxury">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Dati di Prenotazione</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedRange.from && selectedRange.to && (
                    <div className="p-4 rounded-lg gradient-sand mb-4">
                      <p className="text-sm font-semibold mb-2">Date Selezionate:</p>
                      <p className="text-sm">
                        <span className="font-medium">Check-in:</span>{" "}
                        {format(selectedRange.from, "dd MMMM yyyy", { locale: it })}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Check-out:</span>{" "}
                        {format(selectedRange.to, "dd MMMM yyyy", { locale: it })}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="guests">Numero Ospiti *</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max="12"
                      required
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Richieste Speciali</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hai richieste particolari? Scrivile qui..."
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Metodo di Pagamento Preferito</Label>
                    <RadioGroup
                      value={formData.payment_method}
                      onValueChange={(value) =>
                        setFormData({ ...formData, payment_method: value })
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent transition-colors">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label
                          htmlFor="credit_card"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <CreditCard className="w-5 h-5" />
                          <span>Carta di Credito/Debito</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent transition-colors">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label
                          htmlFor="paypal"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <Wallet className="w-5 h-5" />
                          <span>PayPal</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent transition-colors">
                        <RadioGroupItem value="google_pay" id="google_pay" />
                        <Label
                          htmlFor="google_pay"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <Wallet className="w-5 h-5" />
                          <span>Google Pay</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent transition-colors">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label
                          htmlFor="bank_transfer"
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <CreditCard className="w-5 h-5" />
                          <span>Bonifico Bancario</span>
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-sm text-muted-foreground">
                      Il pagamento verrà processato dopo la conferma della disponibilità.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedRange.from || !selectedRange.to}
                    className="w-full gradient-ocean text-lg py-6"
                  >
                    {isSubmitting ? "Invio in corso..." : "Invia Richiesta di Prenotazione"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Campi obbligatori. Riceverai una conferma via email.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
