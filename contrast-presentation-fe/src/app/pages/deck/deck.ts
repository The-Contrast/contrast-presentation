import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import QRCode from 'qrcode';
import { CONFIG } from '../../core/config';
import { CM_APPS, CM_FEATURES, COMPARE, MC_LANGS, MC_STEPS, PRODUCTS, PROBLEMS, STATS, WORK } from '../../core/content';
import { CountUp } from '../../shared/motion';
import { LeadForm } from '../../shared/lead-form';

interface Theme { a: string; b: string }

const THEMES: Theme[] = [
  { a: '#e8321a', b: '#6a3df0' }, // 0 title
  { a: '#e8321a', b: '#f59e0b' }, // 1 problem
  { a: '#00806f', b: '#2563eb' }, // 2 meetcard
  { a: '#00806f', b: '#16a34a' }, // 3 meetcard flow
  { a: '#5b4be0', b: '#0ea5e9' }, // 4 communicator
  { a: '#5b4be0', b: '#db2777' }, // 5 communicator features
  { a: '#c2610a', b: '#e8321a' }, // 6 why us
  { a: '#2563eb', b: '#0891b2' }, // 7 proof
  { a: '#e8321a', b: '#f59e0b' }, // 8 engage
  { a: '#e8321a', b: '#6a3df0' }, // 9 contact
];

const NAMES = ['Welcome', 'The problem', 'MeetCard', 'How MeetCard works', 'Communicator', 'Why Communicator', 'Why The Contrast', 'Proof', 'Work with us', 'Say hello'];

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

@Component({
  selector: 'app-deck',
  imports: [CountUp, LeadForm],
  templateUrl: './deck.html',
  styleUrl: './deck.css',
})
export class Deck implements OnInit, AfterViewInit, OnDestroy {
  protected readonly cfg = CONFIG;
  protected readonly mc = PRODUCTS.find((p) => p.id === 'meetcard')!;
  protected readonly cm = PRODUCTS.find((p) => p.id === 'communicator')!;
  protected readonly sw = PRODUCTS.find((p) => p.id === 'software')!;
  protected readonly problems = PROBLEMS;
  protected readonly compare = COMPARE;
  protected readonly work = WORK;
  protected readonly stats = STATS;
  protected readonly mcSteps = MC_STEPS;
  protected readonly mcLangs = MC_LANGS;
  protected readonly apps = CM_APPS.map((name, i) => ({ name, r: i * (360 / CM_APPS.length) }));
  protected readonly cmFeatures = CM_FEATURES;

  protected readonly total = THEMES.length;
  protected readonly dots = THEMES.map((_, i) => i);
  protected readonly idx = signal(this.fromHash());
  protected readonly playing = signal(false);
  protected readonly hint = signal(true);
  protected readonly preselect = signal<{ id: string } | null>(null);
  protected readonly qr = signal<Record<string, string>>({});
  protected readonly more = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly theme = computed(() => THEMES[this.idx()]);
  protected readonly name = computed(() => NAMES[this.idx()]);
  protected readonly counter = computed(() => String(this.idx() + 1).padStart(2, '0'));
  protected readonly progress = computed(() => ((this.idx() + 1) / this.total) * 100);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('bg');
  private raf = 0;
  private autoplay?: ReturnType<typeof setInterval>;
  private lastWheel = 0;
  private touchX = 0;
  private touchY = 0;
  private resize = () => {};

  constructor() {
    effect(() => {
      this.idx();
      this.more.set(false);
      setTimeout(() => this.checkScroll(), 1000);
    });
  }

  private readonly onInnerScroll = () => this.checkScroll();

  private checkScroll(): void {
    const el = this.host.nativeElement.querySelector<HTMLElement>('.slide[data-state="active"]');
    this.more.set(!!el && el.scrollHeight > el.clientHeight + 12 && el.scrollTop + el.clientHeight < el.scrollHeight - 12);
  }

  protected nudge(): void {
    const el = this.host.nativeElement.querySelector<HTMLElement>('.slide[data-state="active"]');
    el?.scrollBy({ top: el.clientHeight * 0.7, behavior: 'smooth' });
  }

