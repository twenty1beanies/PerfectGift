/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { 
  Gift, 
  Euro, 
  Sparkles, 
  ExternalLink, 
  RefreshCw, 
  Info,
  Heart,
  User,
  ShoppingBag,
  Copy,
  CheckCircle2,
  Globe,
  ChevronDown
} from 'lucide-react';
import { AMAZON_TAG, APP_NAME, ADSENSE_CLIENT_ID } from './constants';
import { translations } from './translations';

const amazonDomains: Record<string, string> = {
  it: 'amazon.it',
  en: 'amazon.com',
  es: 'amazon.es',
  fr: 'amazon.fr',
  de: 'amazon.de'
};

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// --- Types ---
interface GiftIdea {
  name: string;
  reason: string;
  estimatedPrice: number;
}

interface AnalysisResult {
  psychologicalProfile: string;
  ideas: GiftIdea[];
}

// --- Components ---

function AdSenseContainer({ clientID, slotID, className = "" }: { clientID: string; slotID: string; className?: string }) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      // Load script if not present
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }

      // Initialize ad
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`bg-slate-50 rounded-xl overflow-hidden flex flex-col items-center justify-center min-h-[100px] ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientID}
        data-ad-slot={slotID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <span className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Pubblicità</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
        <div className="w-16 h-6 bg-slate-100 rounded-md"></div>
      </div>
      <div className="h-6 bg-slate-100 rounded-md w-3/4 mb-4"></div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-slate-100 rounded-md w-full"></div>
        <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
      </div>
      <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
    </div>
  );
}

function GiftCard({ idea, t, lang }: { idea: GiftIdea; t: any; lang: string; key?: any }) {
  const [copied, setCopied] = useState(false);
  const domain = amazonDomains[lang] || 'amazon.com';
  const amazonUrl = `https://www.${domain}/s?k=${encodeURIComponent(idea.name)}&tag=${AMAZON_TAG}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${idea.name} - ${idea.reason} ${amazonUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <ShoppingBag className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
          ~{idea.estimatedPrice}€
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{idea.name}</h3>
      <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
        {idea.reason}
      </p>
      
      <div className="flex gap-2">
        <a 
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-grow py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
          {t.results.seeOnAmazon}
          <ExternalLink className="w-4 h-4" />
        </a>
        <button 
          onClick={copyToClipboard}
          className="p-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
          title={t.results.copyLink}
        >
          {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
    </motion.div>
  );
}

function SEOContentSection({ t }: { t: any }) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-20 border-t border-slate-100">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">{t.seo.title}</h2>
        <p className="text-slate-600 mb-4 leading-relaxed">
          {t.seo.p1}
        </p>

        <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">{t.seo.h2}</h3>
        <p className="text-slate-600 mb-4 leading-relaxed">
          {t.seo.p2}
        </p>
      </div>
    </section>
  );
}

