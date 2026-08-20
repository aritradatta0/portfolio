import { afterNextRender, Component, DestroyRef, inject } from '@angular/core';

/** Custom cursor: instant dot + trailing ring. Fine pointers only; disabled for reduced motion. */
@Component({
  selector: 'app-cursor',
  template: `
    <div class="cursor-dot" aria-hidden="true"></div>
    <div class="cursor-ring" aria-hidden="true"></div>
  `,
  styles: `
    .cursor-dot, .cursor-ring {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 999;
      border-radius: 50%;
      will-change: transform;
    }
    :host-context(html.custom-cursor) .cursor-dot,
    :host-context(html.custom-cursor) .cursor-ring {
      display: block;
    }
    .cursor-dot {
      width: 8px;
      height: 8px;
      background: var(--accent);
      margin: -4px 0 0 -4px;
    }
    .cursor-ring {
      width: 38px;
      height: 38px;
      border: 1.5px solid rgba(78, 168, 255, 0.55);
      margin: -19px 0 0 -19px;
      transition: width 0.25s ease, height 0.25s ease, margin 0.25s ease, border-color 0.25s ease;
    }
    :host-context(html.cursor-hover) .cursor-ring {
      width: 60px;
      height: 60px;
      margin: -30px 0 0 -30px;
      border-color: var(--accent);
    }
  `,
})
export class Cursor {
  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const fine = window.matchMedia('(pointer: fine)').matches;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!fine || reduced) return;

      const root = document.documentElement;
      root.classList.add('custom-cursor');
      const dot = document.querySelector<HTMLElement>('.cursor-dot')!;
      const ring = document.querySelector<HTMLElement>('.cursor-ring')!;

      let x = innerWidth / 2, y = innerHeight / 2;
      let ringX = x, ringY = y;
      let rafId = 0;

      const onMove = (e: PointerEvent) => {
        x = e.clientX;
        y = e.clientY;
        dot.style.transform = `translate(${x}px, ${y}px)`;
      };
      const onOver = (e: Event) => {
        const target = e.target as HTMLElement;
        root.classList.toggle('cursor-hover', !!target.closest('a, button, .card'));
      };
      const loop = () => {
        rafId = requestAnimationFrame(loop);
        ringX += (x - ringX) * 0.16;
        ringY += (y - ringY) * 0.16;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('mouseover', onOver, { passive: true });
      loop();

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('mouseover', onOver);
        root.classList.remove('custom-cursor', 'cursor-hover');
      });
    });
  }
}
