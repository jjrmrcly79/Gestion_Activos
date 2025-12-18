'use client';

import { useState } from 'react';
import { Target, AlertTriangle, Plus } from 'lucide-react';
import AddObjectiveModal from './AddObjectiveModal';
import AssessRiskModal from './AssessRiskModal';

interface StrategicActionsProps {
    planId: string;
    type: 'objective' | 'risk';
}

export default function StrategicActions({ planId, type }: StrategicActionsProps) {
    const [isObjOpen, setIsObjOpen] = useState(false);
    const [isRiskOpen, setIsRiskOpen] = useState(false);

    if (type === 'objective') {
        return (
            <>
                <button
                    onClick={() => setIsObjOpen(true)}
                    className="block mx-auto mt-2 text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add Objective
                </button>
                <AddObjectiveModal
                    planId={planId}
                    isOpen={isObjOpen}
                    onClose={() => setIsObjOpen(false)}
                />
            </>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsRiskOpen(true)}
                className="block mx-auto mt-2 text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
            >
                <Plus className="h-4 w-4" />
                Assess Risks
            </button>
            <AssessRiskModal
                planId={planId}
                isOpen={isRiskOpen}
                onClose={() => setIsRiskOpen(false)}
            />
        </>
    );
}
