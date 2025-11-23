'use client';

import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Instagram, Copy, Check, Loader2, Image as ImageIcon, MessageSquare, Video, User, Target, Lightbulb, Zap, PlayCircle, Calendar as CalendarIcon, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { CampaignOutput, PostIdea } from '@/lib/types';
import { clsx } from 'clsx';
import { AppSidebar } from '@/components/app-sidebar';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const EXAMPLE_PRODUCTS = [
  { product: 'Eco-friendly water bottles made from recycled materials', audience: 'College students interested in sustainability', label: '🌱 Eco Product' },
  { product: 'AI-powered productivity app for remote teams', audience: 'Startup founders and tech professionals', label: '💼 SaaS App' },
  { product: 'Handmade organic skincare products', audience: 'Health-conscious millennials aged 25-35', label: '✨ Beauty Brand' },
];

function CampaignStudio() {
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignOutput | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [generatingImage, setGeneratingImage] = useState<number | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState<number | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [generatedVideos, setGeneratedVideos] = useState<Record<number, string>>({});
  const [selectedPost, setSelectedPost] = useState<number>(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mediaLoading, setMediaLoading] = useState<Record<number, boolean>>({});
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignId = searchParams.get('id');

  const resetState = () => {
    setProductDescription('');
    setTargetAudience('');
    setResult(null);
    setGeneratedImages({});
    setGeneratedVideos({});
    setSelectedPost(0);
    setCopiedIndex(null);
    setGeneratingImage(null);
    setGeneratingVideo(null);
    setMediaLoading({});
    setScheduling(false);
    setScheduleDate('');
  };

  useEffect(() => {
    if (campaignId) {
      loadCampaign(campaignId);
    } else {
      resetState();
    }
  }, [campaignId]);

  const loadCampaign = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setProductDescription(data.product_description);
        setTargetAudience(data.target_audience);
        setResult({
          contentPlan: data.content_plan,
          posts: data.posts
        });
      }
    } catch (error) {
      console.error('Error loading campaign:', error);
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!result || !result.posts[selectedPost] || !scheduleDate) return;

    const post = result.posts[selectedPost];

    try {
      const { error } = await supabase.from('calendar_events').insert({
        title: post.title,
        date: new Date(scheduleDate).toISOString(),
        type: post.type,
        status: 'planned',
        post: post
      });

      if (error) throw error;

      toast.success('Post scheduled successfully!');
      setScheduling(false);
      setScheduleDate('');
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error('Failed to schedule post.');
    }
  };

  const handleGenerate = async () => {
    if (!productDescription || !targetAudience) return;

    setLoading(true);
    setResult(null);
    setGeneratedImages({});
    setGeneratedVideos({});
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

      // Save to Supabase
      try {
        const { error } = await supabase.from('campaigns').insert({
          name: productDescription.slice(0, 50) + '...',
          product_description: productDescription,
          target_audience: targetAudience,
          content_plan: data.contentPlan,
          posts: data.posts
        });

        if (error) {
          console.error('Error saving campaign:', error);
          toast.error('Failed to save campaign: ' + error.message);
        } else {
          toast.success('Campaign saved to history');
          setSidebarRefreshTrigger(prev => prev + 1);
        }
      } catch (err: any) {
        console.error('Error saving campaign:', err);
        toast.error('Failed to save campaign: ' + (err.message || 'Unknown error'));
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate campaign. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string, index: number) => {
    setGeneratingImage(index);
    setMediaLoading(prev => ({ ...prev, [index]: true }));
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
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImage(null);
    }
  };

  const handleGenerateVideo = async (prompt: string, index: number) => {
    setGeneratingVideo(index);
    setMediaLoading(prev => ({ ...prev, [index]: true }));
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate video');
      }

      const data = await response.json();
      setGeneratedVideos(prev => ({ ...prev, [index]: data.videoUrl }));
    } catch (error: any) {
      console.error('Error generating video:', error);
      toast.error(error.message || 'Failed to generate video. Please try again.');
    } finally {
      setGeneratingVideo(null);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'reel':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'static':
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex">
      {/* Sidebar - Hidden on mobile by default */}
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`${mobileMenuOpen ? 'fixed left-0 top-0 bottom-0 z-50' : 'hidden'
        } lg:relative lg:flex lg:z-auto transition-all duration-300`}>
        <AppSidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          refreshTrigger={sidebarRefreshTrigger}
          onNewProject={resetState}
          onCampaignClick={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-40 px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden mr-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h2 className="text-sm font-semibold text-slate-700">Campaign Studio</h2>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-sm text-slate-500 hidden sm:inline">New Campaign</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex text-xs border-gray-300 text-slate-500 bg-white">
              powered by AI
            </Badge>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column: Campaign Brief */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-24 transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    Campaign Brief
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Fill in the details to generate your Instagram campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-5">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="product" className="text-sm font-semibold text-slate-900">
                      Product Description
                    </Label>
                    <p className="text-xs text-slate-500">What are you promoting?</p>
                    <Textarea
                      id="product"
                      placeholder="e.g., Eco-friendly water bottles made from recycled materials"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      rows={3}
                      className="rounded-lg border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-sm font-semibold text-slate-900">
                      Target Audience
                    </Label>
                    <p className="text-xs text-slate-500">Who are you trying to reach?</p>
                    <Input
                      id="audience"
                      placeholder="e.g., College students interested in sustainability"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="rounded-lg border-gray-300 bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Quick Examples */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <Label className="text-xs font-medium text-slate-500">
                        Not sure what to enter? Try one of these presets:
                      </Label>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                      {EXAMPLE_PRODUCTS.map((example, i) => (
                        <button
                          key={i}
                          onClick={() => useExample(example)}
                          className="inline-flex items-center justify-start rounded-full bg-gray-100 px-3 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
                        >
                          {example.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!productDescription || !targetAudience || loading}
                    className="w-full rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-3 sm:py-2.5 hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 touch-manipulation"
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
              <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900">Campaign Ideas</CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-1">
                        Generated posts will appear here. Click to open details.
                      </CardDescription>
                    </div>
                    {result && (
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        {result.posts.length} Posts
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:grid md:grid-cols-5 gap-4 sm:gap-6">
                    {/* Left Panel: Post List */}
                    <div className="md:col-span-2 space-y-2 sm:space-y-3">
                      {!result && !loading && (
                        <div className="text-center py-16 flex flex-col items-center justify-center">
                          <div className="relative mb-4">
                            <div className="absolute inset-0 bg-indigo-100 blur-xl rounded-full"></div>
                            <div className="relative inline-flex p-4 rounded-full bg-white border border-gray-200 shadow-sm">
                              <Instagram className="w-10 h-10 text-gray-400" />
                            </div>
                          </div>
                          <p className="text-sm font-medium text-slate-900 mb-1">No campaign generated yet</p>
                          <p className="text-xs text-slate-500">Fill the brief and hit Generate</p>
                        </div>
                      )}

                      {loading && (
                        <div className="space-y-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="rounded-xl border border-gray-200 bg-white p-3 animate-pulse">
                              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          ))}
                        </div>
                      )}

                      {result && (
                        <>
                          {/* Content Plan */}
                          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-3.5 h-3.5 text-indigo-600" />
                              <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide">
                                Strategy
                              </p>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{result.contentPlan}</p>
                          </div>

                          {/* Post List */}
                          {result.posts.map((post, index) => {
                            const isSelected = index === selectedPost;
                            return (
                              <div
                                key={index}
                                onClick={() => setSelectedPost(index)}
                                className={clsx(
                                  "rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer transition-all touch-manipulation",
                                  isSelected
                                    ? "border-indigo-300 bg-indigo-50 shadow-sm"
                                    : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-sm"
                                )}
                              >
                                <div className="flex items-start gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Badge className={clsx("text-xs px-2 py-0.5", getPostColor(post.type))}>
                                        <span className="flex items-center gap-1">
                                          {getPostIcon(post.type)}
                                          {post.type.toUpperCase()}
                                        </span>
                                      </Badge>
                                    </div>
                                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1 line-clamp-2">{post.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block">{post.hook}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>

                    {/* Right Panel: Post Details */}
                    <div className="md:col-span-3 space-y-3 sm:space-y-4">
                      {!result && !loading && (
                        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 space-y-4">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <Separator className="bg-gray-200" />
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="flex gap-2">
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                              <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                          <Button disabled className="w-full rounded-lg bg-gray-200 text-gray-400" size="sm">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Generate Image
                          </Button>
                        </div>
                      )}

                      {loading && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 animate-pulse shadow-sm">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-24 bg-gray-200 rounded"></div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                      )}

                      {result && result.posts[selectedPost] && (
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 sm:p-5 space-y-4 sm:space-y-5 shadow-md">
                          {/* Hook */}
                          <div>
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                              Opening Hook
                            </Label>
                            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                              {result.posts[selectedPost].hook}
                            </p>
                          </div>

                          <Separator className="bg-indigo-100" />

                          {/* Script (for Reels) or Caption */}
                          {result.posts[selectedPost].type === 'reel' && result.posts[selectedPost].script ? (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                  Video Script
                                </Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(result.posts[selectedPost].script || '', 1)}
                                  className="h-7 text-xs text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                                >
                                  {copiedIndex === 1 ? (
                                    <>
                                      <Check className="w-3 h-3 mr-1 text-green-600" />
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
                              <div className="rounded-lg border border-gray-200 bg-white p-4 max-h-48 overflow-y-auto shadow-sm">
                                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                  {result.posts[selectedPost].script}
                                </p>
                              </div>

                              <div className="mt-4">
                                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                                  Caption (for description)
                                </Label>
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {result.posts[selectedPost].caption}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                  Full Caption
                                </Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(result.posts[selectedPost].caption, 1)}
                                  className="h-7 text-xs text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                                >
                                  {copiedIndex === 1 ? (
                                    <>
                                      <Check className="w-3 h-3 mr-1 text-green-600" />
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
                              <div className="rounded-lg border border-gray-200 bg-white p-4 max-h-48 overflow-y-auto shadow-sm">
                                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                  {result.posts[selectedPost].caption}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          <div>
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                              Call-to-Action
                            </Label>
                            <p className="text-sm font-medium text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-md border border-indigo-100">
                              {result.posts[selectedPost].cta}
                            </p>
                          </div>

                          {/* Hashtags */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Hashtags ({result.posts[selectedPost].hashtags.length})
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(result.posts[selectedPost].hashtags.join(' '), 2)
                                }
                                className="h-7 text-xs text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                              >
                                {copiedIndex === 2 ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1 text-green-600" />
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
                                <span key={i} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-gray-500/10">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <Separator className="bg-indigo-100" />

                          {/* Image/Video Concept */}
                          <div>
                            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                              {result.posts[selectedPost].type === 'reel' ? 'Video Concept' : 'Image Concept'}
                            </Label>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 mb-3">
                              <p className="text-xs text-slate-600 font-mono leading-relaxed">
                                {result.posts[selectedPost].imagePrompt}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                              <Button
                                onClick={() => handleGenerateImage(result.posts[selectedPost].imagePrompt, selectedPost)}
                                disabled={generatingImage === selectedPost}
                                className="w-full rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all touch-manipulation py-3 sm:py-2"
                              >
                                {generatingImage === selectedPost ? (
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

                              {/* Video Button for Reels (PRO Feature) */}
                              {result.posts[selectedPost].type === 'reel' && (
                                <div className="relative group">
                                  <Button
                                    disabled
                                    className="w-full rounded-lg bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
                                  >
                                    <PlayCircle className="w-4 h-4" />
                                    Generate Video
                                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                                      PRO
                                    </Badge>
                                  </Button>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    Upgrade to Pro to generate AI videos
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Schedule Button */}
                            <div className="mb-4">
                              {!scheduling ? (
                                <Button
                                  onClick={() => setScheduling(true)}
                                  variant="outline"
                                  className="w-full rounded-lg border-gray-300 bg-white text-slate-700 hover:bg-gray-50"
                                >
                                  <CalendarIcon className="w-4 h-4 mr-2" />
                                  Schedule Post
                                </Button>
                              ) : (
                                <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-3 animate-in fade-in zoom-in-95">
                                  <Label className="text-xs font-semibold text-slate-500">Pick a date</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="date"
                                      value={scheduleDate}
                                      onChange={(e) => setScheduleDate(e.target.value)}
                                      min={new Date().toISOString().split('T')[0]}
                                      className="h-9 text-sm"
                                    />
                                    <Button
                                      onClick={handleSchedule}
                                      disabled={!scheduleDate}
                                      className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      onClick={() => setScheduling(false)}
                                      className="h-9 w-9 p-0"
                                    >
                                      <span className="sr-only">Cancel</span>
                                      &times;
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Image Loading State */}
                            {(generatingImage === selectedPost || (generatedImages[selectedPost] && mediaLoading[selectedPost])) && (
                              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 h-[300px] flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-300">
                                <div className="p-4 rounded-full bg-white shadow-sm mb-3">
                                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-900">Creating your visual...</p>
                                <p className="text-xs text-slate-400 mt-1">This usually takes about 5-10 seconds</p>
                              </div>
                            )}

                            {/* Generated Image */}
                            {generatedImages[selectedPost] && (
                              <div className={clsx(
                                "mt-4 rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden transition-all duration-500",
                                (generatingImage === selectedPost || mediaLoading[selectedPost]) ? "hidden" : "animate-in fade-in zoom-in-95"
                              )}>
                                <img
                                  src={generatedImages[selectedPost]}
                                  alt={result.posts[selectedPost].title}
                                  className="w-full object-cover max-h-[360px]"
                                  onLoad={() => setMediaLoading(prev => ({ ...prev, [selectedPost]: false }))}
                                />
                                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50/50">
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    AI generated image
                                  </span>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      asChild
                                      className="text-xs h-8 rounded-lg border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                      <a href={generatedImages[selectedPost]} download>
                                        Download
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Video Loading State */}
                            {(generatingVideo === selectedPost || (generatedVideos[selectedPost] && mediaLoading[selectedPost])) && (
                              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 h-[300px] flex flex-col items-center justify-center text-slate-500 animate-in fade-in duration-300">
                                <div className="p-4 rounded-full bg-white shadow-sm mb-3">
                                  <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-900">Generating video...</p>
                                <p className="text-xs text-slate-400 mt-1">This may take up to 20 seconds</p>
                              </div>
                            )}

                            {/* Generated Video */}
                            {generatedVideos[selectedPost] && (
                              <div className={clsx(
                                "mt-4 rounded-2xl border border-gray-200 bg-white shadow-md overflow-hidden transition-all duration-500",
                                (generatingVideo === selectedPost || mediaLoading[selectedPost]) ? "hidden" : "animate-in fade-in zoom-in-95"
                              )}>
                                <video
                                  src={generatedVideos[selectedPost]}
                                  controls
                                  autoPlay
                                  loop
                                  className="w-full object-cover max-h-[360px]"
                                  onLoadedData={() => setMediaLoading(prev => ({ ...prev, [selectedPost]: false }))}
                                />
                                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50/50">
                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-pink-600">
                                    <PlayCircle className="h-3.5 w-3.5" />
                                    AI generated video
                                  </span>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      asChild
                                      className="text-xs h-8 rounded-lg border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                    >
                                      <a href={generatedVideos[selectedPost]} download>
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
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    }>
      <CampaignStudio />
    </Suspense>
  );
}
