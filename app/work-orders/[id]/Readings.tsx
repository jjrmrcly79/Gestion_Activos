'use client';

import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { Gauge, Save } from 'lucide-react';

export default function Readings({ workOrderId, assetId }: { workOrderId: string, assetId: string }) {
    const supabase = createClient();
    const [points, setPoints] = useState<any[]>([]);
    const [readings, setReadings] = useState<Record<string, string>>({}); // point_id -> value
    const [previousReadings, setPreviousReadings] = useState<any[]>([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            // 1. Get Points for this Asset
            const { data: pts } = await supabase.from('measurement_points').select('*').eq('asset_id', assetId);
            setPoints(pts || []);

            // 2. Get existing readings for this WO
            const { data: rds } = await supabase.from('measurement_readings').select('*').eq('work_order_id', workOrderId);
            setPreviousReadings(rds || []);
        };
        if (assetId) fetchData();
    }, [assetId, workOrderId]);


    const handleSave = async (pointId: string, min: number | null, max: number | null, name: string) => {
        const valStr = readings[pointId];
        if (!valStr) return;
        const val = parseFloat(valStr);

        // 1. Save Reading
        const { error } = await supabase.from('measurement_readings').insert({
            measurement_point_id: pointId,
            work_order_id: workOrderId,
            value: val
        });

        if (!error) {
            setMsg('Saved!');

            // 2. Check Limits & Create Alert
            let alertMsg = '';
            if (max !== null && val > max) alertMsg = `Value ${val} exceeds MAX limit (${max}) for ${name}`;
            if (min !== null && val < min) alertMsg = `Value ${val} is below MIN limit (${min}) for ${name}`;

            if (alertMsg) {
                await supabase.from('alerts').insert({
                    asset_id: assetId,
                    work_order_id: workOrderId,
                    measurement_point_id: pointId,
                    description: alertMsg,
                    severity: 'high'
                });
                alert(`⚠️ ALERT GENERATED: ${alertMsg}`);
            }

            setTimeout(() => setMsg(''), 2000);
            // Refresh list
            const { data: rds } = await supabase.from('measurement_readings').select('*').eq('work_order_id', workOrderId);
            setPreviousReadings(rds || []);
            // Clear input
            setReadings(prev => ({ ...prev, [pointId]: '' }));
        } else {
            alert('Error saving reading');
        }
    };

    if (points.length === 0) return (
        <div className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4 bg-[hsl(var(--muted))/30] rounded-md border border-dashed">
            No measurement points defined for this asset.
        </div>
    );

    return (
        <div className="space-y-4">
            {points.map(pt => {
                const lastReading = previousReadings.filter(r => r.measurement_point_id === pt.id).sort((a, b) => new Date(b.captured_at).getTime() - new Date(a.captured_at).getTime())[0];

                return (
                    <div key={pt.id} className="bg-[hsl(var(--muted))/30] p-3 rounded-md border border-[hsl(var(--card-border))]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm flex items-center gap-1">
                                <Gauge className="h-3 w-3 text-[hsl(var(--primary))]" />
                                {pt.name}
                            </span>
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                Limits: {pt.min_value ?? '-'} / {pt.max_value ?? '-'} {pt.unit}
                            </span>
                        </div>

                        {lastReading ? (
                            <div className="text-xs text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                                Last: <strong>{lastReading.value} {pt.unit}</strong>
                            </div>
                        ) : (
                            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Pending reading...</div>
                        )}

                        <div className="flex gap-2">
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Value"
                                className="w-24 p-1 text-sm border rounded bg-[hsl(var(--background))]"
                                value={readings[pt.id] || ''}
                                onChange={e => setReadings({ ...readings, [pt.id]: e.target.value })}
                            />
                            <button
                                onClick={() => handleSave(pt.id, pt.min_value, pt.max_value, pt.name)}
                                disabled={!readings[pt.id]}
                                className="p-1 px-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded text-xs hover:opacity-90 disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                );
            })}
            {msg && <p className="text-xs text-green-600 text-right">{msg}</p>}
        </div>
    );
}
