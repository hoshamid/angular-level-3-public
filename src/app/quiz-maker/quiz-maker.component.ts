import { Component, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICategory } from '../shared/models/category';
import { IQuestion } from '../shared/models/question';
import { QuizService } from '../shared/services/quiz.service';
import { Difficulty } from '../shared/types/difficulty';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
})
export class QuizMakerComponent {
  private quizService = inject(QuizService);

  public selectedCategory: ICategory | undefined;
  public selectedSubCategory: ICategory | undefined;

  public categories$: Observable<ICategory[]> = this.quizService.getCategories();
  public questions$!: Observable<IQuestion[]>;

  public onQuizCreate(difficulty: string): void {
    const selectedSubCategory = this.selectedCategory?.subCategories?.find((category) => category.id === this.selectedSubCategory?.id);
    const categoryId = selectedSubCategory?.id ?? this.selectedCategory?.id ?? 0;

    if (categoryId === 0) {
      const questions$: Observable<IQuestion[]> = of([]);
      this.questions$ = questions$;
      return;
    }

    this.createQuiz(categoryId, difficulty);
  }

  public onQuestionChange(question: IQuestion) {
    this.questions$ = this.quizService.getChangedQuestions(question);
  }

  private createQuiz(categoryId: number, difficulty: string) {
    this.questions$ = this.quizService.getQuizQuestions(categoryId, difficulty as Difficulty);
  }
}
