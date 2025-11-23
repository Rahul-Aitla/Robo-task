'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AppSidebar } from '@/components/app-sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2, Plus, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CalendarEvent } from '@/lib/types';
import { clsx } from 'clsx';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';

export default function CalendarPage() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const start = startOfMonth(currentDate).toISOString();
            const end = endOfMonth(currentDate).toISOString();

            const { data, error } = await supabase
                .from('calendar_events')
                .select('*')
                .gte('date', start)
                .lte('date', end);

            if (error) {
                console.error('Error fetching events:', error);
                toast.error('Failed to load calendar events');
            } else {
                setEvents(data || []);
            }
            setLoading(false);
        };

        fetchEvents();
    }, [currentDate]);

    const days = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const getEventsForDay = (day: Date) => {
        return events.filter(event => isSameDay(parseISO(event.date), day));
    };

    const getStatusColor = (status: CalendarEvent['status']) => {
        switch (status) {
            case 'planned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'created': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'posted': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 flex">
            {/* Sidebar - Hidden on mobile by default */}
            <div className={`${mobileMenuOpen ? 'fixed inset-0 z-50 lg:relative lg:z-auto' : 'hidden lg:flex'
                }`}>
                {/* Mobile overlay */}
                {mobileMenuOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
                <div className={`relative lg:relative ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
                    <AppSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
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
                        <span className="text-sm text-slate-500 hidden sm:inline">Content Calendar</span>
                    </div>
                </header>

                <main className="flex-1 p-3 sm:p-6 max-w-7xl mx-auto w-full">
                    <Card className="h-full border-gray-200 shadow-sm bg-white">
                        <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                                    Content Calendar
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500 mt-1">
                                    Manage your scheduled content
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="font-medium min-w-[100px] sm:min-w-[120px] text-center text-sm sm:text-base">
                                    {format(currentDate, 'MMMM yyyy')}
                                </div>
                                <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center h-96">
                                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                                        <div key={day} className="bg-gray-50 p-1 sm:p-2 text-center text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            <span className="hidden sm:inline">{day}</span>
                                            <span className="sm:hidden">{day.charAt(0)}</span>
                                        </div>
                                    ))}
                                    {days.map((day: Date, dayIdx: number) => {
                                        const dayEvents = getEventsForDay(day);
                                        return (
                                            <div
                                                key={day.toString()}
                                                className={clsx(
                                                    "bg-white min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 hover:bg-gray-50 transition-colors relative group",
                                                    !isSameMonth(day, currentDate) && "bg-gray-50/50 text-gray-400"
                                                )}
                                            >
                                                <time dateTime={format(day, 'yyyy-MM-dd')} className={clsx(
                                                    "text-[10px] sm:text-xs font-medium block mb-1",
                                                    isSameDay(day, new Date()) ? "bg-indigo-600 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center" : "text-gray-700"
                                                )}>
                                                    {format(day, 'd')}
                                                </time>
                                                <div className="space-y-1">
                                                    {dayEvents.map((event) => (
                                                        <div
                                                            key={event.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedEvent(event);
                                                            }}
                                                            className="text-[9px] sm:text-[10px] p-1 sm:p-1.5 rounded border bg-white shadow-sm hover:shadow-md transition-all cursor-pointer truncate touch-manipulation"
                                                        >
                                                            <div className="flex items-center gap-1 mb-0.5">
                                                                <Badge variant="secondary" className={clsx("h-1.5 w-1.5 rounded-full p-0", getStatusColor(event.status))} />
                                                                <span className="font-medium truncate">{event.title}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                                                >
                                                    <Plus className="w-3 h-3 text-gray-400" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>

                {/* Event Details Modal */}
                {selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{selectedEvent.title}</h3>
                                        <p className="text-sm text-slate-500">{format(parseISO(selectedEvent.date), 'PPP')}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)} className="touch-manipulation">
                                        <span className="sr-only">Close</span>
                                        &times;
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="uppercase text-xs">
                                        {selectedEvent.type}
                                    </Badge>
                                    <Badge className={clsx("uppercase text-xs", getStatusColor(selectedEvent.status))}>
                                        {selectedEvent.status}
                                    </Badge>
                                </div>

                                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Caption</label>
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap mt-1 max-h-40 overflow-y-auto">
                                            {selectedEvent.post.caption}
                                        </p>
                                    </div>

                                    {selectedEvent.post.hashtags && (
                                        <div>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Hashtags</label>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {selectedEvent.post.hashtags.map((tag, i) => (
                                                    <span key={i} className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Edit Post</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
