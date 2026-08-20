import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

/** Perspective tilt that follows the pointer. Fine pointers only; disabled for reduced motion. */
@Directive({ selector: '[appTilt]' })
export class Tilt {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const fine = window.matchMedia('(pointer: fine)').matches;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!fine || reduced) return;

      const node = this.el.nativeElement;
      node.style.transformStyle = 'preserve-3d';

      const onMove = (e: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        node.style.transform =
          `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
      };
      const onLeave = () => {
        node.style.transform = '';
      };

      node.addEventListener('pointermove', onMove, { passive: true });
      node.addEventListener('pointerleave', onLeave, { passive: true });
    });
  }
}
