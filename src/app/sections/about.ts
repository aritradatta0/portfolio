import { Component } from '@angular/core';
import { aboutStory } from '../data/content';
import { Reveal } from '../shared/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [Reveal],
  template: `
    <section id="about">
      <div class="container">
        <h2 class="section-title" appReveal><span class="index">01.</span>About</h2>
        <div class="story">
          @for (para of story; track $index; let i = $index) {
            <p [appReveal]="i * 120">{{ para }}</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .story {
      max-width: 68ch;
      display: grid;
      gap: 1.2rem;
      color: var(--text-dim);
      font-size: 1.08rem;

      p:last-child {
        color: var(--text);
        font-weight: 500;
      }
    }
  `,
})
export class About {
  protected readonly story = aboutStory;
}
