/** Formatea un monto en pesos chilenos. */
export function formatCLP(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export const IVA_RATE = 0.19

/** Agrega IVA a un valor neto. */
export function addIVA(net: number): number {
  return net * (1 + IVA_RATE)
}

/** Extrae el neto de un valor con IVA incluido. */
export function netFromGross(gross: number): number {
  return gross / (1 + IVA_RATE)
}

export function formatRut(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase()
  if (clean.length < 2) return clean
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  const withDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${withDots}-${dv}`
}
