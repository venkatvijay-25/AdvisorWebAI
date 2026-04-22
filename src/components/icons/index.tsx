import React from 'react';

/**
 * Icon base component
 * Renders an SVG with common stroke and styling properties
 */
export interface IcoProps {
  size?: number;
  stroke?: string;
  sw?: number;
  strokeWidth?: number;
  fill?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Ico = ({
  size = 18,
  stroke = 'currentColor',
  sw = 1.8,
  fill = 'none',
  className = '',
  children,
}: IcoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

/**
 * Icon: Sparkles
 */
export const IconSparkles = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </Ico>
);

/**
 * Icon: Search
 */
export const IconSearch = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Ico>
);

/**
 * Icon: Bell
 */
export const IconBell = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10 21a2 2 0 004 0" />
  </Ico>
);

/**
 * Icon: Settings
 */
export const IconSettings = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </Ico>
);

/**
 * Icon: Plus
 */
export const IconPlus = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 5v14M5 12h14" />
  </Ico>
);

/**
 * Icon: Home
 */
export const IconHome = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M3 12l9-9 9 9" />
    <path d="M5 10v10h14V10" />
  </Ico>
);

/**
 * Icon: Users
 */
export const IconUsers = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </Ico>
);

/**
 * Icon: Layers
 */
export const IconLayers = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </Ico>
);

/**
 * Icon: Pulse
 */
export const IconPulse = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Ico>
);

/**
 * Icon: History
 */
export const IconHistory = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.4 2.6L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 2" />
  </Ico>
);

/**
 * Icon: Send
 */
export const IconSend = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4z" />
  </Ico>
);

/**
 * Icon: Paperclip
 */
export const IconPaperclip = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M21 11.5L12 20a5 5 0 11-7-7l9-9a3.5 3.5 0 015 5L9.5 18a2 2 0 11-3-3l8-8" />
  </Ico>
);

/**
 * Icon: User
 */
export const IconUser = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0116 0" />
  </Ico>
);

/**
 * Icon: Arrow Right
 */
export const IconArrowRight = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </Ico>
);

/**
 * Icon: Arrow Up
 */
export const IconArrowUp = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Ico>
);

/**
 * Icon: Arrow Down
 */
export const IconArrowDown = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </Ico>
);

/**
 * Icon: Trend Up
 */
export const IconTrendUp = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
  </Ico>
);

/**
 * Icon: Trend Down
 */
export const IconTrendDown = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M3 7l6 6 4-4 8 8" />
    <path d="M14 17h7v-7" />
  </Ico>
);

/**
 * Icon: Alert
 */
export const IconAlert = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M10.3 3.86l-8.16 14a2 2 0 001.72 3h16.32a2 2 0 001.72-3l-8.16-14a2 2 0 00-3.44 0z" />
    <path d="M12 9v4M12 17h.01" />
  </Ico>
);

/**
 * Icon: Shield
 */
export const IconShield = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Ico>
);

/**
 * Icon: Brief
 */
export const IconBrief = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6M9 17h6" />
  </Ico>
);

/**
 * Icon: Scale
 */
export const IconScale = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M16 16l-4-4-4 4M12 12V3" />
    <path d="M3 12c0-3 4-6 9-6s9 3 9 6" />
    <path d="M5 21h14" />
  </Ico>
);

/**
 * Icon: Newspaper
 */
export const IconNewspaper = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M4 22h16a2 2 0 002-2V6a2 2 0 00-2-2h-3v18M4 22V4a2 2 0 012-2h11" />
    <path d="M8 7h6M8 11h6M8 15h6" />
  </Ico>
);

/**
 * Icon: Receipt
 */
export const IconReceipt = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2V2l-3 2-3-2-3 2-3-2-3 2z" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </Ico>
);

/**
 * Icon: Briefcase
 */
export const IconBriefcase = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </Ico>
);

/**
 * Icon: Bookmark
 */
export const IconBookmark = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </Ico>
);

/**
 * Icon: Download
 */
export const IconDownload = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </Ico>
);

/**
 * Icon: Share
 */
export const IconShare = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </Ico>
);

/**
 * Icon: Check
 */
export const IconCheck = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M5 13l4 4L19 7" />
  </Ico>
);

/**
 * Icon: Check Circle
 */
export const IconCheckCircle = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-6" />
  </Ico>
);

/**
 * Icon: X (Close)
 */
export const IconX = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Ico>
);

/**
 * Icon: Filter
 */
export const IconFilter = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </Ico>
);

/**
 * Icon: Mic
 */
