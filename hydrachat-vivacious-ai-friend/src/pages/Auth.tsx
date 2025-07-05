import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, MessageSquare, Mic, Volume2, Zap, Shield, Users, ArrowRight, Bot, Sparkles } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Success",
            description: "Account created successfully! Please check your email to verify your account."
          });
        } else {
          window.location.href = '/chat';
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Bot className="h-6 w-6 text-purple-400" />,
      title: "DeepSeek R1 AI",
      description: "Powered by the latest AI model"
    },
    {
      icon: <Mic className="h-6 w-6 text-blue-400" />,
      title: "Voice Chat",
      description: "Speak naturally with AI"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-green-400" />,
      title: "Smart Conversations",
      description: "Context-aware responses"
    }
  ];

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-3">
                <img src="/lovable-uploads/04ced030-b3f9-4207-b3b1-1860abafc7f0.png" alt="HydraChat Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              HYDRACHAT
            </CardTitle>
            <CardDescription className="text-lg">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </button>
              <button
                onClick={() => setShowAuth(false)}
                className="block w-full text-gray-500 hover:text-gray-700 text-sm"
              >
                ← Back to landing page
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl p-4">
              <img src="/lovable-uploads/04ced030-b3f9-4207-b3b1-1860abafc7f0.png" alt="HydraChat Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6">
            HYDRACHAT
          </h1>
          <p className="text-xl text-purple-200 mb-4 max-w-3xl mx-auto">
            Your intelligent AI companion powered by DeepSeek R1. Experience natural conversations with advanced voice integration and seamless chat management.
          </p>
          <p className="text-lg text-blue-200 mb-12">
            The future of AI conversation is here - fast, secure, and incredibly smart.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => setShowAuth(true)}
            >
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/80 text-white bg-white/10 hover:bg-white/20 hover:border-white px-8 py-4 text-lg backdrop-blur-sm"
              onClick={() => setShowAuth(true)}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-yellow-400" />
                <CardTitle className="text-2xl">Advanced AI Capabilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-purple-400 mt-1" />
                <div>
                  <p className="font-semibold">Natural Conversations</p>
                  <p className="text-gray-300 text-sm">Context-aware responses that understand your needs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-400 mt-1" />
                <div>
                  <p className="font-semibold">Lightning Fast</p>
                  <p className="text-gray-300 text-sm">Real-time responses with optimized performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-400 mt-1" />
                <div>
                  <p className="font-semibold">Secure & Private</p>
                  <p className="text-gray-300 text-sm">Your conversations are encrypted and protected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="h-8 w-8 text-blue-400" />
                <CardTitle className="text-2xl">Voice & Chat Features</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mic className="h-5 w-5 text-red-400 mt-1" />
                <div>
                  <p className="font-semibold">Speech-to-Text</p>
                  <p className="text-gray-300 text-sm">Speak naturally and get accurate transcription</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Volume2 className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="font-semibold">Text-to-Speech</p>
                  <p className="text-gray-300 text-sm">Toggle voice responses on/off as needed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-purple-400 mt-1" />
                <div>
                  <p className="font-semibold">Chat Management</p>
                  <p className="text-gray-300 text-sm">Organize and manage multiple conversations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience the Future?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already having amazing conversations with HydraChat. 
            Sign up now and start chatting with the most advanced AI available.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => setShowAuth(true)}
          >
            Start Chatting Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 p-1">
                <img src="/lovable-uploads/04ced030-b3f9-4207-b3b1-1860abafc7f0.png" alt="HydraChat Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white">
                HYDRACHAT
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 HydraChat. Powered by DeepSeek R1 AI Technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Auth;