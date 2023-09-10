import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { IQuestion } from '../shared/models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent {
  private currentSelection!: string;

  @Input({ required: true }) public question!: IQuestion;
  @Input() public correctAnswer?: string;
  @Input() public userAnswer?: string;
  @Input() public changeQuestionButton!: TemplateRef<unknown>;

  @Output() public userAnswerChange = new EventEmitter<string>();

  public getAnswerButtonClass(answer: string): string {
    if (!this.userAnswer) {
      if (this.currentSelection == answer) return 'tertiary';
    } else {
      if (this.userAnswer == this.correctAnswer && this.userAnswer == answer) return 'tertiary';
      if (answer == this.correctAnswer) return 'secondary';
    }
    return 'primary';
  }

  public onAnswerClick(answer: string): void {
    this.currentSelection = answer;
    this.userAnswerChange.emit(answer);
  }
}
