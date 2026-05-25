export interface Week {
  start: Date;
  end: Date;
}

export interface Event {
  title: string;
  desc: string;
  place: string;
  start: string;
  end: string;
}

export interface Day {
  day: Date;
  events: Event[];
}