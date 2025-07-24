import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg" role="banner">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            aria-label="Yellow Bite Delivery - Home"
          >
            🍕 Yellow Bite
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/cart">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
                  Cart
                  {totalItems > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center"
                      aria-label={`${totalItems} items in cart`}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    aria-label="User menu"
                  >
                    <User className="h-4 w-4 mr-2" aria-hidden="true" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;