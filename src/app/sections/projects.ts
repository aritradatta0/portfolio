import { Component } from '@angular/core';
import { projects } from '../data/content';
import { Reveal } from '../shared/reveal.directive';
import { Tilt } from '../shared/tilt.directive';
import { Cmd } from '../shared/cmd';

@Component({
  selector: 'app-projects',
  imports: [Reveal, Tilt, Cmd],
  template: `
    <section id="projects">
      <div class="container">
        <app-cmd text="show projects --env=production" />
        <h2 class="section-title" appReveal>Things I've built</h2>
        <p class="section-sub" appReveal>
          Production platforms with real users, real payments and real-time everything.
        </p>
        <div class="grid">
          @for (project of list; track project.name; let i = $index) {
            <article class="card" appTilt [appReveal]="(i % 2) * 130">
              <header>
                <h3>{{ project.name }}</h3>
                <p class="tagline">{{ project.tagline }}</p>
                <p class="role">{{ project.role }}</p>
              </header>
              <ul>
                @for (point of project.highlights; track point) {
                  <li>{{ point }}</li>
                }
              </ul>
              <footer>
                @for (tech of project.stack; track tech) {
                  <span class="chip">{{ tech }}</span>
                }
              </footer>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr));
      gap: 1.4rem;
    }
    article {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }
    h3 {
      font-size: 1.35rem;
      color: var(--text);
    }
    .tagline {
      color: var(--accent);
      font-size: 0.9rem;
      margin-top: 0.2rem;
    }
    .role {
      color: var(--text-dim);
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 0.4rem;
    }
    ul {
      list-style: none;
      display: grid;
      gap: 0.55rem;
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
    footer {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: auto;
    }
  `,
})
export class Projects {
  protected readonly list = projects;
}
