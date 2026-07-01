/** Simula una request async a un microservicio (mientras no hay backend real). */
export function simulateRequest<T>(data: T, delay = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}
