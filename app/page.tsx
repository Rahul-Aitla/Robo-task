'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Instagram, Copy, Check, Loader2, Image as ImageIcon, MessageSquare, Video, Zap, TrendingUp, Target } from 'lucide-react';
import type { CampaignOutput, PostIdea } from '@/lib/types';

const EXAMPLE_PRODUCTS = [
  { product: 'Eco-friendly water bottles made from recycled materials', audience: 'College students interested in sustainability' },
  { product: 'AI-powered productivity app for remote teams', audience: 'Startup founders and tech professionals' },
  { product: 'Handmade organic skincare products', audience: 'Health-conscious millennials aged 25-35' },
];

export default function Home() {
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignOutput | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [generatingImage, setGeneratingImage] = useState<number | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});

  const handleGenerate = async () => {
    if (!productDescription || !targetAudience) return;

    setLoading(true);
    setResult(null);
    setGeneratedImages({}); // Reset images
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
        return <ImageIcon className="w-4 h-4" />;
      case 'reel':
        return <Video className="w-4 h-4" />;
      case 'static':
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPostColor = (type: PostIdea['type']) => {
    switch (type) {
      case 'carousel':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300';
      case 'reel':
        return 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300';
      case 'static':
        return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/50 dark:to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="border-b border-purple-200/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CampaignAI Studio
                </h1>
                <p className="text-xs text-muted-foreground">AI-Powered Social Media Magic ✨</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex gap-1">
              <Zap className="w-3 h-3" />
              Powered by Gemini
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Hero Section */}
        {!result && !loading && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
                Generate Complete Campaigns in Seconds
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Create Instagram Campaigns
              <br />
              That Actually Convert
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Get AI-generated content plans, engaging captions, viral hooks, and stunning image prompts—all tailored to your brand
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50">
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-xs text-muted-foreground">Post Ideas</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-pink-200/50">
                <div className="text-2xl font-bold text-pink-600">30s</div>
                <div className="text-xs text-muted-foreground">Generation Time</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-xs text-muted-foreground">Ready to Use</div>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        <Card className="mb-8 border-2 border-purple-200/50 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Create Your Campaign
            </CardTitle>
            <CardDescription className="text-base">
              Describe your product and audience—our AI will craft a complete Instagram strategy
            </CardDescription>

            {/* Example Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-muted-foreground">Try an example:</span>
              {EXAMPLE_PRODUCTS.map((example, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => useExample(example)}
                  className="text-xs h-7 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  Example {i + 1}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Product Description
              </Label>
              <Textarea
                id="product"
                placeholder="e.g., I sell eco-friendly water bottles made from recycled materials that keep drinks cold for 24 hours"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={3}
                className="resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience" className="text-sm font-semibold flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                Target Audience
              </Label>
              <Input
                id="audience"
                placeholder="e.g., College students aged 18-24 interested in sustainability and eco-friendly lifestyle"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={!productDescription || !targetAudience || loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Crafting Your Campaign Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Campaign
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 mb-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                Campaign Generated Successfully! 🎉
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Your complete Instagram campaign is ready. Copy and use any content below.
              </p>
            </div>

            {/* Content Plan */}
            <Card className="border-2 border-purple-200/50 shadow-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Content Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-foreground/90">{result.contentPlan}</p>
              </CardContent>
            </Card>

            {/* Post Ideas */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Instagram className="w-8 h-8 text-pink-600" />
                  Your 5 Post Ideas
                </h2>
                <Badge variant="secondary" className="text-sm">
                  Ready to Post
                </Badge>
              </div>
              <div className="grid gap-6">
                {result.posts.map((post, index) => (
                  <Card key={index} className="border-2 border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={`${getPostColor(post.type)} border`}>
                              <span className="flex items-center gap-1.5 font-semibold">
                                {getPostIcon(post.type)}
                                {post.type.toUpperCase()}
                              </span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Post {index + 1} of 5
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl leading-tight">{post.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Hook */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl p-4 border-2 border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-bold flex items-center gap-1">
                            🪝 Opening Hook
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(post.hook, index * 10 + 1)}
                            className="h-8"
                          >
                            {copiedIndex === index * 10 + 1 ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{post.hook}</p>
                      </div>

                      <Separator />

                      {/* Caption */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-bold flex items-center gap-1">
                            ✍️ Full Caption
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(post.caption, index * 10 + 2)}
                            className="h-8"
                          >
                            {copiedIndex === index * 10 + 2 ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-lg leading-relaxed border">
                          {post.caption}
                        </p>
                      </div>

                      <Separator />

                      {/* CTA */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-bold flex items-center gap-1">
                            🎯 Call-to-Action
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(post.cta, index * 10 + 3)}
                            className="h-8"
                          >
                            {copiedIndex === index * 10 + 3 ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                          {post.cta}
                        </p>
                      </div>

                      <Separator />

                      {/* Hashtags */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-bold flex items-center gap-1">
                            #️⃣ Hashtags ({post.hashtags.length})
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(post.hashtags.join(' '), index * 10 + 4)}
                            className="h-8"
                          >
                            {copiedIndex === index * 10 + 4 ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.hashtags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Image Prompt */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-bold flex items-center gap-1">
                            🎨 AI Image Generation Prompt
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(post.imagePrompt, index * 10 + 5)}
                            className="h-8"
                          >
                            {copiedIndex === index * 10 + 5 ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-200">
                          {post.imagePrompt}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateImage(post.imagePrompt, index)}
                            disabled={generatingImage === index}
                            className="flex-1"
                          >
                            {generatingImage === index ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Generate Image
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(post.imagePrompt, index * 10 + 5)}
                            className="h-9"
                          >
                            {copiedIndex === index * 10 + 5 ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        {generatedImages[index] && (
                          <div className="mt-4">
                            <img
                              src={generatedImages[index]}
                              alt={post.title}
                              className="w-full rounded-lg border-2 border-blue-300 shadow-lg"
                            />
                            <p className="text-xs text-center text-muted-foreground mt-2">
                              ✨ AI-Generated Image • Right-click to save
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Generate Another Button */}
            <div className="text-center pt-8">
              <Button
                onClick={() => {
                  setResult(null);
                  setProductDescription('');
                  setTargetAudience('');
                }}
                variant="outline"
                size="lg"
                className="border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Another Campaign
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm mt-20 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Built with <span className="text-red-500">♥</span> using Next.js, Google Gemini, and shadcn/ui
            </p>
            <p className="text-xs text-muted-foreground">
              AI-Powered Campaign Generation • Instant Results • Ready to Use
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
