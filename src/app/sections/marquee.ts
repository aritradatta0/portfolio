import { Component } from '@angular/core';

const TECH = [
  'Angular', 'TypeScript', 'Node.js', 'MongoDB', 'RxJS', 'Signals', 'SSR',
  'NestJS', 'React', 'React Native', 'Three.js', 'Socket.io', 'OpenAI',
  'Stripe', 'AWS S3', 'GitHub Actions', 'Playwright', 'Figma MCP',
];

@Component({
  selector: 'app-marquee',
  template: `
    <div class="marquee" aria-hidden="true">
      <div class="track">
        @for (row of [0, 1]; track row) {
          <div class="row">
            @for (tech of items; track tech) {
              <span class="item">{{ tech }}</span>
              <span class="sep">◆</span>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .marquee {
      overflow: hidden;
      border-block: 1px solid var(--border);
      padding-block: 1.1rem;
      background: rgba(12, 18, 32, 0.5);
      mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
    }
    .track {
      display: flex;
      width: max-content;
      animation: scroll 36s linear infinite;
    }
    .marquee:hover .track {
      animation-play-state: paused;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 2.2rem;
      padding-right: 2.2rem;
    }
    .item {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--text-dim);
      white-space: nowrap;
      transition: color 0.2s ease;
    }
    .item:hover { color: var(--accent); }
    .sep {
      color: var(--accent);
      font-size: 0.5rem;
      opacity: 0.7;
    }
    @keyframes scroll {
      to { transform: translateX(-50%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .track { animation: none; }
    }
  `,
})
export class Marquee {
  protected readonly items = TECH;
}
