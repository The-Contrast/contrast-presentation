import { Component, HostListener, signal } from '@angular/core';
import { CONFIG } from '../../core/config';
import { MARQUEE, PRODUCTS, STATS, STEPS, WHY, WORK } from '../../core/content';
import { LeadForm } from '../../shared/lead-form';
import { CountUp, Reveal } from '../../shared/motion';

/** Classic scrolling version of the page (/site). The animated deck lives at /. */
@Component({
  selector: 'app-home',
  imports: [Reveal, CountUp, LeadForm],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly cfg = CONFIG;
  protected readonly products = PRODUCTS;
  protected readonly stats = STATS;
  protected readonly marquee = [...MARQUEE, ...MARQUEE];
  protected readonly work = WORK;
  protected readonly why = WHY;
  protected readonly steps = STEPS;

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly pre = signal<{ id: string } | null>(null);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  protected scrollTo(id: string): void {
    this.menuOpen.set(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  protected pick(productId: string): void {
    this.pre.set({ id: productId });
    this.scrollTo('contact');
  }
}
