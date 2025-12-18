export type BlockId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface AssessmentQuestion {
    id: string;
    text: string;
    description?: string;
}

export interface AssessmentBlock {
    id: BlockId;
    title: string;
    objective: string;
    description: string;
    questions: AssessmentQuestion[];
    typicalEvidence: string;
}

export const ASSESSMENT_BLOCKS: AssessmentBlock[] = [
    {
        id: 'A',
        title: 'Contexto, alcance y “valor” del portafolio de activos',
        objective: 'Asegurar que la planta sabe qué activos gestiona, para qué y qué valor espera.',
        description: 'ISO +1',
        typicalEvidence: 'Mapa de procesos, lista de stakeholders, árbol de valor, matriz de criticidad, alcance documentado.',
        questions: [
            { id: 'A1', text: '¿Está definido el alcance del sistema de gestión de activos (áreas, líneas, utilities, flota, etc.)?' },
            { id: 'A2', text: '¿Se identifican partes interesadas (producción, mantenimiento, calidad, finanzas, seguridad, clientes) y sus necesidades?' },
            { id: 'A3', text: '¿Está claro qué significa “valor” en esta planta (OEE, seguridad, calidad, costo unitario, cumplimiento, energía)?' },
            { id: 'A4', text: '¿Hay criterios para priorizar activos (criticidad por seguridad/producción/calidad/costo)?' }
        ]
    },
    {
        id: 'B',
        title: 'Liderazgo y gobernanza',
        objective: 'Que haya dirección, roles, decisiones y reglas claras (no solo “Mantenimiento apaga fuegos”).',
        description: 'ISO +1',
        typicalEvidence: 'Política, organigrama/RACI, comité de activos, minutas, criterios de decisión.',
        questions: [
            { id: 'B1', text: '¿Existe una política (lineamientos) de gestión de activos comunicada?' },
            { id: 'B2', text: '¿Hay roles y responsabilidades claros (RACI) para decisiones CAPEX/OPEX, riesgos, cambios, paros?' },
            { id: 'B3', text: '¿Se asignan recursos (personas, presupuesto, tiempo) según criticidad y objetivos?' },
            { id: 'B4', text: '¿Se gobiernan los “trade-offs” costo–riesgo–desempeño explícitamente?' }
        ]
    },
    {
        id: 'C',
        title: 'Planeación: objetivos, riesgos y planes (SAMP / planes de activos)',
        objective: 'Convertir objetivos del negocio en objetivos de activos + planes.',
        description: 'ISO +1',
        typicalEvidence: 'Objetivos/KPIs, registro de riesgos, AMPs (asset management plans), planes de renovación, roadmap CAPEX.',
        questions: [
            { id: 'C1', text: '¿Hay objetivos de activos alineados a negocio (ej. disponibilidad, scrap, energía, seguridad)?' },
            { id: 'C2', text: '¿Se gestionan riesgos de activos (fallas críticas, seguridad, ambientales, obsolescencia)?' },
            { id: 'C3', text: '¿Existen planes por familia de activos (mantenimiento, renovación, refacciones, calibración, etc.)?' },
            { id: 'C4', text: '¿Se consideran decisiones de ciclo de vida (comprar-operar-mantener-renovar-retirar)?' }
        ]
    },
    {
        id: 'D',
        title: 'Información de activos y confiabilidad de datos (Asset Information)',
        objective: 'Que los datos permitan planear y controlar (sin “Excel tribal”).',
        description: 'ISO +1',
        typicalEvidence: 'CMMS, estructura de árbol de activos, diccionario de datos, catálogos, auditorías de datos.',
        questions: [
            { id: 'D1', text: '¿Hay registro maestro de activos (jerarquía, ubicación, fabricante, specs, repuestos)?' },
            { id: 'D2', text: '¿CMMS/EAM está actualizado y usado (OTs, historial, tiempos, costos)?' },
            { id: 'D3', text: '¿Calidad de datos medida (completitud, duplicados, codificación de fallas, catálogos)?' },
            { id: 'D4', text: '¿Existe gestión de documentos técnicos (planos, manuales, BOM, estándares) controlada?' }
        ]
    },
    {
        id: 'E',
        title: 'Competencia, cultura y soporte (personas, comunicación, proveedores)',
        objective: 'Capacidades y “forma de trabajar” consistente.',
        description: 'ISO +1',
        typicalEvidence: 'Skill matrix, estándares, rutinas LPA, SLAs, evaluación de proveedores.',
        questions: [
            { id: 'E1', text: '¿Matriz de competencias (técnicas y analíticas) y plan de capacitación por rol?' },
            { id: 'E2', text: '¿Estándares de trabajo (lubricación, PMs, inspecciones, arranques/paros)?' },
            { id: 'E3', text: '¿Comunicación formal entre producción-mantenimiento-calidad (reuniones, escalamiento)?' },
            { id: 'E4', text: '¿Proveedores/contratistas con evaluación de desempeño y control de calidad del servicio?' }
        ]
    },
    {
        id: 'F',
        title: 'Operación y control: ejecución de mantenimiento y cambios',
        objective: 'Pasar de reactivo a planeado/controlado.',
        description: 'ISO +1',
        typicalEvidence: 'Planes PM, rutas PdM, tablero semanal, backlog, proceso MOC, reportes de cumplimiento.',
        questions: [
            { id: 'F1', text: '¿Estrategia por activo (RCM/PMO básico): correctivo vs preventivo vs predictivo por criticidad?' },
            { id: 'F2', text: '¿Planeación y programación: % trabajo planeado, backlog (semanas), cumplimiento PM?' },
            { id: 'F3', text: '¿Gestión de cambios (MOC): cambios de parámetros, refacciones alternas, modificaciones mecánicas/eléctricas?' },
            { id: 'F4', text: '¿Control de terceros y actividades externalizadas con el mismo estándar?' }
        ]
    },
    {
        id: 'G',
        title: 'Desempeño: medición, auditoría y revisión por la dirección',
        objective: 'Medir, aprender y corregir rumbo.',
        description: 'ISO +1',
        typicalEvidence: 'Tablero KPI, A3/RCA, reportes de auditoría, minutas de revisión gerencial.',
        questions: [
            { id: 'G1', text: '¿KPIs definidos con meta, dueño y rutina (ej. disponibilidad, MTBF, MTTR, costo mantto/ventas, PM compliance)?' },
            { id: 'G2', text: '¿Análisis de causa raíz (RCA) para fallas repetitivas y paros mayores?' },
            { id: 'G3', text: '¿Auditorías internas o revisiones periódicas del sistema?' },
            { id: 'G4', text: '¿Revisión de dirección: decisiones y acciones basadas en datos?' }
        ]
    },
    {
        id: 'H',
        title: 'Mejora y sostenibilidad del sistema',
        objective: 'Que la mejora sea parte del sistema, no un evento.',
        description: 'ISO +1',
        typicalEvidence: 'CAPA, pipeline de mejoras, before/after, estandarización, beneficios validados.',
        questions: [
            { id: 'H1', text: '¿Gestión de no conformidades/incidentes con acciones correctivas/preventivas (CAPA)?' },
            { id: 'H2', text: '¿Portafolio de mejoras priorizado por valor (costo-riesgo-desempeño)?' },
            { id: 'H3', text: '¿Lecciones aprendidas se estandarizan (actualizan PMs, repuestos, parámetros, entrenamiento)?' },
            { id: 'H4', text: '¿Se mide el beneficio real (ahorros, reducción paros, seguridad, calidad)?' }
        ]
    }
];