export const IconMic = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="9" y="2" width="6" height="12" rx="3" />
    <path d="M19 10a7 7 0 11-14 0" />
    <path d="M12 19v3" />
  </Ico>
);

/**
 * Icon: Globe
 */
export const IconGlobe = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
  </Ico>
);

/**
 * Icon: Flame
 */
export const IconFlame = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 2s4 4 4 8a4 4 0 11-8 0c0-2 1-3 1-3s-3 2-3 6a6 6 0 0012 0c0-6-6-11-6-11z" />
  </Ico>
);

/**
 * Icon: Moon
 */
export const IconMoon = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
  </Ico>
);

/**
 * Icon: Command
 */
export const IconCommand = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z" />
  </Ico>
);

/**
 * Icon: More (three dots)
 */
export const IconMore = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </Ico>
);

/**
 * Icon: Star
 */
export const IconStar = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 2l3 7 7 .7-5.3 4.7L18 22l-6-3.7L6 22l1.3-7.6L2 9.7 9 9z" />
  </Ico>
);

/**
 * Icon: Copy
 */
export const IconCopy = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </Ico>
);

/**
 * Icon: Refresh
 */
export const IconRefresh = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M21 12a9 9 0 11-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </Ico>
);

/**
 * Icon: Thumbs Up
 */
export const IconThumbsUp = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H7" />
  </Ico>
);

/**
 * Icon: Thumbs Down
 */
export const IconThumbsDown = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M17 14V2M9 18.12L10 14H4.17a2 2 0 01-1.92-2.56l2.33-8A2 2 0 016.5 2H17" />
  </Ico>
);

/**
 * Icon: Zap
 */
export const IconZap = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
  </Ico>
);

/**
 * Icon: Chevron Down
 */
export const IconChevronDown = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M6 9l6 6 6-6" />
  </Ico>
);

/**
 * Icon: Chevron Right
 */
export const IconChevronRight = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M9 6l6 6-6 6" />
  </Ico>
);

/**
 * Icon: Chevron Left
 */
export const IconChevronLeft = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M15 18l-6-6 6-6" />
  </Ico>
);

/**
 * Icon: Pie
 */
export const IconPie = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M21.21 15.89A10 10 0 118 2.83" />
    <path d="M22 12A10 10 0 0012 2v10z" />
  </Ico>
);

/**
 * Icon: Bar
 */
export const IconBar = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M3 3v18h18" />
    <path d="M7 16V11M11 16V7M15 16V13M19 16V9" />
  </Ico>
);

/**
 * Icon: Beaker
 */
export const IconBeaker = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M9 3v6L4 21h16L15 9V3" />
    <path d="M8 3h8M6 14h12" />
  </Ico>
);

/**
 * Icon: Brain
 */
export const IconBrain = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M9 4a3 3 0 00-3 3v0a3 3 0 00-2 5 3 3 0 002 5 3 3 0 003 3h0a3 3 0 003-3V4a3 3 0 00-3 0z" />
    <path d="M15 4a3 3 0 013 3v0a3 3 0 012 5 3 3 0 01-2 5 3 3 0 01-3 3h0a3 3 0 01-3-3V4" />
  </Ico>
);

/**
 * Icon: Target
 */
export const IconTarget = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </Ico>
);

/**
 * Icon: Link
 */
export const IconLink = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" />
    <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
  </Ico>
);

/**
 * Icon: Spin (loader)
 */
export const IconSpin = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" style={{ strokeDasharray: '25 50' }} />
  </Ico>
);

/**
 * Icon: Lock
 */
export const IconLock = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </Ico>
);

/**
 * Icon: Database
 */
export const IconDatabase = (props: IcoProps) => (
  <Ico {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14a9 3 0 0018 0V5" />
    <path d="M3 12a9 3 0 0018 0" />
  </Ico>
);

/**
 * Icon: Lightbulb
 */
export const IconLightbulb = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
  </Ico>
);

/**
 * Icon: Pin
 */
export const IconPin = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 17v5M9 8l-4 4 4 4M15 8l4 4-4 4M12 2v6" />
  </Ico>
);

/**
 * Icon: Clock
 */
export const IconClock = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Ico>
);

/**
 * Icon: Wand
 */
export const IconWand = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M15 4V2M15 14v-2M8 9h2M20 9h2M17.8 11.8L19 13M15 9h0M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5" />
  </Ico>
);

/**
 * Icon: Calendar
 */
export const IconCalendar = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Ico>
);

/**
 * Icon: Radar
 */
export const IconRadar = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M19.1 4.9A10 10 0 1112 2" />
    <path d="M12 12l4-4" />
    <circle cx="12" cy="12" r="1.5" />
  </Ico>
);

