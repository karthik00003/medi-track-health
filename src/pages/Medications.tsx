import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Pill, Plus, Check, X, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import medicationReminderImage from '@/assets/medication-reminder.svg';

export default function Medications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [adherenceStats, setAdherenceStats] = useState({ total: 0, taken: 0, missed: 0 });

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  useEffect(() => {
    if (user) {
      loadMedications();
      loadAdherenceStats();
    }
  }, [user]);

  const loadMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error loading medications:', error);
      toast.error('Failed to load medications');
    }
  };

  const loadAdherenceStats = async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('adherence_logs')
        .select('status')
        .eq('user_id', user?.id)
        .gte('scheduled_time', sevenDaysAgo.toISOString());

      if (error) throw error;

      const taken = data?.filter(log => log.status === 'taken').length || 0;
      const missed = data?.filter(log => log.status === 'missed').length || 0;

      setAdherenceStats({
        total: taken + missed,
        taken,
        missed,
      });
    } catch (error) {
      console.error('Error loading adherence stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('medications')
        .insert({
          user_id: user?.id,
          ...formData,
          end_date: formData.end_date || null,
        });

      if (error) throw error;

      toast.success('Medication added successfully!');
      setIsOpen(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
      });
      loadMedications();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication');
    } finally {
      setIsLoading(false);
    }
  };

  const logAdherence = async (medicationId: string, status: 'taken' | 'missed') => {
    try {
      const { error } = await supabase
        .from('adherence_logs')
        .insert({
          user_id: user?.id,
          medication_id: medicationId,
          status,
          scheduled_time: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(status === 'taken' ? 'Marked as taken!' : 'Marked as missed');
      loadAdherenceStats();
    } catch (error) {
      console.error('Error logging adherence:', error);
      toast.error('Failed to log adherence');
    }
  };

  const adherenceRate = adherenceStats.total > 0
    ? Math.round((adherenceStats.taken / adherenceStats.total) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Pill className="h-8 w-8 text-secondary" />
              Medications
            </h1>
            <p className="text-muted-foreground">Manage your medication schedule</p>
          </div>
          <motion.img 
            src={medicationReminderImage} 
            alt="Medication Reminder" 
            className="hidden md:block w-24 h-auto float-animation"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl hover:scale-105 transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>Enter the details of your medication</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Aspirin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  required
                  placeholder="e.g., 100mg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  required
                  placeholder="e.g., Twice daily"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full rounded-xl hover:scale-105 transition-all" disabled={isLoading}>
                Add Medication
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
      </div>

      <Card className="card-health">
        <CardHeader>
          <CardTitle>Adherence Summary</CardTitle>
          <CardDescription>Your medication adherence over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Adherence Rate</span>
              <span className="font-bold">{adherenceRate}%</span>
            </div>
            <Progress value={adherenceRate} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{adherenceStats.total}</p>
              <p className="text-xs text-muted-foreground">Total Doses</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{adherenceStats.taken}</p>
              <p className="text-xs text-muted-foreground">Taken</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{adherenceStats.missed}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </div>
          </div>
          {adherenceRate >= 85 && (
            <p className="text-sm text-accent text-center p-3 bg-accent/10 rounded-lg">
              🎉 Great consistency! You took {adherenceRate}% of your doses this week.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {medications.length === 0 ? (
          <Card className="card-health md:col-span-2">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No medications added yet. Click "Add Medication" to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          medications.map((med) => (
            <Card key={med.id} className="card-health">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-secondary" />
                  {med.name}
                </CardTitle>
                <CardDescription>
                  {med.dosage} • {med.frequency}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Started: {new Date(med.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  {med.end_date && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Ends: {new Date(med.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => logAdherence(med.id, 'taken')}
                    className="flex-1"
                    size="sm"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Taken
                  </Button>
                  <Button
                    onClick={() => logAdherence(med.id, 'missed')}
                    variant="destructive"
                    className="flex-1"
                    size="sm"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Missed
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}