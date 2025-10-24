import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Pill, Stethoscope, TrendingUp, Shield, BarChart3 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Activity className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            MediTrack
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Your personal health companion for tracking metrics, managing medications, and getting AI-powered symptom guidance
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-primary hover:bg-white/90">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="border-white text-white hover:bg-white/10">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track, analyze, and improve your health with powerful tools designed for consistency and clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-health">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Health Metrics Tracking</CardTitle>
                <CardDescription>
                  Log and visualize your vital signs, weight, sleep, steps, and mood with interactive charts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Visual trend analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Weekly & monthly views
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Secure & private
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-health">
              <CardHeader>
                <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-4">
                  <Pill className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Medication Management</CardTitle>
                <CardDescription>
                  Never miss a dose with smart reminders and adherence tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-secondary" />
                    Adherence monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-secondary" />
                    Performance insights
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-secondary" />
                    Weekly reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-health">
              <CardHeader>
                <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                  <Stethoscope className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>AI Symptom Guidance</CardTitle>
                <CardDescription>
                  Get instant AI-powered insights about your symptoms and when to seek care
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-accent" />
                    Evidence-based guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Self-care tips
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    Query history
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-secondary py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Health Journey Today
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of users taking control of their health with MediTrack
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-primary hover:bg-white/90">
            <Activity className="mr-2 h-5 w-5" />
            Get Started - It's Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-background">
        <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 MediTrack. Your personal health companion.
          </p>
          <p className="text-xs mt-2">
            This app provides general health information only and is not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
