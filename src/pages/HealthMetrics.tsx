import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp, Smile, Meh, Frown } from 'lucide-react';

type MetricType = 'weight' | 'blood_pressure' | 'heart_rate' | 'sleep_duration' | 'steps' | 'mood';

export default function HealthMetrics() {
  const { user } = useAuth();
  const [metricType, setMetricType] = useState<MetricType>('weight');
  const [value, setValue] = useState('');
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user]);

  const loadMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(30);

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Failed to load health metrics');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const metricValue = metricType === 'mood' ? selectedMood : value;
      const numericValue = metricType !== 'mood' ? parseFloat(value) : null;

      const { error } = await supabase
        .from('health_metrics')
        .insert({
          user_id: user?.id,
          metric_type: metricType,
          value: metricValue,
          value_numeric: numericValue,
          timestamp: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Health metric logged successfully!');
      setValue('');
      setSelectedMood('');
      loadMetrics();
    } catch (error) {
      console.error('Error logging metric:', error);
      toast.error('Failed to log health metric');
    } finally {
      setIsLoading(false);
    }
  };

  const getChartData = () => {
    const filteredMetrics = metrics
      .filter(m => m.metric_type === metricType && m.value_numeric !== null)
      .slice(0, 7)
      .reverse();

    return filteredMetrics.map(m => ({
      date: new Date(m.timestamp).toLocaleDateString(),
      value: m.value_numeric,
    }));
  };

  const moodEmojis = [
    { value: 'happy', icon: Smile, label: '😊 Happy' },
    { value: 'neutral', icon: Meh, label: '😐 Neutral' },
    { value: 'sad', icon: Frown, label: '😞 Sad' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          Health Metrics
        </h1>
        <p className="text-muted-foreground">Track and monitor your daily health data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-health">
          <CardHeader>
            <CardTitle>Log New Metric</CardTitle>
            <CardDescription>Record your health data for today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metric-type">Metric Type</Label>
                <Select value={metricType} onValueChange={(v) => setMetricType(v as MetricType)}>
                  <SelectTrigger id="metric-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight (kg)</SelectItem>
                    <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                    <SelectItem value="heart_rate">Heart Rate (bpm)</SelectItem>
                    <SelectItem value="sleep_duration">Sleep Duration (hours)</SelectItem>
                    <SelectItem value="steps">Steps</SelectItem>
                    <SelectItem value="mood">Mood</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {metricType === 'mood' ? (
                <div className="space-y-2">
                  <Label>Select Mood</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {moodEmojis.map((mood) => (
                      <Button
                        key={mood.value}
                        type="button"
                        variant={selectedMood === mood.value ? 'default' : 'outline'}
                        className="h-20"
                        onClick={() => setSelectedMood(mood.value)}
                      >
                        <span className="text-2xl">{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="text"
                    placeholder={
                      metricType === 'blood_pressure'
                        ? '120/80'
                        : 'Enter value'
                    }
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || (metricType === 'mood' && !selectedMood)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Log Metric
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="card-health">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Your latest health metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {metrics.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No metrics logged yet. Start tracking your health today!
                </p>
              ) : (
                metrics.slice(0, 10).map((metric) => (
                  <div key={metric.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{metric.metric_type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(metric.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-semibold">{metric.value}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {metricType !== 'mood' && getChartData().length > 0 && (
        <Card className="card-health">
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>Your {metricType.replace('_', ' ')} over the last 7 entries</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}