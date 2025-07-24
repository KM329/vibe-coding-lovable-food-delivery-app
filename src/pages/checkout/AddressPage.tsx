import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DeliveryAddress } from '@/types';
import Header from '@/components/layout/Header';

const addressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  landmark: z.string().optional(),
  phoneNumber: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
});

type AddressFormData = z.infer<typeof addressSchema>;

const AddressPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  // Load saved address if available
  React.useEffect(() => {
    const savedAddress = localStorage.getItem('deliveryAddress');
    if (savedAddress) {
      try {
        const address: DeliveryAddress = JSON.parse(savedAddress);
        setValue('street', address.street);
        setValue('city', address.city);
        setValue('state', address.state);
        setValue('zipCode', address.zipCode);
        setValue('landmark', address.landmark || '');
        setValue('phoneNumber', address.phoneNumber);
      } catch (error) {
        console.error('Error loading saved address:', error);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: AddressFormData) => {
    try {
      // Simulate address validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const deliveryAddress: DeliveryAddress = {
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        landmark: data.landmark,
        phoneNumber: data.phoneNumber,
        isDefault: true,
      };

      // Save address to localStorage
      localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress));

      toast({
        title: "Address Validated",
        description: "Your delivery address has been confirmed.",
      });

      navigate('/checkout/summary');
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Unable to validate address. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location Detected",
            description: "Please fill in the detailed address information.",
          });
          // In a real app, you would use reverse geocoding here
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  1
                </div>
                <span className="font-medium">Address</span>
              </div>
              <div className="w-12 h-0.5 bg-border"></div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  2
                </div>
                <span>Summary</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                <span>Delivery Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseCurrentLocation}
                  >
                    <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                    Use Current Location
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="123 Main Street, Apt 4B"
                    {...register('street')}
                    aria-invalid={errors.street ? 'true' : 'false'}
                    aria-describedby={errors.street ? 'street-error' : undefined}
                  />
                  {errors.street && (
                    <p id="street-error" className="text-sm text-destructive" role="alert">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      {...register('city')}
                      aria-invalid={errors.city ? 'true' : 'false'}
                      aria-describedby={errors.city ? 'city-error' : undefined}
                    />
                    {errors.city && (
                      <p id="city-error" className="text-sm text-destructive" role="alert">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      {...register('state')}
                      aria-invalid={errors.state ? 'true' : 'false'}
                      aria-describedby={errors.state ? 'state-error' : undefined}
                    />
                    {errors.state && (
                      <p id="state-error" className="text-sm text-destructive" role="alert">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="12345"
                    {...register('zipCode')}
                    aria-invalid={errors.zipCode ? 'true' : 'false'}
                    aria-describedby={errors.zipCode ? 'zipcode-error' : undefined}
                  />
                  {errors.zipCode && (
                    <p id="zipcode-error" className="text-sm text-destructive" role="alert">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark (Optional)</Label>
                  <Input
                    id="landmark"
                    placeholder="Near Central Park, opposite Starbucks"
                    {...register('landmark')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register('phoneNumber')}
                    aria-invalid={errors.phoneNumber ? 'true' : 'false'}
                    aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
                  />
                  {errors.phoneNumber && (
                    <p id="phone-error" className="text-sm text-destructive" role="alert">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/cart')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                    Back to Cart
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-32"
                  >
                    {isSubmitting ? (
                      "Validating..."
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddressPage;