import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { MessageSquare, Mic, Volume2, Zap, Shield, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  const features = [
    {
      icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
      title: "Intelligent Conversations",
      description: "Powered by DeepSeek R1, one of the most advanced AI models available today"
    },
    {
      icon: <Mic className="h-8 w-8 text-blue-600" />,
      title: "Voice Integration",
      description: "Speak naturally and get voice responses - seamless speech-to-text and text-to-speech"
    },
    {
      icon: <Volume2 className="h-8 w-8 text-green-600" />,
      title: "Smart Audio Controls",
      description: "Toggle voice responses on/off with intelligent audio management"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Lightning Fast",
      description: "Real-time responses with optimized performance and minimal latency"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Secure & Private",
      description: "Your conversations are encrypted and stored securely with user authentication"
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Multi-Chat Support",
      description: "Organize conversations into separate chats and access your chat history"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-4">
              <img src="/lovable-uploads/04ced030-b3f9-4207-b3b1-1860abafc7f0.png" alt="HydraChat Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            HYDRACHAT
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Your intelligent AI companion powered by DeepSeek R1. Experience natural conversations with advanced voice integration and seamless chat management.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            The future of AI conversation is here - fast, secure, and incredibly smart.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = '/auth'}
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Experience the Future?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already having amazing conversations with HydraChat. 
            Sign up now and start chatting with the most advanced AI available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
              onClick={() => window.location.href = '/auth'}
            >
              Start Chatting Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3"
              onClick={() => window.location.href = '/auth'}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 p-1">
                <img src="/lovable-uploads/04ced030-b3f9-4207-b3b1-1860abafc7f0.png" alt="HydraChat Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                HYDRACHAT
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 HydraChat. Powered by DeepSeek R1 AI Technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;