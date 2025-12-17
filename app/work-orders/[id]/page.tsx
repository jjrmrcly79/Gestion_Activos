
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft, Calendar, User, CheckSquare, Activity } from 'lucide-react';
import Link from 'next/link';
import Checklist from './Checklist';
import Readings from './Readings';

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: wo } = await supabase
        .from('work_orders')
        .select('*, assets(*), assignee:assignee_id(full_name), requester:requester_id(full_name)')
        .eq('id', id)
        .single();

    if (!wo) return <div>Work Order not found</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Link href="/work-orders" className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors mt-1">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm font-mono text-[hsl(var(--muted-foreground))] mb-1 block">WO #{wo.wo_number}</span>
                            <div className="flex items-center gap-4">
                                <h1 className="heading-xl mb-2">{wo.title}</h1>
                                <Link target="_blank" href={`/work-orders/${id}/print`} className="text-xs px-2 py-1 border rounded hover:bg-[hsl(var(--muted))] mb-2 flex items-center gap-1">
                                    Print PDF
                                </Link>
                            </div>
                            {wo.assets && (
                                <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                    <span className="font-semibold">{wo.assets.tag}</span>
                                    <span>•</span>
                                    <span>{wo.assets.name}</span>
                                </div>
                            )}
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border
                      ${wo.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                wo.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            {wo.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details & Execution */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="dashboard-card">
                        <h3 className="font-semibold text-lg mb-4">Description</h3>
                        <p className="leading-relaxed whitespace-pre-wrap text-sm">
                            {wo.description || 'No detailed description provided.'}
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <CheckSquare className="h-5 w-5" />
                            Tasks & Activities
                        </h3>
                        <Checklist workOrderId={wo.id} />
                    </div>

                    <div className="dashboard-card">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Measurements & Readings
                        </h3>
                        {wo.asset_id ? (
                            <Readings workOrderId={wo.id} assetId={wo.asset_id} />
                        ) : (
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">No asset linked to this WO.</p>
                        )}
                    </div>

                    <div className="dashboard-card">
                        <h3 className="font-semibold text-lg mb-4">Feedback & Findings</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-[hsl(var(--muted))/30] p-3 rounded">
                                <span className="text-xs text-[hsl(var(--muted-foreground))] block">Execution Time</span>
                                <span className="font-mono font-medium">{wo.execution_time_minutes || 0} min</span>
                            </div>
                            <div className="bg-[hsl(var(--muted))/30] p-3 rounded">
                                <span className="text-xs text-[hsl(var(--muted-foreground))] block">Downtime</span>
                                <span className="font-mono font-medium">{wo.downtime_minutes || 0} min</span>
                            </div>
                        </div>
                        <p className="text-sm italic text-[hsl(var(--muted-foreground))]">
                            {wo.feedback_notes || 'No feedback notes recorded yet.'}
                        </p>
                    </div>
                </div>

                {/* Right Column: Meta Info */}
                <div className="space-y-6">
                    <div className="dashboard-card space-y-4">
                        <h3 className="font-medium text-sm text-[hsl(var(--muted-foreground))] uppercase tracking-wider border-b pb-2">Details</h3>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[hsl(var(--muted-foreground))]">Type</span>
                            <span className="text-sm font-medium capitalize">{wo.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[hsl(var(--muted-foreground))]">Priority</span>
                            <span className={`text-sm font-medium capitalize px-2 py-0.5 rounded
                            ${wo.priority === 'emergency' ? 'bg-red-100 text-red-800' : wo.priority === 'high' ? 'bg-orange-100 text-orange-800' : ''}`}>
                                {wo.priority}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[hsl(var(--muted-foreground))]">Scheduled</span>
                            <span className="text-sm font-medium">{wo.scheduled_date ? new Date(wo.scheduled_date).toLocaleDateString() : '-'}</span>
                        </div>
                    </div>

                    <div className="dashboard-card space-y-4">
                        <h3 className="font-medium text-sm text-[hsl(var(--muted-foreground))] uppercase tracking-wider border-b pb-2">People</h3>

                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs text-[hsl(var(--muted-foreground))] block">Assigned To</span>
                                <span className="text-sm font-medium">{wo.assignee?.full_name || 'Unassigned'}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <span className="text-xs text-[hsl(var(--muted-foreground))] block">Attn. Requester</span>
                                <span className="text-sm font-medium">{wo.requester?.full_name || 'System / Admin'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
