import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Order } from '../../shared/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusMap: Record<Order['status'], { text: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  PENDING: { text: 'Đang chờ xử lý', variant: 'secondary' },
  PROCESSING: { text: 'Đang xử lý', variant: 'default' },
  SHIPPED: { text: 'Đã giao hàng', variant: 'default' },
  DELIVERED: { text: 'Đã nhận hàng', variant: 'default' },
  CANCELLED: { text: 'Đã hủy', variant: 'destructive' },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.get<Order>(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-destructive text-center">{error}</p>;
  }

  if (!order) {
    return <p className="text-muted-foreground text-center">Không tìm thấy đơn hàng.</p>;
  }

  const { text: statusText, variant: statusVariant } = statusMap[order.status] || statusMap.PENDING;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Chi tiết đơn hàng</CardTitle>
              <CardDescription>Mã đơn hàng: {order.id}</CardDescription>
            </div>
            <Badge variant={statusVariant} className="capitalize">
              {statusText}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground pt-2">Đặt lúc: {formatDate(order.createdAt)}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold">Các sản phẩm</h3>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-4">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 rounded-md object-cover" />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between items-center font-bold text-xl">
              <span>Tổng cộng</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link to="/orders">← Quay lại lịch sử đơn hàng</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}