/** Shapes from steering contracts.md §4–5. Keep in sync with apps/vix-agent/vix_agent/contracts.py. */
export type Mode = 'PRACTICE' | 'GRADED' | 'EXAM';
export type RegionKind = 'panel' | 'instrument' | 'control' | 'apparatus' | 'chart' | 'table';

export interface Region {
  id: string;
  label: string;
  kind: RegionKind;
  bbox: [number, number, number, number];
  visible: boolean;
  summary?: string;
}

export interface ScreenMap {
  v: 1;
  screen: string;
  route: string;
  mode: Mode;
  experiment?: { id: string; title: string; step: string };
  viewport: { w: number; h: number };
  regions: Region[];
  sim?: Record<string, unknown>;
  lastEvents?: { type: string; code?: string }[];
}

export type VixRpc =
  | { method: 'spotlight'; payload: { regionId: string; durationMs?: number } }
  | { method: 'pointAt'; payload: { elementId: string; label: string } }
  | { method: 'startTour'; payload: { tourId: string; steps: { regionId: string; caption: string }[] } }
  | { method: 'tourStep'; payload: { index: number } }
  | { method: 'endTour'; payload: Record<string, never> }
  | { method: 'openPanel'; payload: { panel: 'readings' | 'notebook' | 'assistant' } }
  | { method: 'showCaption'; payload: { text: string; final: boolean } };

export const VIX_RPC_METHODS = ['spotlight', 'pointAt', 'startTour', 'tourStep', 'endTour', 'openPanel', 'showCaption'] as const;

/** Replace numbers in text with [redacted] (GRADED mode). Counts may be kept by the caller. */
export function redactNumbers(text: string): string {
  return text.replace(/-?\d+(?:[.,]\d+)?/g, '[redacted]');
}

/** Spread onto an element: <section {...vixRegion('bench', 'Lab bench', 'panel')}> */
export function vixRegion(id: string, label: string, kind: RegionKind = 'panel') {
  return { 'data-vix-id': id, 'data-vix-label': label, 'data-vix-kind': kind } as const;
}
