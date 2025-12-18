'use client'

import { AssessmentBlock as BlockType, AssessmentQuestion } from '@/lib/assessment-data'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AssessmentBlockProps {
    block: BlockType
    answers: Record<string, any>
    onChange: (questionId: string, field: 'score' | 'evidence', value: any) => void
}

const SCALE_DESC = [
    { val: 0, label: 'No existe', desc: 'Desconocido', color: 'bg-red-100 text-red-700 border-red-200' },
    { val: 1, label: 'Informal', desc: 'Ad-hoc, depende de personas', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { val: 2, label: 'Básico', desc: 'Repetible pero incompleto', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { val: 3, label: 'Estandarizado', desc: 'Documentado y desplegado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { val: 4, label: 'Optimizado', desc: 'Gestionado, KPIs, mejora continua', color: 'bg-green-100 text-green-700 border-green-200' },
]

export default function AssessmentBlock({ block, answers, onChange }: AssessmentBlockProps) {
    return (
        <div className="space-y-6">
            {block.questions.map((q) => {
                const answer = answers[q.id] || {}
                const currentScore = answer.score

                return (
                    <Card key={q.id} className="overflow-hidden border-l-4 border-l-primary/20">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <h4 className="font-semibold text-lg mb-1 flex items-start gap-2">
                                    <span className="text-muted-foreground text-sm mt-1 min-w-[24px]">{q.id}.</span>
                                    {q.text}
                                </h4>
                                {q.description && (
                                    <p className="text-sm text-muted-foreground ml-8">{q.description}</p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 ml-8">
                                <div className="space-y-3">
                                    <Label>Nivel de Madurez (0-4)</Label>
                                    <div className="grid gap-2">
                                        {SCALE_DESC.map((level) => (
                                            <button
                                                key={level.val}
                                                onClick={() => onChange(q.id, 'score', level.val)}
                                                className={cn(
                                                    "flex items-center p-2 rounded-md border text-left transition-all hover:shadow-sm",
                                                    currentScore === level.val
                                                        ? `ring-2 ring-primary ${level.color}`
                                                        : "hover:bg-muted/50 border-transparent bg-muted/20"
                                                )}
                                            >
                                                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 border bg-white shrink-0",
                                                    currentScore === level.val ? "border-primary text-primary" : "text-muted-foreground"
                                                )}>
                                                    {level.val}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{level.label}</div>
                                                    <div className="text-xs opacity-80">{level.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Evidencia / Comentarios</Label>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Info className="w-3 h-3 mr-1" /> Requerido para puntajes {'>'} 1
                                        </div>
                                    </div>
                                    <Textarea
                                        placeholder="Describe la evidencia, documentos o situación actual..."
                                        className="h-full min-h-[160px] resize-none"
                                        value={answer.evidence || ''}
                                        onChange={(e) => onChange(q.id, 'evidence', e.target.value)}
                                    />
                                    {currentScore > 1 && (!answer.evidence || answer.evidence.length < 5) && (
                                        <p className="text-xs text-orange-600 font-medium">
                                            ⚠️ Se recomienda agregar evidencia para justificar este nivel.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
