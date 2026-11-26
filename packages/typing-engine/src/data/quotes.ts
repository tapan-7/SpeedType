import { QuoteLength } from '@speedtype/shared';

export interface QuoteItem {
  text: string;
  author: string;
  length: Exclude<QuoteLength, QuoteLength.ALL>;
}

export const ENGLISH_QUOTES: readonly QuoteItem[] = [
  {
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    length: QuoteLength.SHORT,
  },
  {
    text: 'Make it work, make it right, make it fast.',
    author: 'Kent Beck',
    length: QuoteLength.SHORT,
  },
  {
    text: 'Code is like humor. When you have to explain it, it is bad.',
    author: 'Cory House',
    length: QuoteLength.SHORT,
  },
  {
    text: 'Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.',
    author: 'Antoine de Saint-Exupery',
    length: QuoteLength.MEDIUM,
  },
  {
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson',
    length: QuoteLength.MEDIUM,
  },
  {
    text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    author: 'Martin Fowler',
    length: QuoteLength.MEDIUM,
  },
  {
    text: 'First, solve the problem. Then, write the code. A clear mental model always outlasts a clever shortcut.',
    author: 'John Johnson',
    length: QuoteLength.MEDIUM,
  },
  {
    text: 'The best performance improvement is the transition from the nonworking state to the working state. Measure carefully, remove bottlenecks, and keep the hot path lean so every interaction feels immediate.',
    author: 'John Ousterhout',
    length: QuoteLength.LONG,
  },
  {
    text: 'Good design adds value faster than it adds cost. When an interface stays quiet until you need it, your attention remains on the work itself rather than the tool in front of you.',
    author: 'Thomas C. Gale',
    length: QuoteLength.LONG,
  },
];

