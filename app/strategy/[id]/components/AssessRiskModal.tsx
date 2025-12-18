'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import AITextArea from '@/app/components/ui/AITextArea';

interface AssessRiskModalProps {
    planId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function AssessRiskModal({ planId, isOpen, onClose }: AssessRiskModalProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            strategic_plan_id: planId,
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            likelihood: parseInt(formData.get('likelihood') as string),
            impact: parseInt(formData.get('impact') as string),
            mitigation_strategy: formData.get('mitigation_strategy')
        };

        const { error } = await supabase.from('risks').insert([data]);

        if (error) {
            alert('Error assessing risk: ' + error.message);
        } else {
            router.refresh();
            onClose();
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[hsl(var(--card))] w-full max-w-md rounded-xl border border-[hsl(var(--card-border))] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold text-lg">Assess Strategic Risk</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-[hsl(var(--muted))] rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Risk Title</label>
                        <input name="title" required className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g., Inflationary pressure on spare parts" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Likelihood (1-5)</label>
                            <select name="likelihood" className="w-full p-2 border rounded-md bg-transparent">
                                {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Impact (1-5)</label>
                            <select name="impact" className="w-full p-2 border rounded-md bg-transparent">
                                {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <select name="category" className="w-full p-2 border rounded-md bg-transparent">
                            <option value="financial">Financial</option>
                            <option value="operational">Operational</option>
                            <option value="safety">Safety</option>
                            <option value="environmental">Environmental</option>
                            <option value="reputational">Reputational</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <AITextArea
                            name="mitigation_strategy"
                            label="Mitigation Strategy"
                            context="risk"
                            rows={2}
                            required
                            placeholder="How will we reduce this risk?"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loading ? 'Submitting...' : 'Assess Risk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
