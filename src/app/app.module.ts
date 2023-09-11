import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AnswersComponent } from './answers/answers.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { QuizMakerComponent } from './quiz-maker/quiz-maker.component';
import { QuizComponent } from './quiz/quiz.component';
import { StandardDropdownComponent } from './shared/components/standard-dropdown/standard-dropdown.component';

@NgModule({
  declarations: [AppComponent, QuizMakerComponent, QuizComponent, QuestionComponent, AnswersComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, StandardDropdownComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
