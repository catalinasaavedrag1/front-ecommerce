import type { ReactNode } from 'react'

export type CmsIconName =
  | 'dashboard' | 'home' | 'landing' | 'sections' | 'banner' | 'media' | 'product'
  | 'carousel' | 'faq' | 'menu' | 'mega' | 'footer' | 'seo' | 'campaign' | 'calendar'
  | 'experiment' | 'segment' | 'rules' | 'preview' | 'approval' | 'version' | 'audit'
  | 'performance' | 'permission' | 'settings' | 'published'
  | 'plus' | 'export' | 'save' | 'apply' | 'cancel' | 'check' | 'search' | 'filter'
  | 'refresh' | 'sort' | 'trash' | 'edit' | 'chevron' | 'dots' | 'warning' | 'clock'
  | 'eye' | 'upload' | 'external' | 'bell' | 'drag' | 'logo' | 'copy' | 'image' | 'device'

const paths: Record<CmsIconName, ReactNode> = {
  logo: <><path d="M7 15a5 5 0 0 1 .5-9.9A6 6 0 0 1 19 7a4 4 0 0 1-.5 8H7Z" /><path d="M8 19a4 4 0 0 0 8 0" /></>,
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.4" /><rect x="14" y="3" width="7" height="5" rx="1.4" /><rect x="14" y="12" width="7" height="9" rx="1.4" /><rect x="3" y="16" width="7" height="5" rx="1.4" /></>,
  home: <><path d="M3 11 12 4l9 7" /><path d="M5 10v9h14v-9" /><path d="M10 19v-5h4v5" /></>,
  landing: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M7 13h7M7 16h10" /></>,
  sections: <><rect x="3" y="4" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="16" width="18" height="4" rx="1" /></>,
  banner: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="m4 17 5-4 4 3 3-2 4 3" /></>,
  media: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.6" /><path d="m3 17 5-4 4 3 3-2 6 4" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.6" /><path d="m3 17 5-4 4 3 3-2 6 4" /></>,
  product: <><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
  carousel: <><rect x="7" y="6" width="10" height="12" rx="1.5" /><path d="M4 8v8M20 8v8" /></>,
  faq: <><path d="M4 5h16v11H9l-4 4v-4H4z" /><path d="M9.2 9a2.5 2.5 0 1 1 3.3 2.4c-.7.3-1 .8-1 1.6" /><path d="M11.5 15h.01" /></>,
  menu: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  mega: <><rect x="3" y="4" width="18" height="5" rx="1.4" /><rect x="3" y="11" width="8" height="9" rx="1.4" /><rect x="13" y="11" width="8" height="9" rx="1.4" /></>,
  footer: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 15h18" /><path d="M7 18h4" /></>,
  seo: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /><path d="M8.5 11.5 11 14l4.5-4.5" /></>,
  campaign: <><path d="M4 9v6l12 5V4L4 9Z" /><path d="M16 8a4 4 0 0 1 0 8" /><path d="M6 15v3a2 2 0 0 0 4 0" /></>,
  calendar: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
  experiment: <><path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-5-8V3" /><path d="M7.5 14h9" /></>,
  segment: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5a3.2 3.2 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" /></>,
  rules: <><path d="M4 6h10M4 12h16M4 18h7" /><circle cx="18" cy="6" r="2" /><circle cx="15" cy="18" r="2" /></>,
  preview: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  approval: <><path d="M9 12l2 2 4-4" /><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6z" /></>,
  version: <><path d="M3 7v6h6" /><path d="M3 13a9 9 0 1 0 3-7.7L3 8" /><path d="M12 8v4l3 2" /></>,
  audit: <><path d="M6 2h9l4 4v16H6z" /><path d="M14 2v4h4" /><path d="M9 12l1.5 1.5L13 11M9 17h6" /></>,
  performance: <><path d="M4 19a8 8 0 1 1 16 0" /><path d="M12 15l4-4" /><path d="M12 19v.01" /></>,
  permission: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 13a1.6 1.6 0 0 0 .3 1.8 2 2 0 1 1-2.8 2.8 1.6 1.6 0 0 0-2.7 1.1 2 2 0 1 1-4 0A1.6 1.6 0 0 0 6.6 19a2 2 0 1 1-2.8-2.8A1.6 1.6 0 0 0 3 13.4a2 2 0 1 1 0-4A1.6 1.6 0 0 0 4.6 6.8 2 2 0 1 1 7.4 4a1.6 1.6 0 0 0 2.6-1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 2 2 0 1 1 2.8 2.8A1.6 1.6 0 0 0 21 10a2 2 0 1 1 0 4Z" /></>,
  published: <><path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  export: <><path d="M12 15V4" /><path d="m8 8 4-4 4 4" /><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /></>,
  save: <><path d="M5 4h11l3 3v13H5z" /><path d="M8 4v5h7V4" /><rect x="8" y="13" width="8" height="7" /></>,
  apply: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  cancel: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  check: <path d="m4 12 5 5L20 6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></>,
  filter: <path d="M3 5h18l-7 8v6l-4-2v-4z" />,
  refresh: <><path d="M20 11a8 8 0 1 0-1.5 5" /><path d="M20 5v6h-6" /></>,
  sort: <><path d="M7 4v16M7 20l-3-3M7 4l3 3" /><path d="M17 4v16M17 20l3-3M17 4l-3 3" /></>,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>,
  edit: <><path d="M4 20h4L18 10l-4-4L4 16z" /><path d="m14 6 4 4" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  dots: <><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></>,
  warning: <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v5M12 18h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 20h16" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
  drag: <><circle cx="9" cy="6" r="1.3" /><circle cx="15" cy="6" r="1.3" /><circle cx="9" cy="12" r="1.3" /><circle cx="15" cy="12" r="1.3" /><circle cx="9" cy="18" r="1.3" /><circle cx="15" cy="18" r="1.3" /></>,
  copy: <><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></>,
  device: <><rect x="3" y="4" width="14" height="11" rx="1.5" /><path d="M3 18h14" /><rect x="16" y="9" width="5" height="11" rx="1.5" /></>,
}

export function CmsIcon({ name, className }: { name: CmsIconName; className?: string }) {
  return (
    <svg className={`jc-ic ${className ?? ''}`} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
