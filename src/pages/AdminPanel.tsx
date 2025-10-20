import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminCalendar from "@/components/admin/AdminCalendar";
import AdminPrices from "@/components/admin/AdminPrices";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminStory from "@/components/admin/AdminStory";
import AdminContacts from "@/components/admin/AdminContacts";
import AdminServices from "@/components/admin/AdminServices";
import AdminSiteContent from "@/components/admin/AdminSiteContent";
import AdminReviews from "@/components/admin/AdminReviews";
import { LogOut } from "lucide-react";

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data } = await supabase
        .from("admin_roles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        setIsLoggedIn(true);
        setIsAdmin(true);
      }
    }
    
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: adminData } = await supabase
          .from("admin_roles")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (!adminData) {
          await supabase.auth.signOut();
          toast.error("Accesso non autorizzato");
          return;
        }

        setIsLoggedIn(true);
        setIsAdmin(true);
        toast.success("Accesso effettuato!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Credenziali non valide");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    toast.success("Logout effettuato");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Caricamento...</p>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen gradient-sand flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-luxury">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center">
              Accesso Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full gradient-ocean">
                Accedi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-sand">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary">
            Pannello di Gestione
          </h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
            <TabsTrigger value="bookings">Prenotazioni</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="prices">Prezzi</TabsTrigger>
            <TabsTrigger value="gallery">Galleria</TabsTrigger>
            <TabsTrigger value="story">Storia</TabsTrigger>
            <TabsTrigger value="reviews">Recensioni</TabsTrigger>
            <TabsTrigger value="contacts">Contatti</TabsTrigger>
            <TabsTrigger value="services">Servizi</TabsTrigger>
            <TabsTrigger value="content">Contenuti</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>

          <TabsContent value="calendar">
            <AdminCalendar />
          </TabsContent>

          <TabsContent value="prices">
            <AdminPrices />
          </TabsContent>

          <TabsContent value="gallery">
            <AdminGallery />
          </TabsContent>

          <TabsContent value="story">
            <AdminStory />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviews />
          </TabsContent>

          <TabsContent value="contacts">
            <AdminContacts />
          </TabsContent>

          <TabsContent value="services">
            <AdminServices />
          </TabsContent>

          <TabsContent value="content">
            <AdminSiteContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
