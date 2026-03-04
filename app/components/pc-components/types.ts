export type ComponentState = 'slotted' | 'dragging' | 'removed'

export interface PCComponentProps {
  onRemove: (id: string) => void
  removed: boolean
}

export type Criticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export interface ProjectInfo {
  title: string
  description: string
  tech: string[]
  screenshots: string[]
}

export interface BSODInfo {
  code: string
  message: string
  detail: string
  component: string
  criticality: Criticality
  project: ProjectInfo
}

// Criticality → screen color
export const CRITICALITY_COLOR: Record<Criticality, { bg: string; accent: string; label: string }> = {
  CRITICAL: { bg: '#1a0000', accent: '#ff2222', label: 'CRITICAL' },
  HIGH:     { bg: '#1a0800', accent: '#ff6600', label: 'HIGH' },
  MEDIUM:   { bg: '#1a1400', accent: '#ffcc00', label: 'MEDIUM' },
  LOW:      { bg: '#001a1a', accent: '#00aaff', label: 'LOW' },
}

export const BSOD_MAP: Record<string, BSODInfo> = {
  gpu: {
    code: '0x0000007E',
    component: 'GPU',
    criticality: 'HIGH',
    message: 'DISPLAY_DRIVER_REMOVED',
    detail: 'The display adapter has been physically disconnected. Windows cannot render any graphics without a GPU installed. You are somehow reading this without a display.',
    project: {
      title: 'Neon Dash',
      description: 'Synthwave endless runner built in Unity with smooth movement, scoring system and neon bloom visuals. This game runs entirely on GPU — no wonder it crashed.',
      tech: ['Unity', 'C#', 'URP', 'Bloom'],
      screenshots: ['/project1-1.png', '/project1-2.png'],
    },
  },
  ram: {
    code: '0x0000001A',
    component: 'RAM',
    criticality: 'MEDIUM',
    message: 'MEMORY_MANAGEMENT',
    detail: 'A fatal memory management error has occurred. One or more RAM sticks have been removed. The system cannot allocate memory for critical processes.',
    project: {
      title: 'React Dashboard',
      description: 'Admin dashboard with live charts, dark mode, and smooth animated transitions. RAM-hungry by design — it loads everything into memory at once.',
      tech: ['React', 'CSS', 'Anime.js'],
      screenshots: ['/project4-1.png', '/project4-2.png'],
    },
  },
  ram2: {
    code: '0x0000001B',
    component: 'RAM #2',
    criticality: 'LOW',
    message: 'DUAL_CHANNEL_BROKEN',
    detail: 'Second RAM stick removed. Dual channel memory mode disabled. System running in degraded single-channel mode with 50% memory bandwidth. Performance severely impacted.',
    project: {
      title: 'Portfolio Site',
      description: 'This very portfolio — Next.js, Three.js, interactive particles, draggable 3D shapes and a whole interactive PC build. Needs both sticks to run smoothly.',
      tech: ['Next.js', 'Three.js', 'TypeScript'],
      screenshots: ['/project3-1.png', '/project3-2.png'],
    },
  },
  cpu: {
    code: '0x000000FE',
    component: 'CPU',
    criticality: 'CRITICAL',
    message: 'CRITICAL_PROCESSOR_MISSING',
    detail: 'The central processing unit has been removed. No instructions can be executed. This is not a software problem — the brain of your computer is literally gone. How is this screen even on.',
    project: {
      title: 'Unity Prototype',
      description: 'Third-person prototype exploring movement feel, camera systems, and modular architecture. The CPU ran 10,000 physics calculations per second for this. Now it is gone.',
      tech: ['Unity', 'C#', 'Cinemachine'],
      screenshots: ['/project6-1.png', '/project6-2.png'],
    },
  },
  cooler: {
    code: '0x000000B4',
    component: 'CPU Cooler',
    criticality: 'HIGH',
    message: 'CPU_TEMPERATURE_CRITICAL',
    detail: 'Thermal protection engaged. CPU cooler removed — core temperature exceeded 110°C in 0.3 seconds. Emergency shutdown initiated to prevent permanent CPU damage.',
    project: {
      title: 'Pygame Platformer',
      description: 'Side-scrolling platformer in Python with tile-based maps, enemy AI, and collectibles. The CPU got so hot running the pathfinding algorithms that it needed two coolers.',
      tech: ['Python', 'Pygame'],
      screenshots: ['/project5-1.png', '/project5-2.png'],
    },
  },
  ssd: {
    code: '0x0000007B',
    component: 'SSD',
    criticality: 'LOW',
    message: 'BOOT_DEVICE_NOT_FOUND',
    detail: 'The boot device has been physically removed. Windows cannot find the drive containing the operating system. Please reinstall your storage device and stop touching things.',
    project: {
      title: 'Brick Breaker',
      description: 'Classic arcade reimagined with physics collisions, power-ups, and progressive difficulty. All 847 levels were stored on this SSD. They are gone now. Great job.',
      tech: ['Unity', 'C#', 'Game Physics'],
      screenshots: ['/project2-1.png', '/project2-2.png'],
    },
  },
  psu: {
    code: '0x000000A0',
    component: 'PSU',
    criticality: 'CRITICAL',
    message: 'POWER_SUPPLY_REMOVED',
    detail: 'Power supply unit disconnected. All system power has been cut. How are you even reading this? The PC should be completely off. This defies the laws of physics.',
    project: {
      title: 'Neon Dash 2',
      description: 'Sequel to Neon Dash with procedural level generation, online leaderboards and enhanced visuals. The PSU powered 3 monitors during development. Now it powers nothing.',
      tech: ['Unity', 'C#', 'Networking', 'URP'],
      screenshots: ['/project1-1.png', '/project1-2.png'],
    },
  },
}
