import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnswersComponent } from './answers/answers.component';
import { QuizMakerComponent } from './quiz-maker/quiz-maker.component';
import { QuizService } from './shared/services/quiz.service';

const routes: Routes = [
  {
    path: 'result',
    component: AnswersComponent,
    resolve: { data: () => inject(QuizService).getLatestResults() },
  },
  {
    path: '**',
    component: QuizMakerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
