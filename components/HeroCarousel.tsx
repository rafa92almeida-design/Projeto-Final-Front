'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Flame, Sparkles, Tag } from 'lucide-react';

interface HeroCarouselProps {
  onExplore: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onExplore }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'Melhores ofertas de Sneakers',
      title: 'Queima de estoque Nike Air Max',
      subtitle: 'Conforto e estilo para quem vive a cultura urban streetwear. Descontos imperdíveis de até 50% OFF.',
      ctaText: 'Aproveitar Oferta',
      image: '/images/hero_nike_sneakers_banner_1793233640073.jpg',
      highlightTag: 'Até 50% OFF',
    },
    {
      id: 2,
      badge: 'Lançamento Exclusivo',
      title: 'Air Jordan 1 Retro Chicago',
      subtitle: 'O lendário clássico do basquete direto das quadras para o seu guarda-roupa. Estoque extremamente limitado.',
      ctaText: 'Ver Coleção Jordan',
      image: '/images/sneaker_nike_air_jordan_red_1793233641035.jpg',
      highlightTag: 'Lançamento',
    },
    {
      id: 3,
      badge: 'Drop Streetwear 2026',
      title: 'Puma RS-X Cyber Tech Edition',
      subtitle: 'Cores vibrantes, design retro-futurista e amortecimento avançado para destacar seus passos na cidade.',
      ctaText: 'Garanta o Seu',
      image: '/images/sneaker_puma_rsx_colorful_1793233641813.jpg',
      highlightTag: 'Edição Especial',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative bg-[#F5F5F5] rounded-3xl overflow-hidden my-6 border border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-14 lg:px-16 py-12 lg:py-16 min-h-[440px] flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left animate-in fade-in slide-in-from-left duration-300">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFEAEF] text-[#C92071] text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{slide.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1F1F1F] tracking-tight leading-tight font-sans">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>

            {/* CTA & Tag */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExplore}
                className="bg-[#C92071] hover:bg-[#991956] text-white font-extrabold text-sm sm:text-base py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-2xs">
                <Tag className="w-4 h-4 text-[#C92071]" />
                <span>{slide.highlightTag}</span>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-16/10 sm:aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                referrerPolicy="no-referrer"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Flame Overlay Tag */}
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#C92071]" />
                <span>Edição Limitada</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-8 bg-[#C92071]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 items-center justify-center shadow-md transition-all"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-800 items-center justify-center shadow-md transition-all"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
};
