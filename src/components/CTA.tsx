import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';

export default function CTA() {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState<string>('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMsg('Please enter a valid email address.');
      return;
    }

    setStatus('success');
    setMsg('Perfect! You are now subscribed to our seasonal discovery boards.');
    setEmail('');
  };

  return (
    <section className="relative py-28 overflow-hidden rounded-none border border-black/10 bg-[#1A1A1A] mb-12">
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center space-y-8">
        <h2 className="font-serif text-[42px] md:text-[54px] text-[#FAF9F6] leading-[1.1] tracking-tight font-light italic max-w-2xl mx-auto">
          Never miss the perfect gift.
        </h2>
        <p className="text-sm text-[#FAF9F6]/80 max-w-xl mx-auto font-normal leading-relaxed">
          Join 50,000+ thoughtful gift-givers and get our seasonal discovery boards delivered directly to your inbox.
        </p>

        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4">
          <div className="relative flex-grow">
            <input
              className="w-full bg-white/5 border border-white/20 text-[#FAF9F6] placeholder:text-white/40 px-6 py-4 rounded-none focus:border-white outline-none transition-all text-xs pr-12 font-bold tracking-wider uppercase"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
            />
            <Mail className="w-4 h-4 text-white/40 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="bg-[#E2D1C3] text-[#1A1A1A] px-8 py-4 rounded-none font-bold tracking-widest text-[10px] uppercase hover:bg-white transition-all shrink-0 cursor-pointer"
          >
            SUBSCRIBE
          </button>
        </form>

        {status === 'success' && (
          <div className="max-w-md mx-auto bg-white/5 border border-white/20 text-[#FAF9F6] p-3.5 rounded-none text-[10px] uppercase tracking-wider font-bold flex items-center gap-2 justify-center animate-in fade-in duration-300">
            <Check className="w-4 h-4 text-white shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="max-w-md mx-auto bg-red-950/20 border border-red-500/50 text-[#FAF9F6] p-3.5 rounded-none text-[10px] uppercase tracking-wider font-bold flex items-center gap-2 justify-center animate-in fade-in duration-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{msg}</span>
          </div>
        )}
      </div>
    </section>
  );
}
