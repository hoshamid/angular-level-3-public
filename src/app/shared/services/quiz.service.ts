import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { IApiQuestion } from '../models/api-question';
import { ICategory } from '../models/category';
import { IQuestion } from '../models/question';
import { IResults } from '../models/results';
import { Difficulty } from '../types/difficulty';
import { CategoriesExtracterService } from './categories-extracter.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly API_URL = 'https://opentdb.com/';
  private latestResults!: IResults;
  private previousQuestions: IQuestion[] = [];
  private http = inject(HttpClient);
  private categoriesExtracterService = inject(CategoriesExtracterService);

  public getCategories(): Observable<ICategory[]> {
    return this.http
      .get<{ trivia_categories: ICategory[] }>(this.API_URL + 'api_category.php')
      .pipe(map((res) => this.categoriesExtracterService.extract(':', res.trivia_categories)));
  }

  public getQuizQuestions(categoryId: number, difficulty: Difficulty, shouldReplacePreviousQuestions: boolean = true): Observable<IQuestion[]> {
    return this.http
      .get<{ results: IApiQuestion[] }>(`${this.API_URL}/api.php?amount=5&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        map((res) => {
          const quizQuestions: IQuestion[] = res.results.map((question, index) => ({
            ...question,
            index,
            category: {
              id: categoryId,
              name: question.category,
            } as ICategory,
            all_answers: [...question.incorrect_answers, question.correct_answer].sort(() => (Math.random() > 0.5 ? 1 : -1)),
          }));

          return quizQuestions;
        }),
        tap((questions) => {
          if (!shouldReplacePreviousQuestions) {
            return;
          }

          this.previousQuestions = questions;
        })
      );
  }

  public getChangedQuestions(questionToChange: IQuestion) {
    const questions$ = this.getQuizQuestions(questionToChange.category.id ?? 0, questionToChange.difficulty as Difficulty, false);

    return questions$.pipe(
      map((questions) => {
        const newQuestion: IQuestion = questions.find(
          (question) =>
            !this.previousQuestions.some((previousQuestion) => previousQuestion.question === question.question) &&
            question.question.toLowerCase() != questionToChange.question.toLowerCase()
        )!;

        this.previousQuestions[questionToChange.index] = {
          ...newQuestion,
          changed: true,
          index: questionToChange.index,
        };

        return this.previousQuestions;
      })
    );
  }

  public computeScore(questions: IQuestion[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index]) score++;
    });
    this.latestResults = { questions, answers, score };
  }

  public getLatestResults(): IResults {
    return this.latestResults;
  }
}
