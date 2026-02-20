import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Play,
  Loader2,
  Video,
  Maximize2,
  Download,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Info,
  Type,
  ChevronRight,
  RefreshCw,
  // Added ArrowRight to imports to fix the error on line 238
  ArrowRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const LOADING_MESSAGES = [
  "Initializing neural engines...",
  "Analyzing visual semantics...",
  "Synthesizing motion vectors...",
  "Rendering cinematic sequences...",
  "Optimizing frame transitions...",
  "Polishing digital textures...",
  "Finalizing creative output...",
  "Almost there, quality takes precision..."
];

const VeoVideoGenerator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      interval = window.setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 8000);
    }
    return () => window.clearInterval(interval);
  }, [isGenerating]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      // 1. Mandatory API Key check for Veo
      // @ts-ignore - window.aistudio is injected
      if ('aistudio' in window && window.aistudio) {
        // @ts-ignore
        if (!(await window.aistudio.hasSelectedApiKey())) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      }

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });
      const base64Data = image.split(',')[1];

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Animate this scene with cinematic motion',
        image: {
          imageBytes: base64Data,
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      // Polling for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        try {
          operation = await ai.operations.getVideosOperation({ operation: operation });
        } catch (pollError: any) {
          if (pollError.message?.includes("Requested entity was not found")) {
            // @ts-ignore
            if ('aistudio' in window && window.aistudio) {
              // @ts-ignore
              await window.aistudio.openSelectKey();
            }
            throw new Error("API Key session expired. Please select a paid key again.");
          }
          throw pollError;
        }
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const response = await fetch(`${downloadLink}&key=${apiKey}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      } else {
        throw new Error("Generation failed to produce a valid video link.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate video. Ensure you have a paid API key selected.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="veo-lab" className="py-32 relative bg-white dark:bg-brand-obsidian overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.05),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            {/* Control Panel */}
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-brand-primary" />
                  <span className="text-brand-primary font-mono font-bold tracking-[0.4em] uppercase text-xs">04 // CREATIVE LAB</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-display font-bold text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.85]">
                  VEO <span className="text-brand-primary">MOTION.</span>
                </h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-light max-w-lg italic">
                  Transform static assets into cinematic masterpieces. Upload your vision and let Veo synthesize the rest.
                </p>
              </div>

              <div className="glass rounded-[3rem] p-8 md:p-12 border border-slate-200 dark:border-white/10 shadow-2xl space-y-10">
                {/* Image Upload Area */}
                <div className="space-y-4">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Source Material</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${image ? 'border-brand-primary/40 bg-brand-primary/5' : 'border-slate-200 dark:border-white/10 hover:border-brand-primary/40 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                  >
                    {image ? (
                      <div className="relative w-full h-full p-2">
                        <img src={image} className="w-full h-full object-cover rounded-[1.5rem]" alt="Upload preview" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 rounded-[1.5rem] transition-opacity">
                          <RefreshCw className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase">Drop your image here</p>
                        <p className="text-[10px] text-slate-400 uppercase mt-2">PNG or JPEG supported</p>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* Prompt & Config */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Type className="w-3.5 h-3.5" /> Mission Briefing
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the desired motion sequence..."
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-slate-900 dark:text-white focus:outline-none focus:border-brand-primary transition-all text-sm resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Projection Ratio</label>
                      <div className="flex gap-4">
                        {['16:9', '9:16'].map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio as any)}
                            className={`flex-1 py-4 rounded-xl border font-bold text-[10px] transition-all ${aspectRatio === ratio
                              ? 'border-brand-primary bg-brand-primary text-white shadow-lg'
                              : 'border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                              }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={!image || isGenerating}
                    className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 uppercase tracking-[0.4em] text-[10px] disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        SYNTHESIZING...
                      </>
                    ) : (
                      <>
                        Initialize Generation
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[8px] font-mono text-slate-400 uppercase text-center mt-6 flex items-center justify-center gap-2">
                    <Info className="w-3 h-3" /> Requires a paid API key via <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-brand-primary underline">Google Billing</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:w-1/2 w-full">
              <div className="sticky top-32">
                <div className="glass rounded-[3rem] aspect-video border border-slate-200 dark:border-white/10 overflow-hidden relative shadow-3xl bg-slate-50 dark:bg-black/40">
                  <AnimatePresence mode="wait">
                    {isGenerating ? (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-8"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-brand-primary blur-3xl opacity-20 animate-pulse" />
                          <Loader2 className="w-24 h-24 text-brand-primary animate-spin relative z-10" />
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-2xl font-display font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                            Rendering Vision
                          </h4>
                          <motion.p
                            key={loadingMessageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest"
                          >
                            {LOADING_MESSAGES[loadingMessageIndex]}
                          </motion.p>
                        </div>
                      </motion.div>
                    ) : videoUrl ? (
                      <motion.div
                        key="video"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full"
                      >
                        <video
                          src={videoUrl}
                          controls
                          className="h-full w-full object-contain bg-black"
                          autoPlay
                          loop
                        />
                        <div className="absolute top-6 right-6 flex gap-3">
                          <a
                            href={videoUrl}
                            download="4am-ai-motion.mp4"
                            className="p-4 glass rounded-2xl text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-xl"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        </div>
                      </motion.div>
                    ) : error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6"
                      >
                        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500">
                          <AlertCircle className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-rose-500 uppercase tracking-widest text-xs">Uplink Interrupted</h4>
                          <p className="text-sm text-slate-500 max-w-xs">{error}</p>
                        </div>
                        <button
                          onClick={handleGenerate}
                          className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline"
                        >
                          Retry Connection
                        </button>
                      </motion.div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                        <div className="w-24 h-24 bg-brand-primary/10 rounded-[2.5rem] flex items-center justify-center text-brand-primary border border-brand-primary/20">
                          <Video className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-display font-bold uppercase tracking-tight text-slate-400">Preview Deck</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Awaiting neural initialization</p>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10" />
                            <span className="text-[8px] font-mono text-slate-400">720P_READY</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10" />
                            <span className="text-[8px] font-mono text-slate-400">1080P_UPLINK</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Additional Specs */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="glass p-6 rounded-3xl border border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-4 h-4 text-brand-primary" />
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Architecture</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-tighter">Veo 3.1 Neural Forge</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Maximize2 className="w-4 h-4 text-brand-primary" />
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Latency</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-tighter">Asynchronous Buffer</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default VeoVideoGenerator;