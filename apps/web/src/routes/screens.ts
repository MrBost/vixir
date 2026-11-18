/** Every screen on the Vixir canvas, by code. Build each one from its spec; delete the placeholder when done. */
export interface ScreenDef { code: string; title: string; path: string; area: 'public' | 'app' | 'lab' | 'teach' | 'admin' }

export const screens: ScreenDef[] = [
  { code: 'A1', title: 'Landing page', path: '/', area: 'public' },
  { code: 'A2', title: 'Sign in / sign up', path: '/auth', area: 'public' },
  { code: 'B1', title: 'Student dashboard', path: '/app', area: 'app' },
  { code: 'B2', title: 'Labs hub', path: '/app/labs', area: 'app' },
  { code: 'B3', title: 'Experiment library', path: '/app/library', area: 'app' },
  { code: 'B4', title: 'Experiment briefing', path: '/app/x/:experimentId', area: 'app' },
  { code: 'B5', title: 'Apparatus encyclopedia', path: '/app/apparatus', area: 'app' },
  { code: 'C1', title: 'Pre-lab safety check', path: '/app/x/:experimentId/prelab', area: 'lab' },
  { code: 'C2', title: 'Apparatus setup', path: '/app/x/:experimentId/setup', area: 'lab' },
  { code: 'C3', title: 'Exam mode start', path: '/app/x/:experimentId/exam', area: 'lab' },
  { code: 'D1', title: 'Lab workspace', path: '/app/x/:experimentId/lab', area: 'lab' },
  { code: 'F1', title: 'Results & graph', path: '/app/x/:experimentId/results', area: 'app' },
  { code: 'F2', title: 'Review & submit', path: '/app/x/:experimentId/submit', area: 'app' },
  { code: 'F3', title: 'Marked report', path: '/app/attempts/:attemptId', area: 'app' },
  { code: 'F4', title: 'Bench replay', path: '/app/attempts/:attemptId/replay', area: 'app' },
  { code: 'G1', title: 'Teacher dashboard', path: '/teach', area: 'teach' },
  { code: 'G2', title: 'Assign experiment', path: '/teach/assign', area: 'teach' },
  { code: 'G3', title: 'Class results', path: '/teach/classes/:classId', area: 'teach' },
  { code: 'G4', title: 'Experiment builder', path: '/teach/builder', area: 'teach' },
  { code: 'H1', title: 'Institution admin', path: '/admin', area: 'admin' },
];
