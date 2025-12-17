'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { Plus, CheckSquare, Trash2 } from 'lucide-react';

export default function Checklist({ workOrderId }: { workOrderId: string }) {
    const supabase = createClient();
    const [activities, setActivities] = useState<any[]>([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, [workOrderId]);

    const fetchActivities = async () => {
        const { data } = await supabase
            .from('work_order_activities')
            .select('*')
            .eq('work_order_id', workOrderId)
            .order('created_at', { ascending: true });
        setActivities(data || []);
        setLoading(false);
    };

    const addItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const { error } = await supabase.from('work_order_activities').insert({
            work_order_id: workOrderId,
            description: newItem,
            is_completed: false
        });

        if (!error) {
            setNewItem('');
            fetchActivities();
        } else {
            alert('Error adding item');
        }
    };

    const toggleItem = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setActivities(prev => prev.map(a => a.id === id ? { ...a, is_completed: !currentStatus } : a));

        const { error } = await supabase
            .from('work_order_activities')
            .update({ is_completed: !currentStatus })
            .eq('id', id);

        if (error) fetchActivities(); // Revert on error
    };

    const deleteItem = async (id: string) => {
        const userConfirmed = window.confirm("Delete this task?");
        if (!userConfirmed) return;

        const { error } = await supabase.from('work_order_activities').delete().eq('id', id);
        if (!error) {
            setActivities(prev => prev.filter(a => a.id !== id));
        }
    };

    if (loading) return <div className="text-sm text-[hsl(var(--muted-foreground))]">Loading tasks...</div>;

    return (
        <div>
            <ul className="space-y-2 mb-4">
                {activities.length === 0 && (
                    <li className="text-sm text-[hsl(var(--muted-foreground))] italic text-center py-4">No tasks added yet.</li>
                )}
                {activities.map(activity => (
                    <li key={activity.id} className="flex items-start gap-3 p-2 hover:bg-[hsl(var(--muted))/50] rounded group transition-colors">
                        <button
                            onClick={() => toggleItem(activity.id, activity.is_completed)}
                            className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors
                            ${activity.is_completed ? 'bg-green-500 border-green-500 text-white' : 'border-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]'}`}
                        >
                            {activity.is_completed && <CheckSquare className="h-3 w-3" />}
                        </button>
                        <span className={`text-sm flex-1 ${activity.is_completed ? 'line-through text-[hsl(var(--muted-foreground))]' : ''}`}>
                            {activity.description}
                        </span>
                        <button onClick={() => deleteItem(activity.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </li>
                ))}
            </ul>

            <form onSubmit={addItem} className="flex gap-2">
                <input
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    placeholder="Add new task..."
                    className="flex-1 text-sm bg-transparent border-b border-[hsl(var(--card-border))] focus:border-[hsl(var(--primary))] outline-none py-1 transition-colors"
                />
                <button type="submit" disabled={!newItem.trim()} className="text-xs font-medium text-[hsl(var(--primary))] hover:underline disabled:opacity-50 uppercase tracking-wide">
                    Add
                </button>
            </form>
        </div>
    );
}
