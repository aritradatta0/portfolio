import { Component } from '@angular/core';
import { profile } from '../data/content';
import { Reveal } from '../shared/reveal.directive';

@Component({
  selector: 'app-contact',
  imports: [Reveal],
  template: `
    <section id="contact">
      <div class="container inner">
        <h2 class="section-title" appReveal><span class="index">05.</span>Let's talk</h2>
        <p class="pitch" appReveal>
          I'm currently open to senior full-stack roles. If you need someone who ships
          Angular and Node at scale — and directs AI like a team — my inbox is open.
        </p>
        <div class="actions" [appReveal]="150">
          <a class="btn primary" [href]="'mailto:' + p.email">{{ p.email }}</a>
          <a class="btn" [href]="p.linkedin" target="_blank" rel="noopener">LinkedIn</a>
          <a class="btn" [href]="p.github" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .inner {
      text-align: center;
      padding-block: 3rem;
    }
    .section-title { justify-content: center; }
    .pitch {
      color: var(--text-dim);
      max-width: 54ch;
      margin: 0 auto 2.4rem;
      font-size: 1.08rem;
    }
    .actions {
      display: flex;
      justify-content: center;
      gap: 0.9rem;
      flex-wrap: wrap;
    }
  `,
})
export class Contact {
  protected readonly p = profile;
}
