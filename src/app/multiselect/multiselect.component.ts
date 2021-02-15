import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { MapperPipeFn } from '../mapper.pipe';
import { FormControl } from '@angular/forms';

export interface DropdownItem {
  id: string;
  name: string;
}

export enum DropdownState {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export interface MultiSelectState {
  items: DropdownItem[];
  filteredItems: DropdownItem[];
  selectedItems: DropdownItem[];
  dropdownState: DropdownState;
}

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiselectComponent implements OnInit, OnChanges, OnDestroy {

  @Input() selectionModel: Array<DropdownItem>;
  @Input() items: Array<DropdownItem>;
  @Output() selectionModelChange: EventEmitter<DropdownItem[]> = new EventEmitter();

  multiSelectState: BehaviorSubject<MultiSelectState> = new BehaviorSubject<MultiSelectState>({
    dropdownState: DropdownState.CLOSED,
    items: [],
    filteredItems: [],
    selectedItems: []
  });
  multiSelectState$ = this.multiSelectState.asObservable();
  dropDownState$ = this.multiSelectState.pipe(map(state => state.dropdownState));
  selectedItems$ = this.multiSelectState$.pipe(map(state => state.selectedItems));
  filteredItems$ = this.multiSelectState$.pipe(map(state => state.filteredItems));

  searchInput: FormControl = new FormControl('');

  destroy$: Subject<void> = new Subject<void>();

  dropDown = {...DropdownState};

  checkIfSelectedFn: MapperPipeFn<string, Observable<boolean>> = (item) => {
    return this.selectedItems$.pipe(
      map(items => items.map(selectedItem => selectedItem.id).includes(item))
    );
  }

  constructor() { }

  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(250),
      tap((value: string) => this.onInputChange(value))
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.multiSelectState.next({
        ...this.multiSelectState.getValue(),
        items: [...this.items],
        filteredItems: [...this.items],
      });
    }

    if (changes.selectionModel) {
      this.multiSelectState.next({
        ...this.multiSelectState.getValue(),
        selectedItems: [...this.selectionModel]
      });
    }
  }

  selectItem(item: DropdownItem): void {
    this.searchInput.setValue('');
    if (this.multiSelectState.getValue().selectedItems.filter(it => it.id === item.id).length) {
      return;
    }
    this.multiSelectState.next({
      ...this.multiSelectState.getValue(),
      selectedItems: [...this.multiSelectState.getValue().selectedItems, item]
    });
    this.onUpdate();
  }

  removeItem(item: DropdownItem): void {
    this.multiSelectState.next({
      ...this.multiSelectState.getValue(),
      selectedItems: [...this.multiSelectState.getValue().selectedItems.filter(selItem => selItem.id !== item.id)]
    });
    this.onUpdate();
  }

  onInputChange(value: string): void {
    this.multiSelectState.next({
      ...this.multiSelectState.getValue(),
      filteredItems: [...this.multiSelectState.getValue().items.filter(selItem => selItem.name.toLowerCase().includes(value.toLowerCase()))]
    });
  }

  closeDropdown(): void {
    this.multiSelectState.next({
      ...this.multiSelectState.getValue(),
      dropdownState: DropdownState.CLOSED
    });
  }

  openDropDown(): void {
    this.multiSelectState.next({
      ...this.multiSelectState.getValue(),
      dropdownState: DropdownState.OPEN
    });
  }

  onUpdate(): void {
    this.selectionModelChange.emit(this.multiSelectState.getValue().selectedItems);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
