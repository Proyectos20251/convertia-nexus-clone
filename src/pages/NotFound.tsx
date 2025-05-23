
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-convertia-600 mb-4">404</h1>
        <p className="text-xl text-gray-800 mb-6">
          Ups! No pudimos encontrar la página que buscas
        </p>
        <p className="text-gray-600 mb-8">
          La página que intentas visitar no existe o ha sido movida.
        </p>
        <Link to="/dashboard">
          <Button className="bg-convertia-600 hover:bg-convertia-700">
            <Home className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
