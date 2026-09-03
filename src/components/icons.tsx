import type { SVGProps } from "react";

export type IconName =
  | "cube"
  | "server"
  | "search"
  | "agent"
  | "shield"
  | "globe"
  | "robot"
  | "document"
  | "trajectory"
  | "target"
  | "warning"
  | "gear"
  | "check"
  | "download"
  | "reset"
  | "chevron";

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    cube: <><path d="m12 2 8 4.6v10.8L12 22l-8-4.6V6.6L12 2Z"/><path d="m4 6.6 8 4.7 8-4.7M12 22V11.3"/></>,
    server: <><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h7M11 17h7"/></>,
    search: <><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6M10 1.5v2M1.5 10h2"/></>,
    agent: <><rect x="5" y="7" width="14" height="11" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6M3 11h2M19 11h2"/></>,
    shield: <><path d="M12 2.5 20 6v5c0 5.2-3.4 8.7-8 10.5C7.4 19.7 4 16.2 4 11V6l8-3.5Z"/><path d="m9 12 2 2 4-5"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9S14.4 18.5 12 21M12 3C9.6 5.5 8.5 8.5 8.5 12S9.6 18.5 12 21"/></>,
    robot: <><path d="M4 20h8M8 20v-4l4-3 2.5-5M12 13l4 2 3-3M14.5 8l-2-2 2-2 2 2-2 2ZM17 20h4"/></>,
    document: <><path d="M6 2h8l4 4v16H6V2Z"/><path d="M14 2v5h4M9 12h6M9 16h6"/></>,
    trajectory: <><circle cx="5" cy="17" r="2"/><circle cx="18" cy="6" r="2"/><path d="M7 17h6a4 4 0 0 0 0-8h-2a4 4 0 0 1-4-4"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m12 12 8-8M17 4h3v3"/></>,
    warning: <><path d="M12 3 22 21H2L12 3Z"/><path d="M12 9v5M12 18h.01"/></>,
    gear: <><circle cx="12" cy="12" r="3"/><path d="m19 13.5 2 1.5-2 3.5-2.5-1a8 8 0 0 1-2.5 1.4L13.6 22h-4l-.4-3.1a8 8 0 0 1-2.5-1.4l-2.6 1L2 15l2.1-1.5a8 8 0 0 1 0-3L2 9l2.1-3.5 2.6 1a8 8 0 0 1 2.5-1.4L9.6 2h4l.4 3.1a8 8 0 0 1 2.5 1.4l2.5-1L21 9l-2 1.5a8 8 0 0 1 0 3Z"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 8"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></>,
    reset: <><path d="M4 8V3m0 0h5M4 3l3 3a8 8 0 1 1-2 8"/></>,
    chevron: <path d="m9 5 7 7-7 7"/>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
