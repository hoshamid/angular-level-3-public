import { IQuestion } from './question';

export interface IResults {
  questions: IQuestion[];
  answers: string[];
  score: number;
}