  async ngOnInit(): Promise<void> {
    const out: Record<string, string> = {};
    for (const p of [this.mc, this.cm]) {
      if (p.url) {
        out[p.id] = await QRCode.toDataURL(p.url, { width: 360, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#111113', light: '#ffffff' } });
      }
    }
    this.qr.set(out);
  }

  // ---------- navigation ----------
  protected go(i: number): void {
    const n = Math.max(0, Math.min(this.total - 1, i));
    if (n === this.idx()) return;
    this.idx.set(n);
    this.hint.set(false);
    try { history.replaceState(null, '', `#${n + 1}`); } catch { /* ignore */ }
  }
  protected next(): void { this.go(this.idx() + 1); }
  protected prev(): void { this.go(this.idx() - 1); }

  protected state(i: number): 'active' | 'before' | 'after' {
    const c = this.idx();
    return i === c ? 'active' : i < c ? 'before' : 'after';
  }

  protected pick(id: string): void {
    this.preselect.set({ id });
    this.go(this.total - 1);
  }

  protected toggleAutoplay(): void {
    const on = !this.playing();
    this.playing.set(on);
    clearInterval(this.autoplay);
    if (on) {
      this.autoplay = setInterval(() => this.go(this.idx() >= this.total - 1 ? 0 : this.idx() + 1), 9000);
    }
  }

  protected fullscreen(): void {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.();
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    const t = e.target as HTMLElement;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': e.preventDefault(); this.next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': e.preventDefault(); this.prev(); break;
      case 'Home': this.go(0); break;
      case 'End': this.go(this.total - 1); break;
      case 'f': case 'F': this.fullscreen(); break;
      case 'p': case 'P': this.toggleAutoplay(); break;
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent): void {
    if (Math.abs(e.deltaY) < 30 || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    const sc = (e.target as HTMLElement).closest('.slide') as HTMLElement | null;
    if (sc && sc.scrollHeight > sc.clientHeight + 2) {
      const atEnd = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2;
      if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && sc.scrollTop > 2)) return;
    }
    const now = Date.now();
    if (now - this.lastWheel < 900) return;
    this.lastWheel = now;
    e.deltaY > 0 ? this.next() : this.prev();
  }

  private pRaf = 0;
  @HostListener('window:mousemove', ['$event'])
  onMouse(e: MouseEvent): void {
    if (this.pRaf) return;
    this.pRaf = requestAnimationFrame(() => {
      this.pRaf = 0;
      const el = this.host.nativeElement.querySelector<HTMLElement>('.deck');
      el?.style.setProperty('--px', String((e.clientX / innerWidth - 0.5) * 2));
      el?.style.setProperty('--py', String((e.clientY / innerHeight - 0.5) * 2));
    });
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent): void {
    this.touchX = e.touches[0].clientX;
    this.touchY = e.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchX;
    const dy = e.changedTouches[0].clientY - this.touchY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? this.next() : this.prev());
  }

  // ---------- animated particle background ----------
  ngAfterViewInit(): void {
    this.host.nativeElement.addEventListener('scroll', this.onInnerScroll, true);
    addEventListener('resize', this.onInnerScroll);
    const cvs = this.canvas().nativeElement;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, dpr = 1;
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];
    let col: [number, number, number] = hexToRgb(this.theme().a);

    this.resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      cvs.width = w * dpr; cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(w < 700 ? 34 : 90, Math.floor((w * h) / 15000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6,
      }));
    };
    this.resize();
    addEventListener('resize', this.resize);

    const frame = () => {
      const target = hexToRgb(this.theme().a);
      col = col.map((c, i) => c + (target[i] - c) * 0.04) as [number, number, number];
      const rgb = `${col[0] | 0},${col[1] | 0},${col[2] | 0}`;
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(${rgb},0.5)`;
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = dx * dx + dy * dy;
          if (d < 14400) {
            ctx.strokeStyle = `rgba(${rgb},${(1 - d / 14400) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      if (!reduce) this.raf = requestAnimationFrame(frame);
    };
    frame();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    clearInterval(this.autoplay);
    removeEventListener('resize', this.resize);
    removeEventListener('resize', this.onInnerScroll);
    this.host.nativeElement.removeEventListener('scroll', this.onInnerScroll, true);
  }

  private fromHash(): number {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? Math.max(0, Math.min(THEMES.length - 1, n - 1)) : 0;
  }
}
