import { Pipe, PipeTransform } from '@angular/core';
import { IDropdownOption } from '../models/dropdown-option';

@Pipe({
  name: 'dropdownOptions',
  standalone: true,
})
export class DropdownOptionsPipe implements PipeTransform {
  transform(items: unknown[], bindValue: string, bindName: string): IDropdownOption[] {
    items?.map((item) => ({ id: item[bindValue], name: item[bindName] } as IDropdownOption));
    return [];
  }
}
