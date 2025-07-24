import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';

const OrderSummaryPage: React.FC = () => {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const deliveryFee = totalAmount > 25 ? 0 : 2.99;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `ORD-${Date.now()}`;
      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderId} has been confirmed.`,
      });
      
      navigate('/order-confirmation', { state: { orderId, total: finalTotal } });
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Unable to place order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Order Summary</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <span>{item.foodItem.name} x {item.quantity}</span>
                  <span>${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handlePlaceOrder} className="w-full" size="lg">
            Place Order
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OrderSummaryPage;