import { Component, Input } from '@angular/core';
import { IResults } from '../shared/models/results';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css'],
})
export class AnswersComponent {
  @Input() public data!: IResults;
}
