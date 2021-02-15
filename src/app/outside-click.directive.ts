import { Directive, ElementRef, HostListener, Output, Input, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appOutsideClick]'
})
export class OutsideClickDirective {
  @Output('appOutsideClick') appOutsideClick: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target']) onMouseEnter(targetElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.appOutsideClick.emit(null);
    }
  }

}
