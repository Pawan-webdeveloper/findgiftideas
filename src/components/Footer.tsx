import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#FAF9F6] border-t border-black/10 py-16 mt-16">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-4">
          <span className="font-serif text-3xl font-light italic text-[#1A1A1A]">
            whattogift
          </span>
          <p className="text-[#1A1A1A]/60 text-[13px] font-normal leading-relaxed">
            A digital space for analog sentiment. <br />
            © 2026 whattogift. All rights reserved.
          </p>
        </div>

        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.3em]">
              Platform
            </h4>
            <nav className="flex flex-col gap-2.5">
              <a href="#" className="text-[13px] text-[#1A1A1A] hover:underline hover:text-black/50 transition-all">
                How it works
              </a>
              <a href="#" className="text-[13px] text-[#1A1A1A] hover:underline hover:text-black/50 transition-all">
                Gift Ideas
              </a>
              <a href="#" className="text-[13px] text-[#1A1A1A] hover:underline hover:text-black/50 transition-all">
                Quiz
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.3em]">
              Company
            </h4>
            <nav className="flex flex-col gap-2.5">
              <a href="#" className="text-[13px] text-[#1A1A1A] hover:underline hover:text-black/50 transition-all">
                About Us
              </a>
              <a href="#" className="text-[13px] text-[#1A1A1A] hover:underline hover:text-black/50 transition-all">
                Contact
              </a>
              <a href="#" className="text-[13px] text-[#1A1A1A] hover:underline hover:text-black/50 transition-all">
                Privacy Policy
              </a>
            </nav>
          </div>

          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h4 className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-[0.3em]">
              Hand-Pressed
            </h4>
            <p className="text-xs text-[#1A1A1A]/60 leading-relaxed">
              Every scrapbook board is manually curated with a strict anti-slop ethic. Crafting premium recommendations since 2026.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