/**
 * Icon: Chat
 */
export const IconChat = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Ico>
);

/**
 * Icon: Check2 (check in square)
 */
export const IconCheck2 = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 12l3 3 5-6" />
  </Ico>
);

/**
 * Icon: Rocket
 */
export const IconRocket = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M14 11a3 3 0 11-6 0 3 3 0 016 0z" />
    <path d="M14 4s6 1 6 8-6 10-6 10l-2-3H8l-2 3s-6-3-6-10 6-8 6-8" />
  </Ico>
);

/**
 * Icon: Book
 */
export const IconBook = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M4 4v16a2 2 0 002 2h14V4a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </Ico>
);

/**
 * Icon: Compass
 */
export const IconCompass = (props: IcoProps) => (
  <Ico {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8l-2 6-6 2 2-6 6-2z" />
  </Ico>
);

/**
 * Icon: Tasks
 */
export const IconTasks = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="3" y="5" width="4" height="4" rx="1" />
    <rect x="3" y="11" width="4" height="4" rx="1" />
    <rect x="3" y="17" width="4" height="4" rx="1" />
    <path d="M11 7h10M11 13h10M11 19h10" />
  </Ico>
);

/**
 * Icon: Video On
 */
export const IconVideoOn = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M22 8l-6 4 6 4z" />
  </Ico>
);

/**
 * Icon: Waveform
 */
export const IconWaveform = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M2 12h2M6 8v8M10 4v16M14 8v8M18 10v4M22 12h0" />
  </Ico>
);

/**
 * Icon: Mail
 */
export const IconMail = (props: IcoProps) => (
  <Ico {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 6l10 7 10-7" />
  </Ico>
);

/**
 * Icon: Edit
 */
export const IconEdit = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
  </Ico>
);

/**
 * Icon: Household (family group)
 */
export const IconHousehold = (props: IcoProps) => (
  <Ico {...props}>
    <path d="M3 21v-7l9-7 9 7v7" />
    <path d="M9 21v-4a3 3 0 016 0v4" />
    <circle cx="8" cy="10" r="1.5" />
    <circle cx="16" cy="10" r="1.5" />
  </Ico>
);

/**
 * Icon map for string-based lookups
 * Allows data files to reference icons by string key
 */
export const iconMap: Record<string, React.ComponentType<IcoProps>> = {
  sparkles: IconSparkles,
  search: IconSearch,
  bell: IconBell,
  settings: IconSettings,
  plus: IconPlus,
  home: IconHome,
  users: IconUsers,
  layers: IconLayers,
  pulse: IconPulse,
  history: IconHistory,
  send: IconSend,
  paperclip: IconPaperclip,
  user: IconUser,
  arrowRight: IconArrowRight,
  arrowUp: IconArrowUp,
  arrowDown: IconArrowDown,
  trendUp: IconTrendUp,
  trendDown: IconTrendDown,
  alert: IconAlert,
  shield: IconShield,
  brief: IconBrief,
  scale: IconScale,
  newspaper: IconNewspaper,
  receipt: IconReceipt,
  briefcase: IconBriefcase,
  bookmark: IconBookmark,
  download: IconDownload,
  share: IconShare,
  check: IconCheck,
  checkCircle: IconCheckCircle,
  x: IconX,
  filter: IconFilter,
  mic: IconMic,
  globe: IconGlobe,
  flame: IconFlame,
  moon: IconMoon,
  command: IconCommand,
  more: IconMore,
  star: IconStar,
  copy: IconCopy,
  refresh: IconRefresh,
  thumbsUp: IconThumbsUp,
  thumbsDown: IconThumbsDown,
  zap: IconZap,
  chevronDown: IconChevronDown,
  chevronRight: IconChevronRight,
  chevronLeft: IconChevronLeft,
  pie: IconPie,
  bar: IconBar,
  beaker: IconBeaker,
  brain: IconBrain,
  target: IconTarget,
  link: IconLink,
  spin: IconSpin,
  lock: IconLock,
  database: IconDatabase,
  lightbulb: IconLightbulb,
  pin: IconPin,
  clock: IconClock,
  wand: IconWand,
  calendar: IconCalendar,
  radar: IconRadar,
  chat: IconChat,
  check2: IconCheck2,
  rocket: IconRocket,
  book: IconBook,
  compass: IconCompass,
  tasks: IconTasks,
  videoOn: IconVideoOn,
  waveform: IconWaveform,
  mail: IconMail,
  edit: IconEdit,
  household: IconHousehold,
};
