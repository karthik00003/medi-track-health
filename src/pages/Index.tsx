import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Activity, Pill, Stethoscope, Calendar } from 'lucide-react';
import homeIllustration from '@/assets/home-illustration.svg';

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
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              HealthNova
            </h1>
            <p className="text-2xl md:text-3xl text-primary font-semibold">
              Your Smart Health Companion
            </p>
            <p className="text-lg text-muted-foreground">
              Track your health metrics, consult with verified doctors, manage medications, 
              and get AI-powered health guidance—all in one modern, intuitive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl gradient-primary hover:opacity-90 transition-all hover:scale-105"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl hover:scale-105 transition-all"
              >
                Sign In
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <img 
              src={homeIllustration} 
              alt="Health tracking illustration" 
              className="w-full h-auto float-animation"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Everything You Need for Better Health
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Activity,
                title: "Health Tracking",
                description: "Monitor vitals, activity, and wellness metrics with beautiful visualizations and insights.",
                delay: 0
              },
              {
                icon: Calendar,
                title: "Doctor Consultations",
                description: "Book appointments with verified healthcare professionals for video, audio, or in-person visits.",
                delay: 0.1
              },
              {
                icon: Pill,
                title: "Medication Management",
                description: "Never miss a dose with smart reminders, adherence tracking, and detailed medication logs.",
                delay: 0.2
              },
              {
                icon: Stethoscope,
                title: "AI Health Assistant",
                description: "Get instant symptom analysis and personalized health guidance powered by advanced AI.",
                delay: 0.3
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-card shadow-md hover:shadow-lg transition-all"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Start Your Health Journey Today
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of users who trust HealthNova to manage their health and wellness.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 rounded-2xl gradient-primary hover:opacity-90 transition-all hover:scale-105"
          >
            Create Free Account
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-muted/20">
        <div className="container max-w-6xl mx-auto text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 HealthNova. Your Smart Health Companion.
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
