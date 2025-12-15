import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.html',
})
export class Dropdown<T extends string> {
  @Input() options: T[] = [];
  @Input() selected: T | 'ALL' = 'ALL';
  @Input() allLabel = 'All';

  @Output() selectedChange = new EventEmitter<T | 'ALL'>();

  open = false;
  activeIndex = -1;

  constructor(private el: ElementRef) {}

  toggle() {
    this.open = !this.open;
    this.activeIndex = -1;
  }

  select(value: T | 'ALL') {
    this.selected = value;
    this.open = false;
    this.activeIndex = -1;
    this.selectedChange.emit(value);
  }

  /* -------------------- Click Outside -------------------- */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.open && !this.el.nativeElement.contains(event.target)) {
      this.open = false;
      this.activeIndex = -1;
    }
  }

  /* -------------------- Keyboard Navigation -------------------- */

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.open) return;

    const totalItems = this.options.length + 1; // +1 for "ALL"

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex = (this.activeIndex + 1) % totalItems;
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex =
          (this.activeIndex - 1 + totalItems) % totalItems;
        break;

      case 'Enter':
        event.preventDefault();
        this.selectByIndex();
        break;

      case 'Escape':
        this.open = false;
        this.activeIndex = -1;
        break;
    }
  }

  private selectByIndex() {
    if (this.activeIndex === 0) {
      this.select('ALL');
    } else {
      this.select(this.options[this.activeIndex - 1]);
    }
  }
}