function HowItWorksPage({ t }: { t: any }) {
  const steps = [
    {
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      icon: <User className="w-6 h-6" />
    },
    {
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      icon: <Euro className="w-6 h-6" />
    },
    {
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      icon: <Info className="w-6 h-6" />
    },
    {
      title: t.howItWorks.step4Title,
      desc: t.howItWorks.step4Desc,
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 mb-8 text-center">{t.howItWorks.title}</h1>
      <p className="text-lg text-slate-600 mb-16 text-center max-w-2xl mx-auto">
        {t.howItWorks.subtitle}
      </p>

      <div className="space-y-12">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-6 items-start">
            <div className="w-12 h-12 shrink-0 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-200">
              {idx + 1}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-emerald-600">{step.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 bg-slate-900 rounded-3xl text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Pronto a trovare il regalo ideale?</h2>
        <p className="text-slate-400 mb-8">Metti alla prova il nostro algoritmo e stupisci chi ami.</p>
        <button 
          onClick={() => {
            window.scrollTo(0, 0);
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20"
        >
          Torna alla Home
        </button>
      </div>
    </motion.div>
  );
}

function LegalView({ type, t }: { type: 'privacy' | 'cookie'; t: any }) {
  const isPrivacy = type === 'privacy';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-20"
    >
      <div className="prose prose-slate max-w-none">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">
          {isPrivacy ? t.legal.privacyTitle : t.legal.cookieTitle}
        </h1>
        
        {isPrivacy ? (
          <div className="text-slate-600 space-y-6 leading-relaxed">
            <p>Benvenuto su <strong>PerfectGift</strong>. La tua privacy è estremamente importante per noi. Questa informativa spiega come gestiamo i tuoi dati.</p>
            
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-8">1. Trattamento dei Dati</h2>
            <p>Quando utilizzi il nostro servizio, inserisci una descrizione del destinatario del regalo. Questi dati vengono inviati in tempo reale alle <strong>Google Gemini API</strong> per l'elaborazione tramite intelligenza artificiale.</p>
            
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-8">2. Conservazione dei Dati</h2>
            <p><strong>Non salviamo né conserviamo</strong> le descrizioni che inserisci o i profili psicologici generati sui nostri server. L'elaborazione avviene "al volo" per fornirti i suggerimenti richiesti e i dati vengono eliminati al termine della sessione.</p>
            
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-8">3. Servizi di Terze Parti</h2>
            <p>Utilizziamo servizi di terze parti per la monetizzazione e l'analisi (Google AdSense e Amazon Associates). Ti invitiamo a consultare la nostra Cookie Policy per maggiori dettagli sui cookie utilizzati da questi partner.</p>
            
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-8">4. Contatti</h2>
            <p>Per qualsiasi domanda riguardante la tua privacy, puoi contattarci all'indirizzo email dedicato presente nel footer del sito.</p>
          </div>
        ) : (
          <div className="text-slate-600 space-y-6 leading-relaxed">
            <p>In questa pagina troverai tutte le informazioni sull'uso dei cookie su <strong>PerfectGift</strong>.</p>
            
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-8">1. Cosa sono i Cookie?</h2>
            <p>I cookie sono piccoli file di testo che i siti visitati dall'utente inviano al suo terminale, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla successiva visita del medesimo utente.</p>
            
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-8">2. Cookie di Terze Parti</h2>
            <p>Il nostro sito utilizza i seguenti cookie di terze parti:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google AdSense:</strong> Utilizzato per pubblicare annunci pubblicitari personalizzati in base ai tuoi interessi e alla tua navigazione.</li>
              <li><strong>Amazon Associates:</strong> Utilizziamo cookie di tracciamento per identificare la provenienza degli utenti che cliccano sui link Amazon, permettendoci di ricevere una commissione sugli acquisti idonei.</li>
            </ul>
            
            <h2 className="text-2xl font-serif font-bold text-slate-900 mt-8">3. Gestione del Consenso</h2>
            <p>Puoi gestire le tue preferenze sui cookie direttamente attraverso le impostazioni del tuo browser o tramite il banner di consenso che appare alla tua prima visita sul nostro sito.</p>
          </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-slate-100">
          <button 
            onClick={() => {
              window.scrollTo(0, 0);
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-emerald-600 font-bold hover:underline"
          >
            ← {t.legal.backToHome}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CookieBanner({ t }: { t: any }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 z-[100]"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-emerald-50 rounded-xl shrink-0">
              <div className="w-6 h-6 text-emerald-600">
                <Info className="w-full h-full" />
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.cookie.banner}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={() => {
                window.scrollTo(0, 0);
                window.history.pushState({}, '', '/static/cookie-policy');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors underline"
            >
              {t.cookie.policy}
            </button>
            <button 
              onClick={acceptCookies}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              {t.cookie.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [view, setView] = useState<'home' | 'how-it-works' | 'privacy' | 'cookie'>('home');
  const [lang, setLang] = useState('it');
  const [t, setT] = useState(translations.it);
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Language Detection & Initialization
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['it', 'en', 'es', 'fr', 'de'];
    const initialLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    setLang(initialLang);
    setT(translations[initialLang]);
  }, []);

  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    setT(translations[newLang]);
    setIsLangMenuOpen(false);
  };

  // Simple routing
  useEffect(() => {
    const handlePath = () => {
      const path = window.location.pathname;
      if (path === '/static/come-funziona') {
        setView('how-it-works');
      } else if (path === '/static/privacy-policy') {
        setView('privacy');
      } else if (path === '/static/cookie-policy') {
        setView('cookie');
      } else {
        setView('home');
      }
    };
    handlePath();
    window.addEventListener('popstate', handlePath);
    return () => window.removeEventListener('popstate', handlePath);
  }, []);

  // SEO & Social & Structured Data
  useEffect(() => {
    const url = window.location.href;
    document.documentElement.lang = lang;
    
    let title = `${APP_NAME} - ${t.hero.title}`;
    if (view === 'how-it-works') title = `Come Funziona - ${APP_NAME}`;
    if (view === 'privacy') title = `Privacy Policy - ${APP_NAME}`;
    if (view === 'cookie') title = `Cookie Policy - ${APP_NAME}`;

    const descriptionText = "Usa l'intelligenza artificiale per trovare il regalo perfetto. Analisi psicologica del destinatario e suggerimenti personalizzati basati su hobby, età e budget.";
    const image = "https://picsum.photos/seed/gift/1200/630"; // Placeholder image for OG

    document.title = title;

    // Standard Meta
    const updateMeta = (name: string, content: string, isProperty = false) => {
      let el = document.querySelector(isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', descriptionText);

    // Robots noindex for legal pages
    if (view === 'privacy' || view === 'cookie') {
      updateMeta('robots', 'noindex');
    } else {
      updateMeta('robots', 'index, follow');
    }
    
    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', descriptionText, true);
    updateMeta('og:url', url, true);
    updateMeta('og:image', image, true);
    updateMeta('og:type', 'website', true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', descriptionText);
    updateMeta('twitter:image', image);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // JSON-LD with SearchAction & FAQ
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": APP_NAME,
        "url": url,
        "description": "Servizio di raccomandazione regali basato su AI",
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": url,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${url}?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Come funziona l'algoritmo di PerfectGift?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Il nostro algoritmo utilizza modelli avanzati di intelligenza artificiale per analizzare la descrizione testuale del destinatario, deducendo tratti della personalità, hobby e preferenze latenti per suggerire prodotti altamente pertinenti."
            }
          },
          {
            "@type": "Question",
            "name": "I link ai prodotti sono sicuri?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sì, tutti i suggerimenti puntano direttamente a Amazon.it, garantendo la massima sicurezza per i tuoi acquisti e la protezione dei dati tipica di Amazon."
            }
          },
          {
            "@type": "Question",
            "name": "Il servizio è gratuito?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Assolutamente sì. PerfectGift è gratuito per gli utenti. Guadagniamo una piccola commissione attraverso il programma di affiliazione Amazon se decidi di acquistare uno dei prodotti suggeriti, senza alcun costo aggiuntivo per te."
            }
          },
          {
            "@type": "Question",
            "name": "Posso rigenerare i suggerimenti se non sono soddisfatto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Certamente! Puoi cliccare sul pulsante 'Mostrami altre 6 idee' per ottenere nuovi suggerimenti basati sulla stessa descrizione, esplorando diverse opzioni."
            }
          }
        ]
      }
    ]);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [view]);

  const findGifts = useCallback(async (isRegenerate = false) => {
    if (!description.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          budget,
          history,
          isRegenerate,
          lang
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate gifts');
      }

      const data = await response.json() as AnalysisResult;
      
      if (isRegenerate && result) {
        setResult({
          ...data,
          ideas: [...result.ideas, ...data.ideas] // Append new ideas
        });
      } else {
        setResult(data);
      }

      setHistory(prev => [...prev, ...data.ideas.map(i => i.name)]);
      
      if (!isRegenerate) {
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }

    } catch (err) {
      console.error(err);
      setError("Ops! Qualcosa è andato storto nella generazione dei regali. Riprova tra un istante.");
    } finally {
      setLoading(false);
    }
  }, [description, budget, history, result]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Gift className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              Perfect<span className="text-emerald-600">Gift</span>
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/static/come-funziona');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t.header.howItWorks}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors uppercase"
              >
                <Globe className="w-4 h-4" />
                {lang}
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50"
                  >
                    {[
                      { code: 'it', label: 'Italiano' },
                      { code: 'en', label: 'English' },
                      { code: 'es', label: 'Español' },
                      { code: 'fr', label: 'Français' },
                      { code: 'de', label: 'Deutsch' }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => changeLanguage(l.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${lang === l.code ? 'text-emerald-600 font-bold' : 'text-slate-600'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {view === 'home' ? (
          <>
            {/* Ad Space Header */}
            <div className="max-w-7xl mx-auto px-4 py-4">
              <AdSenseContainer clientID={ADSENSE_CLIENT_ID} slotID="1234567890" className="h-24" />
            </div>

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-4 py-12 sm:py-20 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight"
              >
                {t.hero.title.split(' ').slice(0, -2).join(' ')} <br />
                <span className="italic text-emerald-600">{t.hero.title.split(' ').slice(-2).join(' ')}</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto"
              >
                {t.hero.subtitle}
              </motion.p>

              {/* Input Area */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 border border-slate-100 text-left"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      {t.hero.inputLabel}
                    </label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t.hero.placeholder}
                      className="w-full h-32 px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-end">
                    <div className="w-full sm:w-1/3">
                      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Euro className="w-4 h-4 text-emerald-600" />
                        {t.hero.budgetLabel}
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-800"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => findGifts(false)}
                      disabled={loading || !description.trim()}
                      className="w-full sm:w-2/3 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-6 h-6 animate-spin" />
                          {t.hero.loading}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          {t.hero.button}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Results Section */}
            <AnimatePresence>
              {(result || loading) && (
                <section id="results-section" className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-100">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-grow">
                      {result && (
                        <div className="mb-12">
                          <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">
                            <Info className="w-4 h-4" />
                            {t.results.profileTitle}
                          </div>
                          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t.results.profileSubtitle}</h2>
                          <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2">
                            "{result.psychologicalProfile}"
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {result?.ideas.map((idea, idx) => (
                          <GiftCard key={`${idx}-${idea.name}`} idea={idea} t={t} lang={lang} />
                        ))}
                        {loading && Array.from({ length: 6 }).map((_, i) => (
                          <SkeletonCard key={`skeleton-${i}`} />
                        ))}
                      </div>

                      {result && !loading && (
                        <>
                          {/* Ad Space Between Results */}
                          <div className="my-12">
                            <AdSenseContainer clientID={ADSENSE_CLIENT_ID} slotID="0987654321" className="h-32" />
                          </div>

                          <div className="mt-12 text-center">
                            <button 
                              onClick={() => findGifts(true)}
                              disabled={loading}
                              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-900 rounded-2xl font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50"
                            >
                              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                              {t.results.regenerate}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Sidebar Ad (Desktop) */}
                    <aside className="hidden lg:block w-80 shrink-0">
                      <div className="sticky top-24">
                        <AdSenseContainer clientID={ADSENSE_CLIENT_ID} slotID="1122334455" className="h-[600px]" />
                        <div className="mt-6 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <Heart className="w-6 h-6 text-emerald-600 mb-4" />
                          <h4 className="font-bold text-emerald-900 mb-2">{t.results.trustTitle}</h4>
                          <p className="text-sm text-emerald-700 leading-relaxed">
                            {t.results.trustDesc}
                          </p>
                        </div>
                      </div>
                    </aside>
                  </div>
                </section>
              )}
            </AnimatePresence>

            {/* SEO Content Section */}
            <SEOContentSection t={t} />
          </>
        ) : view === 'how-it-works' ? (
          <HowItWorksPage t={t} />
        ) : (
          <LegalView type={view as 'privacy' | 'cookie'} t={t} />
        )}

        {error && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-center">
              {error}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Gift className="text-white w-8 h-8" />
                <span className="text-2xl font-bold tracking-tight text-white">
                  Perfect<span className="text-emerald-500">Gift</span>
                </span>
              </div>
              <p className="max-w-sm leading-relaxed">
                {t.footer.mission}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t.footer.quickLinks}</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <button 
                    onClick={() => {
                      window.scrollTo(0, 0);
                      window.history.pushState({}, '', '/static/privacy-policy');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      window.scrollTo(0, 0);
                      window.history.pushState({}, '', '/static/cookie-policy');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">Termini di Servizio</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t.footer.affiliation}</h4>
              <p className="text-sm leading-relaxed">
                {t.footer.affiliationDesc}
              </p>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 text-center text-xs">
            © {new Date().getFullYear()} PerfectGift. {t.footer.rights}
          </div>
        </div>
      </footer>

      <CookieBanner t={t} />
    </div>
  );
}
