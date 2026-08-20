import { afterNextRender, Component, ElementRef, inject, input, signal } from '@angular/core';

/** Terminal-style command line that types itself when scrolled into view. */
@Component({
  selector: 'app-cmd',
  template: `
    <span class="cmd" role="presentation">
      <span class="prompt">&gt;</span> {{ shown() }}<span class="caret"></span>
    </span>
  `,
  styles: `
    .cmd {
      font-family: var(--font-mono);
      font-size: 0.92rem;
      color: var(--text-dim);
      letter-spacing: 0.02em;
      display: inline-block;
      margin-bottom: 0.6rem;
    }
    .prompt {
      color: var(--accent);
      font-weight: 600;
    }
    .caret {
      display: inline-block;
      width: 8px;
      height: 1em;
      margin-left: 3px;
      background: var(--accent);
      vertical-align: text-bottom;
      animation: blink 1.1s steps(1) infinite;
    }
    @keyframes blink {
      50% { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .caret { animation: none; }
    }
  `,
})
export class Cmd {
  readonly text = input.required<string>();
  protected readonly shown = signal('');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const full = this.text();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.shown.set(full);
        return;
      }
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          let i = 0;
          const step = () => {
            i++;
            this.shown.set(full.slice(0, i));
            if (i < full.length) setTimeout(step, 26 + Math.random() * 34);
          };
          step();
        },
        { threshold: 0.4 },
      );
      io.observe(this.el.nativeElement);
    });
  }
}
