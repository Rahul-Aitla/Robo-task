'use client';

import { useState } from 'react';
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
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed, setCollapsed }: AppSidebarProps) {
    return (
        <div
            className={cn(
                "flex flex-col border-r border-gray-200 bg-gray-50/50 h-screen sticky top-0 transition-all duration-300 ease-in-out",
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
                    className="ml-auto text-slate-500 hover:text-slate-900"
                >
                    {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </Button>
            </div>

            {/* New Project Button */}
            <div className="p-4">
                <Button
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
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-indigo-600">E</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-pink-600">S</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1 px-2">
                        <Button variant="ghost" className="w-full justify-start text-sm font-normal text-slate-600 hover:bg-white hover:shadow-sm">
                            <span className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3">E</span>
                            Eco Water Bottle
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-sm font-normal text-slate-600 hover:bg-white hover:shadow-sm">
                            <span className="w-6 h-6 rounded bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold mr-3">S</span>
                            Summer Campaign
                        </Button>
                        <div className="px-4 py-8 text-center text-xs text-slate-400">
                            No more recent projects
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="p-2 border-t border-gray-200 bg-white/50">
                <div className="space-y-1">
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
