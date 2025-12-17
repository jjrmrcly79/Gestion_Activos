import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Wrench, Activity, Clock } from 'lucide-react';

export default async function LifecyclePage() {
    const supabase = await createClient();
    const { data: events } = await supabase.from('lifecycle_events').select('*, assets(tag, name)').order('date', { ascending: false });

    // Simple stats
    const maintenanceCount = events?.filter(e => e.event_type === 'maintenance').length || 0;
    const failureCount = events?.filter(e => e.event_type === 'failure').length || 0;
    const totalCost = events?.reduce((sum, e) => sum + (e.cost || 0), 0) || 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Lifecycle Delivery</h1>
                    <p className="subheading">Group 3: Operations, Maintenance, and Disposal</p>
                </div>
                <Link href="/lifecycle/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    Log Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-400">
                        <Wrench className="h-4 w-4" />
                        <h3 className="font-medium">Maintenance Events</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                        {maintenanceCount}
                    </p>
                </div>
                <div className="dashboard-card bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-2 mb-1 text-red-700 dark:text-red-400">
                        <Activity className="h-4 w-4" />
                        <h3 className="font-medium">Failures Reported</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-800 dark:text-red-300">
                        {failureCount}
                    </p>
                </div>
                <div className="dashboard-card bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center gap-2 mb-1 text-emerald-700 dark:text-emerald-400">
                        <span className="font-bold text-lg">$</span>
                        <h3 className="font-medium">Total Cost YTD</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                        ${totalCost.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="dashboard-card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--card-border))]">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Date</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Type</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Asset</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Summary</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Cost</th>
                                <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(var(--card-border))]">
                            {events?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                                        No lifecycle events recorded. Log maintenance or failures.
                                    </td>
                                </tr>
                            ) : (
                                events?.map((event) => (
                                    <tr key={event.id} className="hover:bg-[hsl(var(--muted))] transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                            ${event.event_type === 'failure' ? 'bg-red-100 text-red-800' :
                                                    event.event_type === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {event.event_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {event.assets ? (
                                                <Link href={`/assets/${event.asset_id}`} className="hover:underline text-[hsl(var(--primary))]">
                                                    {event.assets.tag}
                                                </Link>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 truncate max-w-[200px]">{event.summary}</td>
                                        <td className="px-6 py-4 font-mono">${event.cost || 0}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/lifecycle/${event.id}`} className="text-[hsl(var(--primary))] hover:underline">View</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
