import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Sparkles, 
  Zap, 
  Target, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2,
  Instagram,
  Video,
  Twitter,
  Facebook
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />
          
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-sm font-medium text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Content Generation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              Platform-Optimized Content <br />
              <span className="text-gradient">in Seconds.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-400 leading-relaxed">
              DixContent AI helps social media creators generate catchy captions, 
              relevant hashtags, and viral post ideas tailored to your niche and platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-primary text-lg font-bold text-white shadow-xl shadow-purple-500/20 hover:opacity-90 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-900 border border-gray-800 text-lg font-bold text-white hover:bg-gray-800 transition-colors"
              >
                View Pricing
              </Link>
            </div>
            
            <div className="pt-12 flex flex-wrap justify-center gap-8 text-gray-500 grayscale opacity-50">
              <div className="flex items-center gap-2"><Instagram className="w-6 h-6" /> <span className="font-semibold text-lg">Instagram</span></div>
              <div className="flex items-center gap-2"><Video className="w-6 h-6" /> <span className="font-semibold text-lg">TikTok</span></div>
              <div className="flex items-center gap-2"><Twitter className="w-6 h-6" /> <span className="font-semibold text-lg">Twitter</span></div>
              <div className="flex items-center gap-2"><Facebook className="w-6 h-6" /> <span className="font-semibold text-lg">Facebook</span></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Focus on Creation, <br />Let AI handle the Writing</h2>
              <p className="text-gray-400 max-w-xl mx-auto">Everything you need to scale your social media presence with consistent, high-quality content.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Platform Optimized',
                  desc: 'Specific prompts for Instagram, TikTok, Twitter, and Facebook to ensure your content fits the platform culture.',
                  icon: Target,
                  color: 'text-purple-500'
                },
                {
                  title: 'Niche Tailored',
                  desc: 'Tell us your niche and target audience, and our AI will adapt the tone and vocabulary to resonate with your followers.',
                  icon: Zap,
                  color: 'text-blue-500'
                },
                {
                  title: 'One-Click Copy',
                  desc: 'Zero friction workflow. Generate content and copy it to your clipboard with a single click.',
                  icon: BarChart3,
                  color: 'text-green-500'
                }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-purple-500/30 transition-colors group">
                  <f.icon className={`w-10 h-10 ${f.color} mb-6`} />
                  <h3 className="text-xl font-bold text-white mb-4">{f.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Simple, Honest Pricing</h2>
              <p className="text-gray-400">Start for free, upgrade when you're ready to scale.</p>
            </div>
            
            <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
              {/* Free Plan */}
              <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 flex flex-col h-full">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-gray-500">/forever</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {['5 free generations', 'Platform-optimized prompts', 'Standard AI model', 'Recent history (24h)'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-400">
                      <CheckCircle2 className="w-5 h-5 text-gray-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/auth/signup"
                  className="w-full py-4 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
              
              {/* Pro Plan */}
              <div className="p-8 rounded-3xl bg-gray-900 border-2 border-purple-500 relative flex flex-col h-full shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  Recommended
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">$9.99</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    'Unlimited generations',
                    'Priority AI (Faster & Smarter)',
                    'Full generation history',
                    'Advanced niches',
                    '24/7 Support'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <CheckCircle2 className="w-5 h-5 text-purple-500" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/auth/signup"
                  className="w-full py-4 rounded-xl bg-gradient-primary text-white font-bold hover:opacity-90 transition-opacity text-center shadow-lg shadow-purple-500/20"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-gray-800 rounded-[40px] p-12 text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                Ready to transform your <br />social media content?
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join thousands of creators who save hours every week with DixContent AI.
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex px-10 py-5 rounded-2xl bg-white text-gray-950 text-xl font-extrabold hover:bg-gray-100 transition-colors shadow-2xl"
              >
                Join Now — It's Free
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 border-t border-gray-900 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-primary p-1 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DixContent AI</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} DixContent AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
