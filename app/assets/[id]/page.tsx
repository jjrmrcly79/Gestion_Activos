
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft, FileText, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import DocumentUpload from './DocumentUpload';

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Parallel data fetching
    const [assetRes, docsRes] = await Promise.all([
        supabase.from('assets').select('*').eq('id', id).single(),
        supabase.from('asset_documents').select('*').eq('asset_id', id).order('created_at', { ascending: false })
    ]);

    const asset = assetRes.data;
    const documents = docsRes.data || [];

    if (!asset) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold">Asset Not Found</h2>
                <Link href="/assets" className="text-[hsl(var(--primary))] hover:underline mt-4 inline-block">Return to Registry</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/assets" className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="heading-xl">{asset.name}</h1>
                    <p className="subheading">{asset.tag}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="dashboard-card space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Technical Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-[hsl(var(--muted-foreground))] block">Manufacturer</span>
                                <span className="font-medium">{asset.manufacturer || '-'}</span>
                            </div>
                            <div>
                                <span className="text-[hsl(var(--muted-foreground))] block">Model</span>
                                <span className="font-medium">{asset.model || '-'}</span>
                            </div>
                            <div>
                                <span className="text-[hsl(var(--muted-foreground))] block">Serial Number</span>
                                <span className="font-medium">{asset.serial_number || '-'}</span>
                            </div>
                            <div>
                                <span className="text-[hsl(var(--muted-foreground))] block">Location</span>
                                <span className="font-medium">{asset.location || '-'}</span>
                            </div>
                        </div>
                        <div className="pt-4">
                            <span className="text-[hsl(var(--muted-foreground))] block text-sm">Description</span>
                            <p className="text-sm mt-1">{asset.description || 'No description provided.'}</p>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div className="dashboard-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Documentation</h3>
                            <DocumentUpload assetId={asset.id} />
                        </div>

                        <div className="space-y-2">
                            {documents.length === 0 ? (
                                <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-8 border border-dashed rounded-lg">
                                    No documents uploaded yet. Upload manuals, diagrams, or reports.
                                </p>
                            ) : (
                                documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-[hsl(var(--muted))] transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 rounded-md">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{doc.file_name}</p>
                                                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                                    {(doc.file_size / 1024).toFixed(1)} KB • {new Date(doc.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="dashboard-card space-y-4 bg-[hsl(var(--muted))/30]">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Status</h3>

                        <div>
                            <span className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Criticality</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium uppercase
                        ${asset.criticality === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    asset.criticality === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                {asset.criticality}
                            </span>
                        </div>

                        <div>
                            <span className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Lifecycle Phase</span>
                            <span className="font-medium capitalize">{asset.lifecycle_phase}</span>
                        </div>

                        <div>
                            <span className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Current Value</span>
                            <span className="font-mono text-lg font-bold">${asset.current_value}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
