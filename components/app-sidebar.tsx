'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    PanelLeftClose,
    PanelLeftOpen,
    PlusCircle,
    LayoutGrid,
    Settings,
    User,
    CreditCard,
    LogOut,
    Sparkles,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Campaign } from '@/lib/types';

interface AppSidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    refreshTrigger?: number;
    onNewProject?: () => void;
    onCampaignClick?: () => void;
}

export function AppSidebar({ collapsed, setCollapsed, refreshTrigger, onNewProject, onCampaignClick }: AppSidebarProps) {
    const router = useRouter();
    const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (!error && data) {
                setRecentCampaigns(data as Campaign[]);
            }
        };

        fetchCampaigns();
    }, [refreshTrigger]);

    return (
        <div
            className={cn(
                "flex flex-col border-r border-gray-200 bg-white lg:bg-gray-50/50 h-screen sticky top-0 transition-all duration-300 ease-in-out shadow-xl lg:shadow-none",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100">
                {!collapsed && (
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
                        <span>ROBO</span>
                        <span className="text-indigo-600">STUDIO</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto text-slate-500 hover:text-slate-900 hidden lg:flex"
                >
                    {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </Button>
            </div>

            {/* New Project Button */}
            <div className="p-4">
                <Button
                    onClick={() => {
                        router.push('/');
                        onNewProject?.();
                    }}
                    className={cn(
                        "w-full bg-white border border-gray-200 text-slate-900 hover:bg-gray-50 hover:border-indigo-200 shadow-sm transition-all",
                        collapsed ? "px-0 justify-center" : "justify-start gap-2"
                    )}
                >
                    <PlusCircle className={cn("w-5 h-5 text-indigo-600", collapsed ? "mr-0" : "mr-2")} />
                    {!collapsed && <span>New project</span>}
                </Button>
            </div>

            {/* Recent Projects (Placeholder) */}
            <div className="flex-1 overflow-y-auto py-2">
                {!collapsed && (
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Recent Projects
                    </div>
                )}

                {collapsed ? (
                    <div className="flex flex-col items-center gap-4 mt-4">
                        {recentCampaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                onClick={() => {
                                    router.push(`/?id=${campaign.id}`);
                                    onCampaignClick?.();
                                }}
                                className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center cursor-pointer hover:bg-indigo-200"
                            >
                                <span className="text-xs font-bold text-indigo-600">{campaign.name.charAt(0).toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1 px-2">
                        {recentCampaigns.map((campaign) => (
                            <Button
                                key={campaign.id}
                                variant="ghost"
                                onClick={() => {
                                    router.push(`/?id=${campaign.id}`);
                                    onCampaignClick?.();
                                }}
                                className="w-full justify-start text-sm font-normal text-slate-600 hover:bg-white hover:shadow-sm"
                            >
                                <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3">
                                    {campaign.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="truncate">{campaign.name}</span>
                            </Button>
                        ))}
                        {recentCampaigns.length === 0 && (
                            <div className="px-4 py-8 text-center text-xs text-slate-400">
                                No recent projects
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="p-2 border-t border-gray-200 bg-white/50">
                <div className="space-y-1">
                    <Button variant="ghost" className={cn("w-full text-slate-600", collapsed ? "justify-center px-2" : "justify-start")} onClick={() => window.location.href = '/calendar'}>
                        <Calendar className="w-5 h-5 mr-2" />
                        {!collapsed && "Calendar"}
                    </Button>
                    <Button variant="ghost" className={cn("w-full text-slate-600", collapsed ? "justify-center px-2" : "justify-start")}>
                        <LayoutGrid className="w-5 h-5 mr-2" />
                        {!collapsed && "Integrations"}
                    </Button>
                    <Button variant="ghost" className={cn("w-full text-slate-600", collapsed ? "justify-center px-2" : "justify-start")}>
                        <CreditCard className="w-5 h-5 mr-2" />
                        {!collapsed && "Billing"}
                    </Button>

                    <div className={cn("flex items-center gap-3 mt-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors", collapsed ? "justify-center" : "")}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                            <User className="w-4 h-4" />
                        </div>
                        {!collapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 truncate">My Account</p>
                                <p className="text-xs text-slate-500 truncate">Pro Plan</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
