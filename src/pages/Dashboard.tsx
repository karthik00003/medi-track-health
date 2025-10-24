import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Pill, TrendingUp, Calendar, Droplet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    metricsCount: 0,
    medicationsCount: 0,
    adherenceRate: 0,
    lastMetric: null as any,
  });

  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      // Get metrics count
      const { count: metricsCount } = await supabase
        .from('health_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Get active medications count
      const { count: medicationsCount } = await supabase
        .from('medications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .eq('is_active', true);

      // Get last health metric
      const { data: lastMetric } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      // Calculate adherence rate (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: adherenceLogs } = await supabase
        .from('adherence_logs')
        .select('status')
        .eq('user_id', user?.id)
        .gte('scheduled_time', sevenDaysAgo.toISOString());

      let adherenceRate = 0;
      if (adherenceLogs && adherenceLogs.length > 0) {
        const takenCount = adherenceLogs.filter(log => log.status === 'taken').length;
        adherenceRate = Math.round((takenCount / adherenceLogs.length) * 100);
      }

      setStats({
        metricsCount: metricsCount || 0,
        medicationsCount: medicationsCount || 0,
        adherenceRate,
        lastMetric,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Here's your health overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-health">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Metrics</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.metricsCount}</div>
            <p className="text-xs text-muted-foreground">Total entries logged</p>
          </CardContent>
        </Card>

        <Card className="card-health">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.medicationsCount}</div>
            <p className="text-xs text-muted-foreground">Currently tracking</p>
          </CardContent>
        </Card>

        <Card className="card-health">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.adherenceRate}%</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="card-health">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Check-in</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lastMetric ? new Date(stats.lastMetric.timestamp).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.lastMetric ? stats.lastMetric.metric_type : 'No data yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-health">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Track Your Health
            </CardTitle>
            <CardDescription>
              Log your daily health metrics and monitor your progress over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/metrics')} className="w-full">
              <Droplet className="mr-2 h-4 w-4" />
              Log Health Metrics
            </Button>
          </CardContent>
        </Card>

        <Card className="card-health">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-secondary" />
              Manage Medications
            </CardTitle>
            <CardDescription>
              Track your medications and maintain consistent adherence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/medications')} variant="secondary" className="w-full">
              <Pill className="mr-2 h-4 w-4" />
              View Medications
            </Button>
          </CardContent>
        </Card>
      </div>

      {stats.adherenceRate > 0 && (
        <Card className="card-health gradient-card border-none">
          <CardHeader>
            <CardTitle className="text-white">🎉 Great Job!</CardTitle>
            <CardDescription className="text-white/80">
              You've maintained {stats.adherenceRate}% medication adherence this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/90">
              Keep up the excellent work! Consistency is key to successful treatment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}