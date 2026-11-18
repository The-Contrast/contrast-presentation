import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/** Fades/slides an element in the first time it scrolls into view. */
@Directive({ selector: '[reveal]' })
export class Reveal implements OnInit, OnDestroy {
  readonly delay = input<number | string>(0, { alias: 'reveal' });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;

  ngOnInit(): void {
    const el = this.el;
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${Number(this.delay()) || 0}ms`);
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }
    this.io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          this.io?.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    this.io.observe(el);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}

/** Counts up to a number when scrolled into view. `plain` skips thousands separators (for years). */
@Directive({ selector: '[countUp]' })
export class CountUp implements OnInit, OnDestroy {
  readonly target = input.required<number>({ alias: 'countUp' });
  readonly suffix = input('');
  readonly plain = input(false);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private io?: IntersectionObserver;
  private raf = 0;

  ngOnInit(): void {
    const fmt = (n: number) => (this.plain() ? String(n) : n.toLocaleString('en-US')) + this.suffix();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.el.textContent = fmt(reduce || typeof IntersectionObserver === 'undefined' ? this.target() : 0);
    if (reduce || typeof IntersectionObserver === 'undefined') return;

    this.io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      this.io?.disconnect();
      const start = performance.now();
      const dur = 1600;
      const from = this.plain() ? this.target() - 40 : 0;
      const tick = (now: number) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        this.el.textContent = fmt(Math.round(from + (this.target() - from) * eased));
        if (t < 1) this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    });
    this.io.observe(this.el);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
    cancelAnimationFrame(this.raf);
  }
}
