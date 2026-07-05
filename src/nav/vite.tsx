/**
 * Implementación VITE del shim '@/nav': re-exporta react-router-dom.
 * vite.config.ts aliasa '@/nav' → este archivo; bajo Next (y para tsc) el
 * default es src/nav/index.tsx (next/link + next/navigation).
 */
export {
  Link,
  NavLink,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
