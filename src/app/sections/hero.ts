import { Component } from '@angular/core';
import { profile } from '../data/content';

@Component({
  selector: 'app-hero',
  template: `
    <section class="hero" id="top">
      <div class="glow" aria-hidden="true"></div>
      <div class="canvas-host" id="hero-canvas" aria-hidden="true"></div>
      <div class="container inner">
        <p class="kicker">{{ p.location }}</p>
        <h1 class="name">{{ p.name }}</h1>
        <p class="role">
          {{ p.headline }}
          <span class="tags">
            @for (tag of p.tags; track tag; let last = $last) {
              <span class="tag">{{ tag }}</span>@if (!last) {<span class="dot">•</span>}
            }
          </span>
        </p>
        <div class="stats">
          @for (s of p.stats; track s.label) {
            <div class="stat">
              <span class="value">{{ s.value }}</span>
              <span class="label">{{ s.label }}</span>
            </div>
          }
        </div>
        <div class="cta">
          <a class="btn primary" href="#projects">View my work</a>
          <a class="btn" href="Aritra_Datta_Resume.pdf" download>Download CV</a>
          <a class="btn" [href]="p.github" target="_blank" rel="noopener">GitHub</a>
          <a class="btn" [href]="p.linkedin" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      min-height: 100svh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding-block: 6rem;
    }
    .glow {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(600px 400px at 70% 25%, rgba(78, 168, 255, 0.14), transparent 70%),
        radial-gradient(500px 380px at 20% 80%, rgba(31, 62, 90, 0.35), transparent 70%);
      pointer-events: none;
    }
    .canvas-host {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    .inner {
      position: relative;
      z-index: 1;
    }
    .kicker {
      color: var(--accent);
      font-family: var(--font-display);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }
    .name {
      font-size: clamp(3rem, 9vw, 6rem);
      letter-spacing: -0.02em;
      background: linear-gradient(120deg, #ffffff 30%, #6cb8ff 90%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .role {
      margin-top: 1.2rem;
      font-size: clamp(1.05rem, 2.2vw, 1.35rem);
      color: var(--text-dim);
    }
    .tags { margin-left: 0.6rem; }
    .tag { color: var(--text); font-weight: 500; }
    .dot { color: var(--accent); margin-inline: 0.45rem; }
    .stats {
      display: flex;
      gap: 2.5rem;
      margin-top: 2.6rem;
      flex-wrap: wrap;
    }
    .stat { display: flex; flex-direction: column; }
    .value {
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 600;
      color: var(--accent);
    }
    .label { color: var(--text-dim); font-size: 0.85rem; }
    .cta {
      display: flex;
      gap: 0.9rem;
      margin-top: 2.8rem;
      flex-wrap: wrap;
    }
  `,
})
export class Hero {
  protected readonly p = profile;
}
