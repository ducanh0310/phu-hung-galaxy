import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Home, Package2, LogOut, Package, FolderKanban } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/admin/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground ${
      isActive ? 'bg-muted text-foreground' : ''
    }`;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <NavLink to="/admin/dashboard" className={navLinkClasses}>
                <Home className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink to="/admin/products" className={navLinkClasses}>
                <Package className="h-4 w-4" />
                Products
              </NavLink>
              <NavLink to="/admin/categories" className={navLinkClasses}>
                <FolderKanban className="h-4 w-4" />
                Categories
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Can add search bar here in the future */}
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;