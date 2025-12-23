'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

interface DownloadButtonProps {
    targetId: string
    fileName?: string
}

export default function DownloadAssessmentButton({ targetId, fileName = 'diagnostico_iso55000.pdf' }: DownloadButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDownload = async () => {
        setIsLoading(true)
        try {
            const input = document.getElementById(targetId)
            if (!input) {
                toast.error('No se pudo encontrar el contenido para generar el PDF')
                return
            }

            // Generate PNG using html-to-image to support modern CSS colors (lab, lch, etc)
            const dataUrl = await toPng(input, {
                pixelRatio: 2,
                cacheBust: true,
                backgroundColor: '#ffffff' // Ensure white background
            })

            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            })

            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()

            const imgProps = pdf.getImageProperties(dataUrl)
            const imgWidth = pdfWidth
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width

            let heightLeft = imgHeight
            let position = 0

            // Add first page
            pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pdfHeight

            // Add extra pages if needed
            while (heightLeft > 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pdfHeight
            }

            // Add ISO Legend Footer to every page
            const numberOfPages = pdf.getNumberOfPages();

            for (let i = 1; i <= numberOfPages; i++) {
                pdf.setPage(i)
                pdf.setFontSize(8)
                pdf.setTextColor(100)
                pdf.text(
                    'Cumpliendo con la Norma ISO 55000 - Gestión de Activos',
                    pdfWidth / 2,
                    pdfHeight - 10,
                    { align: 'center' }
                )
                pdf.text(
                    `Página ${i} de ${numberOfPages}`,
                    pdfWidth - 20,
                    pdfHeight - 10,
                    { align: 'right' }
                )
            }

            pdf.save(fileName)
            toast.success('PDF descargado correctamente')
        } catch (error) {
            console.error('Error generating PDF:', error)
            toast.error('Error al generar el PDF (Revisa la consola)')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isLoading}
            className="gap-2"
        >
            <Download className="h-4 w-4" />
            {isLoading ? 'Generando PDF...' : 'Descargar PDF ISO 55000'}
        </Button>
    )
}
