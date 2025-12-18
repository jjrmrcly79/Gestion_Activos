'use client'

import { useState } from 'react'
import { ASSESSMENT_BLOCKS, BlockId } from '@/lib/assessment-data'
import AssessmentBlock from '@/components/assessment/AssessmentBlock'
import AssessmentReport from '@/components/assessment/AssessmentReport'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Save, CheckCircle } from 'lucide-react'
import { saveBlockAnswers, completeAssessment } from '../actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AssessmentRunnerProps {
    assessment: any
    initialAnswers: any[]
}

export default function AssessmentRunner({ assessment, initialAnswers }: AssessmentRunnerProps) {
    const router = useRouter()
    // Determine initial step: find first block without full answers? Or just start at A?
    // For simplicity, let's start at A or where they left off if we implemented that.
    // We can default to 'A'.

    const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>(
        initialAnswers.reduce((acc, curr) => ({
            ...acc,
            [curr.question_id]: curr
        }), {})
    )
    const [showReport, setShowReport] = useState(assessment.status === 'completed')
    const [isSaving, setIsSaving] = useState(false)

    const currentBlock = ASSESSMENT_BLOCKS[currentBlockIndex]
    const isFirstBlock = currentBlockIndex === 0
    const isLastBlock = currentBlockIndex === ASSESSMENT_BLOCKS.length - 1

    const progress = ((currentBlockIndex + (showReport ? 1 : 0)) / (ASSESSMENT_BLOCKS.length + 1)) * 100

    // Handle local state update from AssessmentBlock
    const handleAnswerChange = (questionId: string, field: 'score' | 'evidence', value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                question_id: questionId,
                [field]: value
            }
        }))
    }

    // Get current block answers to save
    const getCurrentBlockAnswers = () => {
        return currentBlock.questions.map(q => {
            const ans = answers[q.id] || {}
            return {
                question_id: q.id,
                score: ans.score ?? 0, // Default to 0 if not set? Or require it? User said 0=No exists.
                evidence: ans.evidence || ''
            }
        })
    }

    const handleSave = async (silent = false) => {
        setIsSaving(true)
        try {
            const blockAnswers = getCurrentBlockAnswers()
            await saveBlockAnswers(assessment.id, currentBlock.id, blockAnswers)
            if (!silent) toast.success('Progreso guardado')
        } catch (error) {
            toast.error('Error al guardar')
        } finally {
            setIsSaving(false)
        }
    }

    const handleNext = async () => {
        await handleSave(true) // Save before moving
        if (isLastBlock) {
            // Mark as completed? Or just show report?
            // For now show report
            setShowReport(true)
        } else {
            setCurrentBlockIndex(prev => prev + 1)
            window.scrollTo(0, 0)
        }
    }

    const handlePrevious = () => {
        if (showReport) {
            setShowReport(false)
        } else if (!isFirstBlock) {
            setCurrentBlockIndex(prev => prev - 1)
            window.scrollTo(0, 0)
        }
    }

    const handleFinish = async () => {
        setIsSaving(true)
        try {
            await completeAssessment(assessment.id)
            toast.success('Diagnóstico finalizado')
            router.refresh()
        } catch (error) {
            toast.error('Error al finalizar')
        } finally {
            setIsSaving(false)
        }
    }

    if (showReport) {
        return (
            <div className="space-y-6 container mx-auto py-6 max-w-6xl">
                <div className="flex items-center justify-between print:hidden">
                    <Button variant="outline" onClick={handlePrevious}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Volver a editar
                    </Button>
                    {assessment.status !== 'completed' && (
                        <Button onClick={handleFinish} disabled={isSaving}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Finalizar Diagnóstico
                        </Button>
                    )}
                </div>
                <AssessmentReport answers={Object.values(answers)} />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-4xl space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progreso</span>
                    <span>Bloque {currentBlockIndex + 1} de {ASSESSMENT_BLOCKS.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-primary">Bloque {currentBlock.id}: {currentBlock.title}</h2>
                <div className="text-sm px-3 py-1 bg-muted rounded-full font-medium">
                    {currentBlock.description}
                </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Objetivo</h3>
                <p className="text-sm text-muted-foreground">{currentBlock.objective}</p>
                <h3 className="font-semibold mt-4 mb-2">Evidencias Típicas</h3>
                <p className="text-sm text-muted-foreground">{currentBlock.typicalEvidence}</p>
            </div>

            <AssessmentBlock
                block={currentBlock}
                answers={answers}
                onChange={handleAnswerChange}
            />

            <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={handlePrevious} disabled={isFirstBlock}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                </Button>

                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleSave()} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" /> {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button onClick={handleNext}>
                        {isLastBlock ? 'Ver Resultados' : 'Siguiente'} <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
