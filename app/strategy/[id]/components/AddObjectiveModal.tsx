'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import AITextArea from '@/components/ui/AITextArea';

interface AddObjectiveModalProps {
    planId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function AddObjectiveModal({ planId, isOpen, onClose }: AddObjectiveModalProps) {
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
            target_date: formData.get('target_date'),
            status: 'pending'
        };

        const { error } = await supabase.from('strategic_objectives').insert([data]);

        if (error) {
            alert('Error adding objective: ' + error.message);
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
                    <h3 className="font-semibold text-lg">Add Strategic Objective</h3>
                    <button onClick={onClose} className="p-1 hover:bg-[hsl(var(--muted))] rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Objective Title</label>
                        <input name="title" required className="w-full p-2 border rounded-md bg-transparent" placeholder="e.g., Reduce downtime by 15%" />
                    </div>

                    <div className="space-y-2">
                        <AITextArea
                            name="description"
                            label="Description"
                            context="strategy"
                            rows={3}
                            required
                            placeholder="Detailed description of how to achieve this..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target Date</label>
                        <input name="target_date" type="date" required className="w-full p-2 border rounded-md bg-transparent" />
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm border rounded-md hover:bg-[hsl(var(--muted))]">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-md hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loading ? 'Adding...' : 'Add Objective'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
