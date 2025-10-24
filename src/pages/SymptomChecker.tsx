import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Stethoscope, Send, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SymptomChecker() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ query: string; response: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const { data, error } = await supabase.functions.invoke('symptom-checker', {
        body: { symptoms },
      });

      if (error) {
        if (error.message.includes('429') || error.message.includes('Rate limit')) {
          toast.error('Too many requests. Please try again in a moment.');
        } else if (error.message.includes('402')) {
          toast.error('Service temporarily unavailable. Please try again later.');
        } else {
          throw error;
        }
        return;
      }

      const aiResponse = data.response;
      setResponse(aiResponse);

      // Save to database
      await supabase.from('symptom_queries').insert({
        user_id: user?.id,
        query_text: symptoms,
        ai_response: aiResponse,
      });

      // Add to history
      setHistory([{ query: symptoms, response: aiResponse }, ...history]);
      setSymptoms('');
    } catch (error) {
      console.error('Error checking symptoms:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Stethoscope className="h-8 w-8 text-primary" />
          AI Symptom Checker
        </h1>
        <p className="text-muted-foreground">Get AI-powered guidance for your symptoms</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This tool provides general health information only and is not a substitute for professional medical advice,
          diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
        </AlertDescription>
      </Alert>

      <Card className="card-health">
        <CardHeader>
          <CardTitle>Describe Your Symptoms</CardTitle>
          <CardDescription>
            Be as specific as possible about what you're experiencing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="e.g., I have a headache and mild fever for the past two days..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              disabled={isLoading}
              rows={5}
              className="resize-none"
            />
            <Button type="submit" className="w-full" disabled={isLoading || !symptoms.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing symptoms...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {response && (
        <Card className="card-health border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">AI Response</CardTitle>
            <CardDescription>Based on your symptoms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{response}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="card-health">
          <CardHeader>
            <CardTitle>Previous Queries</CardTitle>
            <CardDescription>Your recent symptom checks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.slice(0, 3).map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div>
                    <p className="font-semibold text-sm text-primary">Your symptoms:</p>
                    <p className="text-sm">{item.query}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-secondary">AI guidance:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.response}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="card-health gradient-secondary border-none">
        <CardHeader>
          <CardTitle className="text-white">When to Seek Immediate Care</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-white/90 space-y-2 list-disc list-inside">
            <li>Severe chest pain or difficulty breathing</li>
            <li>Sudden severe headache or vision changes</li>
            <li>Signs of stroke (FAST: Face, Arms, Speech, Time)</li>
            <li>Severe allergic reaction or anaphylaxis</li>
            <li>Uncontrolled bleeding or severe injury</li>
            <li>High fever with confusion or severe pain</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}