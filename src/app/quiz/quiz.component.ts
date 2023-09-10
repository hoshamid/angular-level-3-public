import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IQuestion } from '../shared/models/question';
import { QuizService } from '../shared/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent {
  private quizService = inject(QuizService);
  private router = inject(Router);

  public questionsToDisplay: IQuestion[] = [];
  public displayChangedQuestionButton: boolean = true;
  public userAnswers: string[] = [];

  @Input() public set questions(questions_: IQuestion[] | null) {
    if (!questions_) {
      return;
    }

    this.questionsToDisplay = questions_;
    this.displayChangedQuestionButton = !questions_.some((question) => question.changed);
  }

  @Output() public questionChange = new EventEmitter<IQuestion>();

  public onAnswersSubmit(): void {
    this.quizService.computeScore(this.questionsToDisplay ?? [], this.userAnswers);
    this.router.navigateByUrl('/result');
  }

  public onQuestionChange(question: IQuestion) {
    this.questionChange.emit(question);
  }

  public trackByFn(index: number, _: IQuestion) {
    return index;
  }
}
