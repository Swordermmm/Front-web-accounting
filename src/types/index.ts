export interface Week {
  start: Date;
  end: Date;
}

export interface Event {
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
}

export interface Day {
  date: Date;
  meetings: Event[];
}