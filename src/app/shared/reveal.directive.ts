import { afterNextRender, Directive, ElementRef, inject, input } from '@angular/core';

/** Fades an element in when it scrolls into view. Optional value = transition delay in ms. */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly delay = input(0, {
    alias: 'appReveal',
    transform: (v: unknown) => (v === '' || v == null ? 0 : Number(v)),
  });

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      node.classList.add('reveal');
      node.style.transitionDelay = `${this.delay()}ms`;
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add('in');
              io.disconnect();
            }
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
      );
      io.observe(node);
    });
  }
}
