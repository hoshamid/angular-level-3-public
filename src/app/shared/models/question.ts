import { ICategory } from './category';

export interface IQuestion {
  index: number;
  question: string;
  category: ICategory;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
  difficulty: string;
  changed?: boolean;
}
