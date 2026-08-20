import { Component } from '@angular/core';
import { skillGroups } from '../data/content';
import { Reveal } from '../shared/reveal.directive';
import { Cmd } from '../shared/cmd';

@Component({
  selector: 'app-skills',
  imports: [Reveal, Cmd],
  template: `
    <section id="skills">
      <div class="container">
        <app-cmd text="query skills --group=all" />
        <h2 class="section-title" appReveal>Skills</h2>
        <div class="groups">
          @for (group of groups; track group.label; let i = $index) {
            <div class="group card" [appReveal]="i * 100">
              <h3>{{ group.label }}</h3>
              <div class="chips">
                @for (skill of group.skills; track skill) {
                  <span class="chip">{{ skill }}</span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(480px, 100%), 1fr));
      gap: 1.4rem;
    }
    h3 {
      font-size: 1.05rem;
      color: var(--accent);
      margin-bottom: 1rem;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
    }
  `,
})
export class Skills {
  protected readonly groups = skillGroups;
}
