
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, ClipboardList, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default async function WorkOrdersPage() {
    const supabase = await createClient();

    // Fetch WOs with related data
    const { data: wos } = await supabase
        .from('work_orders')
        .select('*, assets(tag, name), assignee:assignee_id(full_name)')
        .order('created_at', { ascending: false });

    // KPIs
    const totalOpen = wos?.filter(w => ['draft', 'assigned', 'in_progress'].includes(w.status)).length || 0;
    const highPriority = wos?.filter(w => w.priority === 'high' || w.priority === 'emergency').length || 0;
    const completedToday = wos?.filter(w => w.status === 'completed' && new Date(w.updated_at).toDateString() === new Date().toDateString()).length || 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="heading-xl">Work Order Management</h1>
                    <p className="subheading">Planner Board: Maintenance & Operations</p>
                </div>
                <Link href="/work-orders/new" className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    Create OT
                </Link>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="dashboard-card bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-1 text-blue-700 dark:text-blue-400">
                        <ClipboardList className="h-4 w-4" />
                        <h3 className="font-medium">Open Work Orders</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                        {totalOpen}
                    </p>
                </div>
                <div className="dashboard-card bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-2 mb-1 text-red-700 dark:text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <h3 className="font-medium">High Priority</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-800 dark:text-red-300">
                        {highPriority}
                    </p>
                </div>
                <div className="dashboard-card bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
                    <div className="flex items-center gap-2 mb-1 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <h3 className="font-medium">Completed Today</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-800 dark:text-green-300">
                        {completedToday}
                    </p>
                </div>
            </div>

            {/* Main List */}
            <div className="dashboard-card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--card-border))]">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">WO #</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Title / Asset</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Priority</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Assignee</th>
                                <th className="px-6 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Scheduled</th>
                                <th className="px-6 py-3 text-right font-medium text-[hsl(var(--muted-foreground))]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(var(--card-border))]">
                            {wos?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
                                        No work orders found. Create a new one to get started.
                                    </td>
                                </tr>
                            ) : (
                                wos?.map((wo) => (
                                    <tr key={wo.id} className="hover:bg-[hsl(var(--muted))] transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium">#{wo.wo_number}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{wo.title}</div>
                                            {wo.assets && (
                                                <Link href={`/assets/${wo.asset_id}`} className="text-xs text-[hsl(var(--muted-foreground))] hover:underline flex items-center gap-1">
                                                    {wo.assets.tag} - {wo.assets.name}
                                                </Link>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
                            ${wo.priority === 'emergency' ? 'bg-red-100 text-red-800 border-red-200' :
                                                    wo.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                                        wo.priority === 'medium' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                {wo.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 capitalize">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--card))] border`}>
                                                {wo.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {wo.assignee ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-center justify-center text-xs">
                                                        {wo.assignee.full_name?.charAt(0)}
                                                    </div>
                                                    <span className="text-xs">{wo.assignee.full_name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[hsl(var(--muted-foreground))] text-xs italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono">
                                            {wo.scheduled_date ? new Date(wo.scheduled_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/work-orders/${wo.id}`} className="text-[hsl(var(--primary))] hover:underline font-medium text-sm">Manage</Link>
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
