import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { orderId, total } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardHeader>
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <CardTitle className="text-2xl text-success">Order Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Your order #{orderId} has been placed successfully.</p>
              <p className="text-lg font-semibold">Total: ${total?.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                You'll receive updates via SMS. Estimated delivery: 30-45 minutes.
              </p>
              <Link to="/menu">
                <Button className="w-full">Order Again</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;