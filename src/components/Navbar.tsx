import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-serif font-bold text-primary">
            Villa Mare
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/gallery" className="text-foreground hover:text-primary transition-colors">
              Galleria
            </Link>
            <Link to="/story" className="text-foreground hover:text-primary transition-colors">
              La Nostra Storia
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contatti
            </Link>
            <Link to="/booking">
              <Button variant="default" className="gradient-ocean">
                Prenota Ora
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/gallery"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              Galleria
            </Link>
            <Link
              to="/story"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              La Nostra Storia
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-foreground hover:text-primary transition-colors"
            >
              Contatti
            </Link>
            <Link to="/booking" onClick={() => setIsOpen(false)}>
              <Button variant="default" className="w-full gradient-ocean">
                Prenota Ora
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
