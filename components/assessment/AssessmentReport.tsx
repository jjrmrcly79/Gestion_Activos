'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ASSESSMENT_BLOCKS } from '@/lib/assessment-data'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

const DownloadAssessmentButton = dynamic(
    () => import('@/app/dashboard/assessment/[id]/DownloadButton'),
    { ssr: false }
)

interface AssessmentReportProps {
    answers: any[]
}

export default function AssessmentReport({ answers }: AssessmentReportProps) {
    // --- Calculation Logic ---
    const validAnswers = answers.filter(a => a && a.score !== undefined)
    const answersMap = validAnswers.reduce((acc, curr) => ({ ...acc, [curr.question_id]: curr }), {})

    const blockScores = ASSESSMENT_BLOCKS.map(block => {
        const blockAnswers = block.questions.map(q => answersMap[q.id] || { score: 0 })
        const totalScore = blockAnswers.reduce((sum: number, a: any) => sum + (a.score || 0), 0)
        const maxScore = block.questions.length * 4
        const average = totalScore / block.questions.length
        const percentage = (totalScore / maxScore) * 100

        return {
            ...block,
            average,
            percentage,
            questions: block.questions.map(q => ({
                ...q,
                score: answersMap[q.id]?.score || 0,
                evidence: answersMap[q.id]?.evidence
            }))
        }
    })

    const overallScore = blockScores.reduce((sum, b) => sum + b.average, 0) / blockScores.length

    // Quick Wins: Low score (0-1) but high impact/easy to fix? 
    // For now, just listing lowest scores as gaps.
    const allQuestions = blockScores.flatMap(b => b.questions.map(q => ({ ...q, blockId: b.id, blockTitle: b.title })))
    const topGaps = [...allQuestions].sort((a, b) => a.score - b.score).filter(q => q.score < 3).slice(0, 10)

    // Roadmap Logic (Simple)
    // 0-30 days: Focus on Gaps with score 0-1
    // 31-90 days: Focus on score 2 -> 3
    // 6-12 months: Optimization 3 -> 4
    const roadmapShortTerm = topGaps.filter(q => q.score <= 1)
    const roadmapMidTerm = topGaps.filter(q => q.score === 2)

    return (
        <div id="assessment-report-content" className="space-y-8 animate-in fade-in duration-500 print:space-y-4 print:p-0 bg-white p-4">

            {/* Header Summary */}
            <div className="grid md:grid-cols-3 gap-6 print:block">
                <Card className="md:col-span-2 print:shadow-none print:border-none">
                    <CardHeader className="print:px-0">
                        <CardTitle className="print:text-2xl">Resumen General de Madurez</CardTitle>
                        <CardDescription>Promedio global de la planta</CardDescription>
                    </CardHeader>
                    <CardContent className="print:px-0">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-bold text-primary print:text-black">{overallScore.toFixed(1)}</div>
                            <div className="space-y-1 flex-1">
                                <div className="flex justify-between text-sm">
                                    <span>Nivel actual</span>
                                    <span className="font-medium text-primary print:text-black">
                                        {overallScore < 1.0 ? 'Inicial / Reactivo' :
                                            overallScore < 2.5 ? 'Básico / En Desarrollo' :
                                                overallScore < 3.5 ? 'Estandarizado' : 'Optimizado'}
                                    </span>
                                </div>
                                <Progress value={(overallScore / 4) * 100} className="h-3 print:border print:border-gray-300" />
                                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                    <span>0.0</span>
                                    <span>4.0</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="print:hidden">
                    <CardHeader>
                        <CardTitle>Acciones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">

                        <DownloadAssessmentButton targetId="assessment-report-content" />
                    </CardContent>
                </Card>
            </div>

            {/* Heatmap */}
            <Card className="print:shadow-none print:border-none print:break-inside-avoid">
                <CardHeader className="print:px-0">
                    <CardTitle>Heatmap por Bloques</CardTitle>
                    <CardDescription>Nivel de madurez promedio por área de gestión</CardDescription>
                </CardHeader>
                <CardContent className="print:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
                        {blockScores.map(block => (
                            <div key={block.id} className="border rounded-lg p-4 flex flex-col justify-between hover:bg-muted/30 transition-colors print:border-gray-300">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-lg text-primary print:text-black">{block.id}</span>
                                        <div className={`px-2 py-1 rounded text-xs font-bold ${block.average < 1.5 ? 'bg-red-100 text-red-700' :
                                            block.average < 2.5 ? 'bg-yellow-100 text-yellow-700' :
                                                block.average < 3.5 ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                            } print:bg-gray-100 print:text-black print:border`}>
                                            {block.average.toFixed(1)}
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-medium leading-tight mb-2 min-h-[40px] print:min-h-0">{block.title}</h4>
                                </div>
                                <Progress value={block.percentage} className={`h-2 mt-2 ${block.average < 1.5 ? 'bg-red-100 [&>div]:bg-red-500' :
                                    block.average < 2.5 ? 'bg-yellow-100 [&>div]:bg-yellow-500' :
                                        block.average < 3.5 ? 'bg-blue-100 [&>div]:bg-blue-500' :
                                            'bg-green-100 [&>div]:bg-green-500'
                                    } print:border print:border-gray-300`} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Gaps & Roadmap */}
            <div className="grid md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
                <Card className="border-l-4 border-l-red-500 print:shadow-none print:border print:border-gray-300 print:break-inside-avoid">
                    <CardHeader className="print:px-4 print:py-2">
                        <CardTitle className="flex items-center gap-2 print:text-lg">
                            <AlertCircle className="h-5 w-5 text-red-500" /> Top 10 Brechas Críticas
                        </CardTitle>
                        <CardDescription>Puntos con menor calificación (Riesgos)</CardDescription>
                    </CardHeader>
                    <CardContent className="print:px-4">
                        <ul className="space-y-3 print:space-y-1">
                            {topGaps.length === 0 ? (
                                <p className="text-muted-foreground">¡Excelente! No se encontraron brechas críticas (score {'<'} 3).</p>
                            ) : (
                                topGaps.map((q, i) => (
                                    <li key={i} className="text-sm pb-2 border-b last:border-0 print:border-gray-100">
                                        <span className="font-bold text-red-600 mr-2 print:text-black">{q.score.toFixed(0)}/4</span>
                                        <span className="font-medium">[{q.blockId}]</span> {q.text}
                                    </li>
                                ))
                            )}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 print:shadow-none print:border print:border-gray-300 print:break-inside-avoid">
                    <CardHeader className="print:px-4 print:py-2">
                        <CardTitle className="flex items-center gap-2 print:text-lg">
                            <TrendingUp className="h-5 w-5 text-blue-500" /> Roadmap Sugerido
                        </CardTitle>
                        <CardDescription>Plan de acción priorizado</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 print:px-4 print:space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2 text-green-700 print:text-black">Inmediato (0-30 días) - Quick Wins</h4>
                            {roadmapShortTerm.length > 0 ? (
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {roadmapShortTerm.slice(0, 3).map((q, i) => (
                                        <li key={i}>Documentar/Definir: {q.text.substring(0, 60)}...</li>
                                    ))}
                                    {roadmapShortTerm.length > 3 && <li>... y {roadmapShortTerm.length - 3} más.</li>}
                                </ul>
                            ) : <p className="text-sm text-muted-foreground">No hay acciones urgentes.</p>}
                        </div>

                        <div>
                            <h4 className="font-semibold text-sm mb-2 text-blue-700 print:text-black">Corto Plazo (30-90 días) - Sistematizar</h4>
                            {roadmapMidTerm.length > 0 ? (
                                <ul className="list-disc pl-5 text-sm space-y-1">
                                    {roadmapMidTerm.slice(0, 3).map((q, i) => (
                                        <li key={i}>Mejorar/Desplegar: {q.text.substring(0, 60)}...</li>
                                    ))}
                                    {roadmapMidTerm.length > 3 && <li>... y {roadmapMidTerm.length - 3} más.</li>}
                                </ul>
                            ) : <p className="text-sm text-muted-foreground">Continuar con mejora continua.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Printable Legend */}
            <div className="hidden print:block text-center text-sm text-gray-500 mt-8 pt-4 border-t">
                <p>Cumpliendo con la Norma ISO 55000 - Gestión de Activos</p>
                <p className="text-xs mt-1">{new Date().toLocaleDateString()}</p>
            </div>
        </div>
    )
}
