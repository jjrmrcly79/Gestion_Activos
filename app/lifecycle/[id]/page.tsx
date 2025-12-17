
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft, Calendar, DollarSign, User } from 'lucide-react';
import Link from 'next/link';

export default async function LifecycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: event } = await supabase.from('lifecycle_events').select('*, assets(*)').eq('id', id).single();

    if (!event) {
        return <div>Event not found</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-start gap-4">
                <Link href="/lifecycle" className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors mt-1">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase
                    ${event.event_type === 'failure' ? 'bg-red-100 text-red-800' :
                                event.event_type === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {event.event_type}
                        </span>
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">ID: {event.id.slice(0, 8)}</span>
                    </div>
                    <h1 className="heading-xl">{event.summary}</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="dashboard-card">
                        <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-4">Event Details</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[hsl(var(--muted))] rounded-full">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-[hsl(var(--muted-foreground))] block">Date</span>
                                    <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[hsl(var(--muted))] rounded-full">
                                    <DollarSign className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-[hsl(var(--muted-foreground))] block">Cost</span>
                                    <span className="font-medium">${event.cost || 0}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[hsl(var(--muted))] rounded-full">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-[hsl(var(--muted-foreground))] block">Performed By</span>
                                    <span className="font-medium">{event.performed_by || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="dashboard-card bg-[hsl(var(--muted))/30]">
                        <h3 className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wide mb-4">Related Asset</h3>
                        {event.assets ? (
                            <div className="space-y-2">
                                <Link href={`/assets/${event.asset_id}`} className="block p-3 bg-[hsl(var(--card))] border rounded-md hover:border-[hsl(var(--primary))] transition-colors text-center">
                                    <span className="block text-lg font-bold font-mono mb-1">{event.assets.tag}</span>
                                    <span className="text-sm text-[hsl(var(--muted-foreground))]">{event.assets.name}</span>
                                </Link>
                                <div className="grid grid-cols-2 gap-2 text-xs text-center">
                                    <div className="p-2 bg-[hsl(var(--card))] rounded border">
                                        <span className="block text-[hsl(var(--muted-foreground))]">Criticality</span>
                                        <span className="font-medium capitalize">{event.assets.criticality}</span>
                                    </div>
                                    <div className="p-2 bg-[hsl(var(--card))] rounded border">
                                        <span className="block text-[hsl(var(--muted-foreground))]">Phase</span>
                                        <span className="font-medium capitalize">{event.assets.lifecycle_phase}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm italic text-[hsl(var(--muted-foreground))]">No asset linked.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
