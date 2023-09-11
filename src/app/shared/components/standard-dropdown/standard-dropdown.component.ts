import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, of, switchMap, tap } from 'rxjs';
import { IDropdownOption } from './models/dropdown-option';

@Component({
  selector: 'app-standard-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standard-dropdown.component.html',
  styleUrls: ['./standard-dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardDropdownComponent implements OnChanges {
  private valueToSearch$ = new BehaviorSubject<string>('');

  public searchBoxValue: string = '';
  public opened: boolean = false;

  @ViewChild('searchBox', { static: true }) private searchBox!: ElementRef;

  @Input() public items: IDropdownOption[] = [];
  @Input() public placeholder: string = 'Select an option';
  @Input() public selectedOption: IDropdownOption | undefined;
  @Output() public selectedOptionChange = new EventEmitter<IDropdownOption>();

  public items$: Observable<IDropdownOption[]> = this.valueToSearch$.pipe(
    debounceTime(100),
    tap((valueToSearch) => {
      this.searchBoxValue = valueToSearch;
    }),
    switchMap((valueToSearch) => {
      const foundItems = this.items
        .filter((item) => item.name.toLowerCase().includes(valueToSearch.toLowerCase()))
        .map((item) => {
          const name = this.getReplacedText(item.name, valueToSearch);
          return {
            ...item,
            innerHtml: name,
          };
        });

      return of(foundItems);
    })
  );

  public ngOnChanges(changes: SimpleChanges): void {
    const shouldResetEntries = changes['items']?.currentValue;
    if (shouldResetEntries) {
      this.valueToSearch$.next('');
    }
  }

  public onSearchBoxClick() {
    this.opened = true;
  }

  public onOptionClick(option: IDropdownOption) {
    this.valueToSearch$.next(option.name);
    this.selectedOptionChange.emit(option);
  }

  public onSearchValueChange(valueToSearch: string) {
    this.valueToSearch$.next(valueToSearch);
  }

  public trackByFn(index: number, _: IDropdownOption) {
    return index;
  }

  private getReplacedText(text: string, valueToSearch: string) {
    if (valueToSearch.trim() === '') {
      this.selectedOptionChange.emit(undefined);
      return text;
    }

    const nonSensitiveSearchMatcher = new RegExp(valueToSearch, 'gi');
    const matchingResults = text.match(nonSensitiveSearchMatcher) ?? [];

    for (const match of matchingResults) {
      const searchValueRegExp = new RegExp(match, 'g');
      const replaceValue = `<b>${match}</b>`;
      text = text.replace(searchValueRegExp, replaceValue);
    }

    return text;
  }

  @HostListener('document:click', ['$event']) private onOutsideDropdownClick(event: PointerEvent) {
    if (this.searchBox.nativeElement !== event.target) {
      this.opened = false;
    }
  }
}
