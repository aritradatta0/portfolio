import { Component } from '@angular/core';
import { Hero } from './sections/hero';
import { About } from './sections/about';
import { Projects } from './sections/projects';
import { Skills } from './sections/skills';
import { Experience } from './sections/experience';
import { Contact } from './sections/contact';

@Component({
  selector: 'app-root',
  imports: [Hero, About, Projects, Skills, Experience, Contact],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
