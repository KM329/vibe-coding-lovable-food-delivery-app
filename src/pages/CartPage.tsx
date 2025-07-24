import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';

const CartPage: React.FC = () => {
  const { items, totalAmount, updateQuantity, removeFromCart, totalItems } = useCart();
  const navigate = useNavigate();

  const deliveryFee = totalAmount > 25 ? 0 : 2.99;
  const tax = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + deliveryFee + tax;

  const handleProceedToCheckout = () => {
    navigate('/checkout/address');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-4" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some delicious items from our menu to get started!
            </p>
            <Link to="/menu">
              <Button size="lg">Browse Menu</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Cart</h1>
          <p className="text-muted-foreground">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {item.foodItem.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.foodItem.description}
                          </p>
                          {item.foodItem.isVegetarian && (
                            <Badge className="mt-2 bg-success text-success-foreground text-xs">
                              Vegetarian
                            </Badge>
                          )}
                        </div>
                        <span className="font-semibold text-primary ml-4">
                          ${item.foodItem.price.toFixed(2)}
                        </span>
                      </div>

                      {item.specialInstructions && (
                        <div className="mt-3 p-2 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Special instructions:</strong> {item.specialInstructions}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.foodItem.name}`}
                          >
                            <Minus className="w-4 h-4" aria-hidden="true" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.foodItem.name}`}
                          >
                            <Plus className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="font-semibold">
                            ${(item.foodItem.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            aria-label={`Remove ${item.foodItem.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-success' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-success">Free delivery on orders over $25!</p>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>

                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
                  <Textarea
                    id="orderNotes"
                    placeholder="Any special instructions for your entire order..."
                    rows={3}
                  />
                </div>

                <div className="text-center">
                  <Link to="/menu">
                    <Button variant="ghost" size="sm">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accessibility announcement for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Cart contains {totalItems} items with total of ${finalTotal.toFixed(2)}
        </div>
      </main>
    </div>
  );
};

export default CartPage;