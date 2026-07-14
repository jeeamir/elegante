// Lightweight inline SVG icon set — consistent 24px stroke icons
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export const SparkleIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  </svg>
)

export const CameraIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 8a2 2 0 0 1 2-2h1.2a2 2 0 0 0 1.6-.8l.7-.9A2 2 0 0 1 11.1 3h1.8a2 2 0 0 1 1.6.8l.7.9a2 2 0 0 0 1.6.8H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
    <circle cx="12" cy="12.5" r="3.5" />
  </svg>
)

export const WardrobeIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 4a1.6 1.6 0 1 1 1.6-1.6" />
    <path d="M12 4v2" />
    <path d="M12 6L3.5 12.2a1 1 0 0 0 .6 1.8h15.8a1 1 0 0 0 .6-1.8L12 6z" />
    <path d="M6 14v6M18 14v6" />
  </svg>
)

export const ClockIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const LogoutIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M14 4h4a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 18 20h-4" />
    <path d="M10 8l-4 4 4 4M6 12h10" />
  </svg>
)

export const UploadIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 16V5M7.5 9.5L12 5l4.5 4.5" />
    <path d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
  </svg>
)

export const CheckIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export const ArrowRightIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </svg>
)

export const ChevronDownIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
)

export const PlusIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const XIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
