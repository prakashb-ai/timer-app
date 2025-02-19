export interface Timer {
  id: string;
  name: string;
  duration: number;
  category: string;
  remainingTime: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
  createdAt: string;
  completedAt?: string;
  halfwayAlert?: boolean;
}

export interface Category {
  id: string;
  name: string;
  expanded: boolean;
}

export interface TimerLog {
  id: string;
  timerId: string;
  timerName: string;
  category: string;
  completedAt: string;
  duration: number;
}
