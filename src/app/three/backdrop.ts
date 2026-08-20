import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import type { MorphSceneHandle } from './morph-scene';

/** Fixed full-viewport WebGL layer behind the whole page. Loads lazily; skipped for reduced motion. */
@Component({
  selector: 'app-backdrop',
  template: `
    <div class="backdrop" #host aria-hidden="true"></div>
    <div class="veil" aria-hidden="true"></div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    }
    .veil {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background: radial-gradient(90rem 62vh at 50% 52%, rgba(7, 10, 18, 0.66), transparent 78%);
      opacity: 0.35;
    }
    @supports (animation-timeline: scroll()) {
      .veil {
        animation: veil-in linear both;
        animation-timeline: scroll();
        animation-range: 0 120vh;
      }
      @keyframes veil-in {
        from { opacity: 0.12; }
        to { opacity: 0.95; }
      }
    }
  `,
})
export class Backdrop {
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private scene?: MorphSceneHandle;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const start = () =>
        import('./morph-scene').then((m) => {
          this.scene = m.createMorphScene(this.host().nativeElement, [
            'top', 'about', 'projects', 'skills', 'experience', 'contact',
          ]);
        });
      'requestIdleCallback' in window ? requestIdleCallback(() => start()) : setTimeout(start, 250);
      destroyRef.onDestroy(() => this.scene?.dispose());
    });
  }
}
