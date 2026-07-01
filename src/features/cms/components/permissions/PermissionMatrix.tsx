'use client'

import { permissions } from '@/features/cms/mocks'
import { ROLE_LABEL } from '@/features/cms/constants'
import type { CmsRole } from '@/features/cms/types'
import { Button, CmsIcon, PageHeader } from '@/features/cms/components/ui'

const ROLES = Object.keys(ROLE_LABEL) as CmsRole[]

export function PermissionMatrix() {
  return (
    <div>
      <PageHeader eyebrow="Gobierno" title="Permisos" subtitle="Matriz de permisos por rol (Admin, Marketing, Comercial Web, SEO, Diseño, Aprobador, Solo lectura)." actions={<Button variant="green" icon="save">Guardar cambios</Button>} />
      <div className="jc-card" style={{ overflowX: 'auto' }}>
        <table className="jc-matrix">
          <thead>
            <tr>
              <th className="jc-matrix__perm">Permiso</th>
              {ROLES.map((r) => <th key={r}>{ROLE_LABEL[r]}</th>)}
            </tr>
          </thead>
          <tbody>
            {permissions.map((p) => (
              <tr key={p.key}>
                <td className="jc-matrix__perm"><strong>{p.label}</strong><span className="jc-mono">{p.key}</span></td>
                {ROLES.map((r) => (
                  <td key={r} className="jc-matrix__cell">
                    {p.roles.includes(r) ? <span className="jc-check"><CmsIcon name="check" /></span> : <span className="jc-dash">–</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
