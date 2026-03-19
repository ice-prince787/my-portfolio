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
      title: 'BoXeS',
      description: 'A game of dodging boxes — you ARE a box. Three levels of pure player movement in Unity using C#. Simple concept, surprisingly addictive.',
      tech: ['Unity', 'C#'],
      screenshots: ['/project-boxes-1.png', '/project-boxes-2.png'],
    },
  },
  ram: {
    code: '0x0000001A',
    component: 'RAM',
    criticality: 'MEDIUM',
    message: 'MEMORY_MANAGEMENT',
    detail: 'A fatal memory management error has occurred. RAM stick removed. The system cannot allocate memory for critical processes.',
    project: {
      title: 'Study Timer',
      description: 'A normal Pomodoro timer to study — but pixelated. Built to make study sessions actually feel fun with a retro aesthetic.',
      tech: ['React', 'CSS', 'JavaScript'],
      screenshots: ['/project-timer-1.png', '/project-timer-2.png'],
    },
  },
  ram2: {
    code: '0x0000001B',
    component: 'RAM #2',
    criticality: 'LOW',
    message: 'DUAL_CHANNEL_BROKEN',
    detail: 'Second RAM stick removed. Dual channel disabled. System degraded to single-channel mode with 50% memory bandwidth. Performance severely impacted.',
    project: {
      title: 'Portfolio',
      description: 'This very portfolio you are looking at right now. Built with Next.js, Three.js, interactive particles, a draggable wrench, and a whole interactive PC build. Very meta.',
      tech: ['Next.js', 'Three.js', 'TypeScript', 'CSS'],
      screenshots: ['/project-portfolio-1.png', '/project-portfolio-2.png'],
    },
  },
  cpu: {
    code: '0x000000FE',
    component: 'CPU',
    criticality: 'CRITICAL',
    message: 'CRITICAL_PROCESSOR_MISSING',
    detail: 'The central processing unit has been removed. No instructions can be executed. This is not a software problem — the brain of your computer is literally gone.',
    project: {
      title: 'UFO Adventures',
      description: 'Flappy Bird type game set in space — shoot asteroids, dodge obstacles, survive the void. Built in Unity with C#. The CPU was working overtime running collision detection.',
      tech: ['Unity', 'C#'],
      screenshots: ['/project-ufo-1.png', '/project-ufo-2.png'],
    },
  },
  cooler: {
    code: '0x000000B4',
    component: 'CPU Cooler',
    criticality: 'HIGH',
    message: 'CPU_TEMPERATURE_CRITICAL',
    detail: 'Thermal protection engaged. CPU cooler removed — core temperature exceeded 110°C in 0.3 seconds. Emergency shutdown initiated to prevent permanent CPU damage.',
    project: {
      title: 'UFO Adventures',
      description: 'Flappy Bird type game set in space — shoot asteroids, dodge obstacles, survive the void. Built in Unity with C#. The CPU got so hot running AI that it needed extra cooling.',
      tech: ['Unity', 'C#'],
      screenshots: ['/project-ufo-1.png', '/project-ufo-2.png'],
    },
  },
  ssd: {
    code: '0x0000007B',
    component: 'SSD',
    criticality: 'LOW',
    message: 'BOOT_DEVICE_NOT_FOUND',
    detail: 'The boot device has been physically removed. Windows cannot find the drive containing the operating system. Please reinstall your storage device.',
    project: {
      title: 'Brick Breaker',
      description: '2D brick breaker game with power-ups and 3 levels, made in Pygame. Classic arcade reimagined. All save data was on this SSD. It is gone now. Great job.',
      tech: ['Python', 'Pygame'],
      screenshots: ['/project-brick-1.png', '/project-brick-2.png', '/project-brick-3.png', '/project-brick-4.png', '/project-brick-5.png'],
    },
  },
  psu: {
    code: '0x000000A0',
    component: 'PSU',
    criticality: 'CRITICAL',
    message: 'POWER_SUPPLY_REMOVED',
    detail: 'Power supply unit disconnected. All system power has been cut. How are you even reading this? The PC should be completely off. This defies the laws of physics.',
    project: {
      title: 'Jarvis',
      description: 'Made in Python — opens websites and searches online with speech recognition in English. Just talk to it. It listens. Powered by the PSU you just ripped out.',
      tech: ['Python', 'SpeechRecognition', 'webbrowser'],
      screenshots: ['/project-jarvis-1.png', '/project-jarvis-2.png'],
    },
  },
}