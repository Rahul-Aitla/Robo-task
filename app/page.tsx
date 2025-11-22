'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Instagram, Copy, Check, Loader2, Image as ImageIcon, MessageSquare, Video, Moon, Sun, User, Target, Lightbulb, Zap } from 'lucide-react';
import type { CampaignOutput, PostIdea } from '@/lib/types';

const EXAMPLE_PRODUCTS = [
  { product: 'Eco-friendly water bottles made from recycled materials', audience: 'College students interested in sustainability', label: '🌱 Eco Product' },
  { product: 'AI-powered productivity app for remote teams', audience: 'Startup founders and tech professionals', label: '💼 SaaS App' },
  { product: 'Handmade organic skincare products', audience: 'Health-conscious millennials aged 25-35', label: '✨ Beauty Brand' },
];

export default function Home() {
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignOutput | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [generatingImage, setGeneratingImage] = useState<number | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [selectedPost, setSelectedPost] = useState<number>(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleGenerate = async () => {
    if (!productDescription || !targetAudience) return;

    setLoading(true);
    setResult(null);
    setGeneratedImages({});
    setSelectedPost(0);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productDescription, targetAudience }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate campaign');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate campaign. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string, index: number) => {
    setGeneratingImage(index);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImages(prev => ({ ...prev, [index]: data.imageUrl }));
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImage(null);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const useExample = (example: typeof EXAMPLE_PRODUCTS[0]) => {
    setProductDescription(example.product);
    setTargetAudience(example.audience);
  };

  const getPostIcon = (type: PostIdea['type']) => {
    switch (type) {
      case 'carousel':
        return <ImageIcon className="w-3.5 h-3.5" />;
      case 'reel':
        return <Video className="w-3.5 h-3.5" />;
      case 'static':
        return <MessageSquare className="w-3.5 h-3.5" />;
    }
  };

  const getPostColor = (type: PostIdea['type']) => {
    switch (type) {
      case 'carousel':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'reel':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'static':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top Bar */}
      <header className="border-b border-slate-800/60 bg-slate-900/70 backdrop-blur-sm sticky top-0 z-50 shadow-xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  AI Campaign Studio
                </h1>
                <p className="text-xs text-slate-500">Powered by Gemini 2.0</p>
              </div>
            </div>

            {/* Center: Module */}
            <div className="hidden md:flex items-center gap-2">
              <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 px-3 py-1">
                <Instagram className="w-3 h-3 mr-1.5" />
                Campaign Studio
              </Badge>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex text-xs border-slate-700 text-slate-400">
                AI Builder Assignment
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg hover:bg-slate-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Campaign Brief */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border border-slate-800/60 bg-slate-900/70 shadow-xl shadow-black/20 sticky top-24 transition-all hover:shadow-2xl hover:shadow-black/30">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  Campaign Brief
                </CardTitle>
                <CardDescription className="text-sm text-slate-400">
                  Fill in the details to generate your Instagram campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="product" className="text-sm font-medium text-slate-200">
                    Product Description
                  </Label>
                  <p className="text-xs text-slate-500">What are you promoting?</p>
                  <Textarea
                    id="product"
                    placeholder="e.g., Eco-friendly water bottles made from recycled materials"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={3}
                    className="rounded-lg border-slate-700 bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
                  />
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience" className="text-sm font-medium text-slate-200">
                    Target Audience
                  </Label>
                  <p className="text-xs text-slate-500">Who are you trying to reach?</p>
                  <Input
                    id="audience"
                    placeholder="e.g., College students interested in sustainability"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="rounded-lg border-slate-700 bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Quick Examples */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <Label className="text-xs font-medium text-slate-400">
                      Not sure what to enter? Try one of these presets:
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    {EXAMPLE_PRODUCTS.map((example, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => useExample(example)}
                        className="justify-start text-xs h-9 rounded-lg border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                      >
                        {example.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-slate-800" />

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!productDescription || !targetAudience || loading}
                  className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-600 text-sm font-medium px-4 py-2.5 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Campaign...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Campaign
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results - Two Panel Structure */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl border border-slate-800/60 bg-slate-900/70 shadow-xl shadow-black/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-white">Campaign Ideas</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Generated posts will appear here. Click to open details.
                    </CardDescription>
                  </div>
                  {result && (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                      {result.posts.length} Posts
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Left Panel: Post List */}
                  <div className="md:col-span-2 space-y-3">
                    {!result && !loading && (
                      <div className="text-center py-16 flex flex-col items-center justify-center">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
                          <div className="relative inline-flex p-4 rounded-full bg-slate-800/50 border border-slate-700">
                            <Instagram className="w-10 h-10 text-slate-600" />
                          </div>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">No campaign generated yet</p>
                        <p className="text-xs text-slate-600">Fill the brief and hit Generate</p>
                      </div>
                    )}

                    {loading && (
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 animate-pulse">
                            <div className="h-3 bg-slate-800 rounded w-3/4 mb-2"></div>
                            <div className="h-2 bg-slate-800 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {result && (
                      <>
                        {/* Content Plan */}
                        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 mb-3 transition-all hover:bg-indigo-500/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-indigo-400" />
                            <p className="text-xs font-medium text-indigo-400 uppercase tracking-wide">
                              Strategy
                            </p>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{result.contentPlan}</p>
                        </div>

                        {/* Post List */}
                        {result.posts.map((post, index) => (
                          <div
                            key={index}
                            onClick={() => setSelectedPost(index)}
                            className={`rounded-xl border p-3 cursor-pointer transition-all hover:bg-slate-800/50 hover:border-indigo-500/50 ${selectedPost === index
                                ? 'border-indigo-500 bg-slate-800/50 shadow-lg shadow-indigo-500/10'
                                : 'border-slate-800 bg-slate-900/60'
                              }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <Badge className={`${getPostColor(post.type)} border text-xs px-2 py-0.5`}>
                                    <span className="flex items-center gap-1">
                                      {getPostIcon(post.type)}
                                      {post.type.toUpperCase()}
                                    </span>
                                  </Badge>
                                </div>
                                <h3 className="text-xs font-semibold text-white mb-1 line-clamp-2">{post.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-1">{post.hook}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Right Panel: Post Details */}
                  <div className="md:col-span-3 space-y-4">
                    {!result && !loading && (
                      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-6 space-y-4">
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-800/50 rounded w-20"></div>
                          <div className="h-6 bg-slate-800/50 rounded w-3/4"></div>
                        </div>
                        <Separator className="bg-slate-800/50" />
                        <div className="space-y-2">
                          <div className="h-3 bg-slate-800/50 rounded w-16"></div>
                          <div className="h-20 bg-slate-800/50 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 bg-slate-800/50 rounded w-20"></div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-slate-800/50 rounded w-16"></div>
                            <div className="h-6 bg-slate-800/50 rounded w-16"></div>
                            <div className="h-6 bg-slate-800/50 rounded w-16"></div>
                          </div>
                        </div>
                        <Button disabled className="w-full rounded-lg" size="sm">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Generate Image
                        </Button>
                      </div>
                    )}

                    {loading && (
                      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 animate-pulse">
                        <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                        <div className="h-24 bg-slate-800 rounded"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-slate-800 rounded w-16"></div>
                          <div className="h-6 bg-slate-800 rounded w-16"></div>
                        </div>
                      </div>
                    )}

                    {result && result.posts[selectedPost] && (
                      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-5 space-y-4">
                        {/* Hook */}
                        <div>
                          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                            🪝 Opening Hook
                          </Label>
                          <p className="text-base font-semibold text-white leading-relaxed">
                            {result.posts[selectedPost].hook}
                          </p>
                        </div>

                        <Separator className="bg-slate-800" />

                        {/* Caption */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              ✍️ Full Caption
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(result.posts[selectedPost].caption, 1)}
                              className="h-7 text-xs hover:bg-slate-800 transition-colors"
                            >
                              {copiedIndex === 1 ? (
                                <>
                                  <Check className="w-3 h-3 mr-1 text-green-400" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 max-h-40 overflow-y-auto">
                            <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {result.posts[selectedPost].caption}
                            </p>
                          </div>
                        </div>

                        {/* CTA */}
                        <div>
                          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                            🎯 Call-to-Action
                          </Label>
                          <p className="text-sm font-medium text-indigo-400">
                            {result.posts[selectedPost].cta}
                          </p>
                        </div>

                        {/* Hashtags */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              #️⃣ Hashtags ({result.posts[selectedPost].hashtags.length})
                            </Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(result.posts[selectedPost].hashtags.join(' '), 2)
                              }
                              className="h-7 text-xs hover:bg-slate-800 transition-colors"
                            >
                              {copiedIndex === 2 ? (
                                <>
                                  <Check className="w-3 h-3 mr-1 text-green-400" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {result.posts[selectedPost].hashtags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator className="bg-slate-800" />

                        {/* Image Concept */}
                        <div>
                          <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2 block">
                            🎨 Image Concept
                          </Label>
                          <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 mb-3">
                            <p className="text-xs text-slate-300 font-mono leading-relaxed">
                              {result.posts[selectedPost].imagePrompt}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleGenerateImage(result.posts[selectedPost].imagePrompt, selectedPost)}
                            disabled={generatingImage === selectedPost}
                            className="w-full rounded-lg bg-indigo-500 hover:bg-indigo-600 text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                          >
                            {generatingImage === selectedPost ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating Image...
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Generate Image for This Post
                              </>
                            )}
                          </Button>

                          {/* Generated Image */}
                          {generatedImages[selectedPost] && (
                            <div className="mt-4 rounded-xl border border-slate-700 overflow-hidden transition-all hover:shadow-xl hover:shadow-black/30">
                              <img
                                src={generatedImages[selectedPost]}
                                alt={result.posts[selectedPost].title}
                                className="w-full"
                              />
                              <div className="bg-slate-900 p-3 flex items-center justify-between">
                                <p className="text-xs text-slate-400">✨ AI-Generated Image</p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateImage(result.posts[selectedPost].imagePrompt, selectedPost)}
                                    className="text-xs h-7 rounded-lg border-slate-700 hover:bg-slate-800 transition-colors"
                                  >
                                    Regenerate
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="text-xs h-7 rounded-lg border-slate-700 hover:bg-slate-800 transition-colors"
                                  >
                                    <a href={generatedImages[selectedPost]} download>
                                      Download
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
