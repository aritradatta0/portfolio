import { afterNextRender, Component, signal } from '@angular/core';
import { profile } from '../data/content';
import { Cmd } from '../shared/cmd';

@Component({
  selector: 'app-hero',
  imports: [Cmd],
  template: `
    <section class="hero" id="top">
      <div class="glow" aria-hidden="true"></div>
      <div class="container inner">
        <div class="e" style="animation-delay: .05s">
          <app-cmd text="aritra --init --role=senior-full-stack --base=kolkata --mode=ai-native" />
        </div>
        <h1 class="name" aria-label="{{ p.name }}">
          @for (word of words; track $index; let wi = $index) {
            <span class="word" aria-hidden="true">
              @for (ch of word; track $index; let ci = $index) {
                <span class="ch" [style.animation-delay]="0.45 + (wi * 7 + ci) * 0.045 + 's'">{{ ch }}</span>
              }
            </span>
          }
        </h1>
        <p class="role e" style="animation-delay: 1.1s">
          {{ p.headline }}
          <span class="tags">
            @for (tag of p.tags; track tag; let last = $last) {
              <span class="tag">{{ tag }}</span>@if (!last) {<span class="dot">•</span>}
            }
          </span>
        </p>
        <div class="stats e" style="animation-delay: 1.3s">
          @for (s of p.stats; track s.label; let i = $index) {
            <div class="stat">
              <span class="value">{{ shown()[i] }}</span>
              <span class="label">{{ s.label }}</span>
            </div>
          }
        </div>
        <div class="cta e" style="animation-delay: 1.5s">
          <a class="btn primary" href="#projects">View my work</a>
          <a class="btn" href="Aritra_Datta_Resume.pdf" download>Download CV</a>
          <a class="btn" [href]="p.github" target="_blank" rel="noopener">GitHub</a>
          <a class="btn" [href]="p.linkedin" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
      <div class="scroll-hint e" style="animation-delay: 2s" aria-hidden="true">
        <span class="wheel"></span>
      </div>
    </section>
  `,
  styles: `
    .hero {
      min-height: 100svh;
      display: flex;
      align-items: center;
      position: relative;
      padding-block: 6rem;
    }
    .glow {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(600px 400px at 70% 25%, rgba(78, 168, 255, 0.13), transparent 70%),
        radial-gradient(500px 380px at 20% 80%, rgba(31, 62, 90, 0.35), transparent 70%);
      pointer-events: none;
    }
    .inner {
      position: relative;
      z-index: 1;
    }
    .name {
      font-size: clamp(2.6rem, 9vw, 6rem);
      letter-spacing: -0.02em;
      margin-top: 0.6rem;
      text-shadow: none;
    }
    .word {
      display: inline-block;
      white-space: nowrap;
    }
    .word:not(:last-child) {
      margin-right: 0.26em;
    }
    .ch {
      display: inline-block;
      opacity: 0;
      transform: translateY(0.6em) rotate(4deg);
      filter: blur(6px);
      animation: chIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      background: linear-gradient(120deg, #ffffff 30%, #6cb8ff 90%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      min-width: 0.28em;
    }
    @keyframes chIn {
      to { opacity: 1; transform: none; filter: blur(0); }
    }
    .e {
      opacity: 0;
      animation: fadeUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: none; }
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
      font-variant-numeric: tabular-nums;
    }
    .label { color: var(--text-dim); font-size: 0.85rem; }
    .cta {
      display: flex;
      gap: 0.9rem;
      margin-top: 2.8rem;
      flex-wrap: wrap;
    }
    .scroll-hint {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      width: 26px;
      height: 42px;
      border: 1.5px solid var(--text-dim);
      border-radius: 999px;
      display: flex;
      justify-content: center;
      padding-top: 8px;
    }
    .wheel {
      width: 4px;
      height: 8px;
      border-radius: 999px;
      background: var(--accent);
      animation: wheel 1.8s ease-in-out infinite;
    }
    @keyframes wheel {
      0% { transform: translateY(0); opacity: 1; }
      70% { transform: translateY(14px); opacity: 0; }
      100% { transform: translateY(0); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .ch, .e { animation: none; opacity: 1; transform: none; filter: none; }
      .wheel { animation: none; }
    }
  `,
})
export class Hero {
  protected readonly p = profile;
  protected readonly words = profile.name.split(' ').map((w) => w.split(''));
  protected readonly shown = signal(profile.stats.map((s) => s.value as string));

  constructor() {
    afterNextRender(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // zero the values while the stats block is still faded out,
        // then start counting as it becomes visible (entrance delay is 1.3s)
        this.shown.set(profile.stats.map((s) => s.value.replace(/\d+(?:\.\d+)?/, '0')));
        setTimeout(() => this.animateStats(), 1350);
      }
    });
  }

  /** Counts each stat up from 0 to its target, staggered (e.g. "300K+" ticks 0K+ → 300K+). */
  private animateStats() {
    const targets = profile.stats.map((s) => {
      const match = /^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/.exec(s.value);
      return match
        ? { prefix: match[1], num: parseFloat(match[2]), suffix: match[3], decimals: match[2].includes('.') ? 1 : 0 }
        : null;
    });
    const duration = 1800;
    const stagger = 220;
    const startTime = performance.now();
    const tick = (now: number) => {
      let done = true;
      this.shown.set(
        profile.stats.map((s, i) => {
          const t = targets[i];
          if (!t) return s.value;
          const progress = Math.min(Math.max((now - startTime - i * stagger) / duration, 0), 1);
          if (progress < 1) done = false;
          const eased = 1 - Math.pow(1 - progress, 3);
          return `${t.prefix}${(t.num * eased).toFixed(t.decimals)}${t.suffix}`;
        }),
      );
      if (!done) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
