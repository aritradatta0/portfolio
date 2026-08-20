import { Component } from '@angular/core';
import { timeline } from '../data/content';
import { Reveal } from '../shared/reveal.directive';
import { Cmd } from '../shared/cmd';

@Component({
  selector: 'app-experience',
  imports: [Reveal, Cmd],
  template: `
    <section id="experience">
      <div class="container">
        <app-cmd text="log experience --since=2019" />
        <h2 class="section-title" appReveal>Experience</h2>
        <div class="timeline">
          @for (entry of entries; track entry.title; let i = $index) {
            <div class="entry" [appReveal]="i * 120">
              <div class="marker" aria-hidden="true"></div>
              <div class="body">
                <p class="period">{{ entry.period }}</p>
                <h3>{{ entry.title }}</h3>
                <p class="org">{{ entry.org }}</p>
                @if (entry.points.length) {
                  <ul>
                    @for (point of entry.points; track point) {
                      <li>{{ point }}</li>
                    }
                  </ul>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .timeline {
      position: relative;
      display: grid;
      gap: 2.4rem;
      padding-left: 1.6rem;
      border-left: 1px solid var(--border);
      max-width: 720px;
    }
    .entry { position: relative; }
    .marker {
      position: absolute;
      left: calc(-1.6rem - 5.5px);
      top: 0.5rem;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 12px rgba(78, 168, 255, 0.8);
    }
    .period {
      color: var(--accent);
      font-size: 0.82rem;
      font-family: var(--font-display);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    h3 {
      font-size: 1.2rem;
      margin-top: 0.3rem;
    }
    .org { color: var(--text-dim); font-size: 0.95rem; }
    ul {
      list-style: none;
      margin-top: 0.7rem;
      display: grid;
      gap: 0.45rem;
      color: var(--text-dim);
      font-size: 0.95rem;

      li {
        position: relative;
        padding-left: 1.15rem;
      }

      li::before {
        content: '▹';
        color: var(--accent);
        position: absolute;
        left: 0;
      }
    }
  `,
})
export class Experience {
  protected readonly entries = timeline;
}
