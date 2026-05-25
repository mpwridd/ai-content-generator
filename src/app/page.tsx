'use client';

import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, ArrowRight, Zap, Hash, Users, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: 'from-gray-600 to-gray-800', desc: 'Threads & tweets' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-600', desc: 'Captions & hashtags' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800', desc: 'Professional posts' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-pink-500 to-red-500', desc: 'Viral captions' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'from-red-500 to-red-700', desc: 'Titles & scripts' },
  { id: 'blog', name: 'Blog', icon: '📝', color: 'from-green-500 to-emerald-600', desc: 'Full articles' },
];

const TONES = [
  { id: 'professional', name: 'Professional', emoji: '💼' },
  { id: 'casual', name: 'Casual', emoji: '😎' },
  { id: 'humorous', name: 'Humorous', emoji: '😂' },
  { id: 'educational', name: 'Educational', emoji: '📚' },
  { id: 'persuasive', name: 'Persuasive', emoji: '🎯' },
  { id: 'storytelling', name: 'Storytelling', emoji: '📖' },
  { id: 'inspirational', name: 'Inspirational', emoji: '✨' },
];

const LENGTHS = [
  { id: 'short', name: 'Short', desc: '~100 words', icon: '⚡' },
  { id: 'medium', name: 'Medium', desc: '~300 words', icon: '📝' },
  { id: 'long', name: 'Long', desc: '~500+ words', icon: '📄' },
];

const SUGGESTIONS = [
  'AI productivity tips for remote workers',
  'The future of Web3 and decentralized apps',
  'Morning routine of successful entrepreneurs',
  'How to build a personal brand on social media',
  'Crypto market analysis for beginners',
  'Top 10 coding tips for beginners',
];

export default function Home() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [tone, setTone] = useState('casual');
  const [length, setLength] = useState('medium');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [history, setHistory] = useState<{ content: string; platform: string; topic: string }[]>([]);

  const generate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, tone, length, keywords, targetAudience: audience }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.content);
      setWordCount(data.wordCount || 0);
      setHistory(prev => [{ content: data.content, platform, topic }, ...prev].slice(0, 10));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate';
      setResult(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const enhanceContent = async () => {
    if (!result || enhancing) return;
    setEnhancing(true);
    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: result, platform }),
      });
      const data = await res.json();
      if (data.content) setResult(data.content);
    } catch {} finally {
      setEnhancing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles size={28} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                AI Content Generator
              </h1>
              <p className="text-gray-400 text-sm">Create viral content for any platform</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel — Controls */}
          <div className="lg:col-span-2 space-y-4">
            {/* Topic */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">Topic / Idea</label>
              <textarea
                className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition-all"
                rows={3}
                placeholder="What's your content about?"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => setTopic(s)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    {s.length > 30 ? s.slice(0, 30) + '...' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-300 mb-3">Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      platform === p.id
                        ? `bg-gradient-to-br ${p.color} ring-2 ring-white/20 shadow-lg`
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <span className="block text-xl mb-1">{p.icon}</span>
                    <span className="block text-xs font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-300 mb-3">Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      tone === t.id
                        ? 'bg-orange-600 text-white ring-2 ring-orange-400'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {t.emoji} {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <label className="block text-sm font-medium text-gray-300 mb-3">Length</label>
              <div className="flex gap-2">
                {LENGTHS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLength(l.id)}
                    className={`flex-1 p-3 rounded-xl text-center transition-all ${
                      length === l.id
                        ? 'bg-orange-600 ring-2 ring-orange-400'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <span className="block text-lg">{l.icon}</span>
                    <span className="block text-sm font-medium">{l.name}</span>
                    <span className="block text-xs text-gray-400">{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced */}
            <div className="bg-gray-900 rounded-2xl p-5">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Advanced Options
              </button>
              {showAdvanced && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <Hash size={12} /> Keywords (comma-separated)
                    </label>
                    <input
                      className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="AI, tech, innovation"
                      value={keywords}
                      onChange={e => setKeywords(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <Users size={12} /> Target Audience
                    </label>
                    <input
                      className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="developers, marketers, founders"
                      value={audience}
                      onChange={e => setAudience(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading || !topic.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 rounded-xl py-4 font-bold text-lg transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Generate Content
                </>
              )}
            </button>
          </div>

          {/* Right Panel — Output */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-2xl p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Wand2 size={18} className="text-orange-400" />
                  Generated Content
                  {wordCount > 0 && (
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">
                      {wordCount} words
                    </span>
                  )}
                </h2>
                {result && !result.startsWith('Error') && (
                  <div className="flex gap-2">
                    <button
                      onClick={enhanceContent}
                      disabled={enhancing}
                      className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 text-sm transition-colors"
                    >
                      <RefreshCw size={14} className={enhancing ? 'animate-spin' : ''} />
                      {enhancing ? 'Enhancing...' : 'Enhance'}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-1.5 text-sm transition-colors"
                    >
                      {copied ? '✅ Copied!' : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>
                )}
              </div>

              <div className="min-h-[400px] bg-gray-800 rounded-xl p-5">
                {result ? (
                  result.startsWith('Error') ? (
                    <div className="text-red-400">{result}</div>
                  ) : (
                    <div className="whitespace-pre-wrap text-gray-200 leading-relaxed text-sm">
                      {result}
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-80 text-gray-500">
                    <div className="text-center">
                      <div className="text-5xl mb-4">✍️</div>
                      <p className="text-lg font-medium">Ready to create content</p>
                      <p className="text-sm mt-1">Select a platform, choose a tone, and enter your topic</p>
                    </div>
                  </div>
                )}
              </div>

              {/* History */}
              {history.length > 1 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Recent Generations</h3>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {history.slice(1).map((h, i) => (
                      <button
                        key={i}
                        onClick={() => { setResult(h.content); }}
                        className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs transition-colors"
                      >
                        <span className="text-gray-400">{PLATFORMS.find(p => p.id === h.platform)?.icon}</span>
                        <span className="ml-2 text-gray-300">{h.topic.slice(0, 50)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
