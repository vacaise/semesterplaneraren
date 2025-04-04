
export interface DateItem {
  date: string;
  name: string;
}

export interface GroupedDates {
  name: string;
  dates: DateItem[];
}

export interface DateListProps {
  title: string;
  colorScheme: 'amber';
}

export interface DateListStylesMap {
  container: string;
  border: string;
  divider: string;
  highlight: string;
  text: string;
  muted: string;
  accent: string;
  hover: string;
  active: string;
  input: string;
}
