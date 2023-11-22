import { Injectable } from '@angular/core';
import { IDropdownOption } from '../models/dropdown-option';

@Injectable({
  providedIn: 'root',
})
export class StandardDropdownService {
  constructor() {}

  public convertTypeToDropdownOption<T>(items: T[]): IDropdownOption[] {

  }
}
