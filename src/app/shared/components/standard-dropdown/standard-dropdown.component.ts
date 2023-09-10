import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, of, switchMap, tap } from 'rxjs';

interface IKeyValue {
  key: any;
  value: any;
  innerHtml?: string;
}

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
  private itemList: IKeyValue[] = [];

  public searchBoxValue: string = '';
  public opened: boolean = false;

  @ViewChild('searchBox', { static: true }) private searchBox!: ElementRef;

  @Input() public bindName: string = 'name';
  @Input() public bindValue: string = 'id';
  @Input() public placeholder: string = 'Select an option';

  @Input() public set items(items: any[]) {
    const itemList = items ?? [];
    this.itemList = itemList.map((item) => {
      const singleItem: IKeyValue = {
        ...item,
        key: item[this.bindValue],
        value: item[this.bindName],
      };

      return singleItem;
    });
  }

  @Input() public selectedOption: any;
  @Output() public selectedOptionChange = new EventEmitter<any>();

  public items$: Observable<IKeyValue[]> = this.valueToSearch$.pipe(
    debounceTime(100),
    tap((valueToSearch) => {
      this.searchBoxValue = valueToSearch;
    }),
    switchMap((valueToSearch) => {
      const foundItems = this.itemList
        .filter((item) => item.value.toLowerCase().includes(valueToSearch.toLowerCase()))
        .map((item) => {
          const name = this.getReplacedText(item.value, valueToSearch);
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

  public onOptionClick(item: IKeyValue) {
    this.valueToSearch$.next(item.value);

    delete item.innerHtml;
    delete item.key;
    delete item.value;

    this.selectedOptionChange.emit(item);
  }

  public onSearchValueChange(valueToSearch: string) {
    this.valueToSearch$.next(valueToSearch);
  }

  public trackByFn(_: number, item: IKeyValue) {
    return item.key;
  }

  private getReplacedText(text: string, valueToSearch: string) {
    if (valueToSearch.trim() === '') {
      this.selectedOptionChange.emit(null);
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
