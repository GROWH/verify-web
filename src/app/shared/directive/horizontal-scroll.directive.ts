import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery'
import { throttle } from 'lodash'

interface SetLeftFn {
  (el: HTMLElement, nextLeft: number): any
}

@Directive({
  selector: '[appHorizontalScroll]',
  host    : {
    'style': `
      position: absolute;
      left: 0;
      white-space: nowrap;
      transition: left 0.4s ease-out;
    `
  }
})
export class HorizontalScrollDirective implements OnInit, OnDestroy {

  private step: number = 200
  private scrollToZero: () => any

  constructor(
    private el: ElementRef,
  ) { }
  
  ngOnInit() {
    // window.addEventListener('resize', )
    let scrollToZero = () => this.scrollThrottled(
      this.el.nativeElement, 0
    )

    this.scrollToZero = scrollToZero
    $(window).on('resize', scrollToZero)
  }

  ngOnDestroy() {
    $(window).off('resize', this.scrollToZero)
  }

  @HostListener('wheel', ['$event']) onWhell(e: WheelEvent) {
    let innerEl: HTMLElement = this.el.nativeElement
    let innerWidth = $(innerEl).width()
    let outerWidth = $(innerEl.parentElement).width()

    this.step = outerWidth / 1.5

    let widthDif = outerWidth - innerWidth
    if (widthDif >= 0) {
      this.scrollThrottled(innerEl, 0)
      return
    }

    let direction = this.getWheelDirection(e)
    let left = parseFloat($(innerEl).css('left'))
    let nextLeft: number

    switch (direction) {
      case 'up': 
        if (left < 0) {
          nextLeft = left + this.step
          nextLeft = nextLeft > 0 ? 0 : nextLeft
        }
        break;
      case 'down':
        if (left > widthDif) {
          nextLeft = left - this.step
          nextLeft = nextLeft >= widthDif ? nextLeft : widthDif
        }
        break;
      default:
        break;
    }

    this.scrollThrottled(innerEl, nextLeft)
  }

  /**
   * 获取鼠标滚轮滚动方向
   * @param e
   */
  private getWheelDirection(e: WheelEvent) {
    // if (e.wheelDelta) {
    //   return e.wheelDelta > 0 ? 'up' : 'down'
    // } else {
      return e.deltaY > 0 ? 'down' : 'up'
    // }
  }

  private scrollThrottled: SetLeftFn = throttle(
    (el, left) => $(el).css('left', left), 200
  )

}
