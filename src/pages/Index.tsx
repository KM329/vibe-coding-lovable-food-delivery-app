import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-primary-foreground">
          <h1 className="text-6xl font-bold mb-6">🍕 Yellow Bite</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Delicious food delivered fresh to your door. Fast, reliable, and always hot!
          </p>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Link to="/menu">
                <Button size="lg" className="bg-card text-card-foreground hover:bg-card/90">
                  Browse Menu
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-card text-card-foreground hover:bg-card/90">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-card text-card bg-transparent hover:bg-card/10">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
