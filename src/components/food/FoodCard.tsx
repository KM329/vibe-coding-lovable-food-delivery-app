import React, { useState } from 'react';
import { Plus, Minus, Clock, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FoodItem } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface FoodCardProps {
  foodItem: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentQuantity = getItemQuantity(foodItem.id);

  const handleAddToCart = () => {
    addToCart(foodItem, quantity, specialInstructions);
    setQuantity(1);
    setSpecialInstructions('');
    setIsDialogOpen(false);
  };

  const handleQuickAdd = () => {
    addToCart(foodItem, 1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      // Handle removal through cart context
      return;
    }
    setQuantity(newQuantity);
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${
      !foodItem.isAvailable ? 'opacity-60' : ''
    }`}>
      <div className="relative">
        <img
          src={foodItem.image}
          alt={foodItem.name}
          className="w-full h-48 object-cover rounded-t-lg"
          loading="lazy"
        />
        {!foodItem.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
            <Badge variant="destructive" className="text-sm font-medium">
              Unavailable
            </Badge>
          </div>
        )}
        {foodItem.isVegetarian && (
          <Badge className="absolute top-2 left-2 bg-success text-success-foreground">
            <Leaf className="w-3 h-3 mr-1" aria-hidden="true" />
            Vegetarian
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
            {foodItem.name}
          </CardTitle>
          <span className="text-lg font-bold text-primary ml-2">
            ${foodItem.price.toFixed(2)}
          </span>
        </div>

        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {foodItem.description}
        </CardDescription>

        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" aria-hidden="true" />
          <span>{foodItem.preparationTime} min</span>
        </div>

        <div className="flex items-center justify-between">
          {foodItem.isAvailable ? (
            <>
              {currentQuantity > 0 ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(`${foodItem.id}-${Date.now()}`, currentQuantity - 1)}
                    aria-label={`Decrease quantity of ${foodItem.name}`}
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <span className="font-medium w-8 text-center">{currentQuantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCart(foodItem, 1)}
                    aria-label={`Increase quantity of ${foodItem.name}`}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleQuickAdd}
                  size="sm"
                  className="flex-1 mr-2"
                  aria-label={`Add ${foodItem.name} to cart`}
                >
                  <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                  Add to Cart
                </Button>
              )}

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    aria-label={`Customize ${foodItem.name} order`}
                  >
                    Customize
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{foodItem.name}</DialogTitle>
                    <DialogDescription>
                      Customize your order and add special instructions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="quantity">Quantity:</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center"
                          min="1"
                          aria-label="Quantity"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Any special requests or dietary requirements..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <span className="text-lg font-semibold">
                        Total: ${(foodItem.price * quantity).toFixed(2)}
                      </span>
                      <Button onClick={handleAddToCart}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Button disabled className="flex-1" aria-label={`${foodItem.name} is currently unavailable`}>
              Unavailable
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodCard;