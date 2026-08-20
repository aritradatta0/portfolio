import { afterNextRender, Component, DestroyRef, inject } from '@angular/core';
import { Hero } from './sections/hero';
import { About } from './sections/about';
import { Projects } from './sections/projects';
import { Skills } from './sections/skills';
import { Experience } from './sections/experience';
import { Contact } from './sections/contact';
import { Marquee } from './sections/marquee';
import { Cursor } from './shared/cursor';
import { Backdrop } from './three/backdrop';

@Component({
  selector: 'app-root',
  imports: [Hero, About, Projects, Skills, Experience, Contact, Marquee, Cursor, Backdrop],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.initNavAutoHide(destroyRef);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.initSmoothScroll(destroyRef);
      }
    });
  }

  /** Lenis inertia scrolling + smooth anchor navigation. */
  private async initSmoothScroll(destroyRef: DestroyRef) {
    const { default: Lenis } = await import('lenis');
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onClick = (e: Event) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      e.preventDefault();
      lenis.scrollTo(anchor.getAttribute('href')!, { offset: -70 });
    };
    document.addEventListener('click', onClick);

    destroyRef.onDestroy(() => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    });
  }

  /** Hides the nav while scrolling down, reveals it on scroll up. */
  private initNavAutoHide(destroyRef: DestroyRef) {
    const nav = document.querySelector<HTMLElement>('.nav');
    if (!nav) return;
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('nav-hidden', y > lastY && y > 140);
      nav.classList.toggle('nav-scrolled', y > 20);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
  }
}
