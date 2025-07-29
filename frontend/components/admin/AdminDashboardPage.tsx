import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FolderKanban, Layers3, Package } from 'lucide-react';
import { api } from '../../lib/api';

interface Stats {
  products: number;
  categories: number;
  subcategories: number;
}

const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await api.get<Stats>('/admin/dashboard/stats');
        setStats(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getStats();
  }, []);

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      {isLoading && <p>Loading dashboard...</p>}
      {error && <p className="text-destructive">Error: {error}</p>}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <StatCard title="Total Products" value={stats.products} icon={Package} />
          <StatCard title="Total Categories" value={stats.categories} icon={FolderKanban} />
          <StatCard title="Total Subcategories" value={stats.subcategories} icon={Layers3} />
        </div>
      )}
    </>
  );
} 