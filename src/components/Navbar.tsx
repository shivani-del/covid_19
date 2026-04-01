import { Link, useLocation } from "react-router-dom";
import { Activity, Upload } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/csv-upload" && location.pathname === "/csv-upload") return true;
    return false;
  };

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">COVID-19 Global Tracker</h1>
              <p className="text-xs text-muted-foreground">Live data from disease.sh</p>
            </div>
          </div>
          
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/csv-upload"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/csv-upload")
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
