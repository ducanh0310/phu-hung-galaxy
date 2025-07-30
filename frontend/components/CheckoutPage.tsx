import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator.tsx';
import { Loader2 } from 'lucide-react';
import { Order } from '../../shared/types';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore((state) => ({
    items: state.items,
    clearCart: state.clearCart,
  }));

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // For simplicity, we're not collecting a shipping address in this step.
      const order = await api.post<Order>('/orders', {});
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Thanh toán</CardTitle>
          <CardDescription>Xem lại đơn hàng của bạn và tiến hành đặt hàng.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tóm tắt đơn hàng</h3>
            {items.length > 0 ? (
              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
            )}
            <Separator />
            <div className="flex justify-between items-center font-bold text-xl">
              <span>Tổng cộng</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button
            size="lg"
            className="w-full text-lg py-6"
            onClick={handlePlaceOrder}
            disabled={isLoading || items.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Đặt hàng'
            )}
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}