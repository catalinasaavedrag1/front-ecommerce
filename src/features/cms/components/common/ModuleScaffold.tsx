import { MODULES } from '@/features/cms/constants'
import { CmsIcon, PageHeader, SectionHeader } from '@/features/cms/components/ui'

/** Vista enterprise para módulos cuyo detalle profundo llega en una iteración
 *  posterior: muestra propósito, capacidades planificadas e iteración objetivo. */
export function ModuleScaffold({ moduleKey }: { moduleKey: string }) {
  const m = MODULES[moduleKey]
  if (!m) return <PageHeader title="Módulo" subtitle="Sin metadata" />

  return (
    <div>
      <PageHeader
        eyebrow={m.eyebrow}
        title={m.title}
        subtitle={m.description}
        actions={<span className="jc-iter"><CmsIcon name="clock" /> Iteración {m.iteration}</span>}
      />
      <SectionHeader icon="dashboard" label="Capacidades del módulo" />
      <div className="jc-scaffold__caps">
        {m.capabilities.map((c) => (
          <div className="jc-cap" key={c}>
            <span className="jc-cap__ic"><CmsIcon name="check" /></span>
            {c}
          </div>
        ))}
      </div>
    </div>
  )
}
