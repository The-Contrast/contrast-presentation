import { Component, OnDestroy, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONFIG } from '../core/config';
import { BUDGETS, INTERESTS, TIMELINES } from '../core/content';
import { LeadService } from '../core/lead.service';

/** The requirement form, reusable on any page. */
@Component({
  selector: 'app-lead-form',
  imports: [ReactiveFormsModule],
  template: `
    <div class="card">
      @if (done()) {
        <div class="success">
          <div class="check" aria-hidden="true">✓</div>
          <h3>Thank you, {{ lastName() }}!</h3>
          <p>We have your requirement and will get back to you within one working day.</p>
          <button class="btn accent" type="button" (click)="goNow()">Continue to thecontrast.in →</button>
          <a class="btn ghost" [href]="whatsappLink()" target="_blank" rel="noopener">Also send on WhatsApp</a>
          @if (countdown() > 0) {
            <p class="redir">Taking you to thecontrast.in in {{ countdown() }}s · <button class="link" type="button" (click)="stay()">Stay here</button></p>
          } @else {
            <button class="link" type="button" (click)="reset()">Submit another response</button>
          }
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="row">
            <label class="field" [class.err]="invalid('name')">
              <span>Your name *</span>
              <input type="text" formControlName="name" autocomplete="name" placeholder="Full name">
              @if (invalid('name')) { <small>Please enter your name</small> }
            </label>
            <label class="field" [class.err]="invalid('phone')">
              <span>Phone / WhatsApp *</span>
              <input type="tel" formControlName="phone" autocomplete="tel" inputmode="tel" placeholder="+91 …">
              @if (invalid('phone')) { <small>Enter a valid phone number</small> }
            </label>
          </div>
          <div class="row">
            <label class="field" [class.err]="invalid('email')">
              <span>Email</span>
              <input type="email" formControlName="email" autocomplete="email" placeholder="you@company.com">
              @if (invalid('email')) { <small>Enter a valid email</small> }
            </label>
            <label class="field">
              <span>Company</span>
              <input type="text" formControlName="company" autocomplete="organization" placeholder="Company name">
            </label>
          </div>

          <fieldset class="field" [class.err]="invalid('interests')">
            <legend>I'm interested in *</legend>
            <div class="chips">
              @for (i of interests; track i.id) {
                <button type="button" class="chip" [class.on]="has(i.id)" [attr.aria-pressed]="has(i.id)" (click)="toggle(i.id)">
                  {{ i.label }}
                </button>
              }
            </div>
            @if (invalid('interests')) { <small>Pick at least one</small> }
          </fieldset>

          <div class="row">
            <label class="field">
              <span>Budget</span>
              <select formControlName="budget">
                @for (b of budgets; track b) { <option [value]="b">{{ b }}</option> }
              </select>
            </label>
            <label class="field">
              <span>Timeline</span>
              <select formControlName="timeline">
                @for (t of timelines; track t) { <option [value]="t">{{ t }}</option> }
              </select>
            </label>
          </div>

          <label class="field">
            <span>Your requirement</span>
            <textarea rows="2" formControlName="message" placeholder="Tell us about your idea, problem or goal…"></textarea>
          </label>

          <button class="btn accent submit" type="submit" [disabled]="sending()">
            {{ sending() ? 'Sending…' : 'Send my requirement' }}
          </button>
        </form>
      }
    </div>
  `,
  styles: `
    :host { display: block; color: var(--ink); text-align: left; }
    .card { background: var(--paper); border-radius: 26px; padding: clamp(18px, 2.4vw, 28px); box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.7); }
    form { display: grid; gap: 10px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 560px) { .row { grid-template-columns: 1fr; } }
    .field { display: grid; gap: 5px; border: 0; padding: 0; margin: 0; min-width: 0; }
    .field > span, legend { font-size: 12.5px; font-weight: 600; padding: 0; margin-bottom: 3px; }
    input, select, textarea {
      width: 100%; font: inherit; font-size: 16px; padding: 9px 14px; background: #fff; color: var(--ink);
      border: 1.5px solid var(--line); border-radius: 13px; transition: border-color 0.2s, box-shadow 0.2s;
    }
    textarea { resize: vertical; min-height: 56px; }
    input:focus, select:focus, textarea:focus { outline: none; border-color: var(--ink); box-shadow: 0 0 0 4px rgba(17, 17, 19, 0.08); }
    .err input, .err select { border-color: var(--accent); }
    small { font-size: 12.5px; color: var(--accent); }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { padding: 7px 14px; border-radius: 999px; background: #fff; border: 1.5px solid var(--line); font-size: 14px; font-weight: 500; color: var(--ink); transition: all 0.25s var(--ease); }
    .chip:hover { border-color: var(--ink); }
    .chip.on { background: var(--ink); color: #fff; border-color: var(--ink); transform: scale(1.03); }
    .chip.on::before { content: '✓ '; color: var(--accent); }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 13px 24px; border-radius: 999px; border: 1.5px solid transparent; font-weight: 600; font-size: 15px; text-decoration: none; transition: transform 0.3s var(--ease), box-shadow 0.3s; }
    .btn.accent { background: var(--accent); color: #fff; box-shadow: 0 10px 30px -10px rgba(255, 59, 31, 0.7); }
    .btn.accent:hover { transform: translateY(-2px); }
    .btn.ghost { color: var(--ink); border-color: var(--line); }
    .btn.ghost:hover { border-color: var(--ink); }
    .btn[disabled] { opacity: 0.6; pointer-events: none; }
    .submit { width: 100%; margin-top: 2px; }
    .success { display: grid; gap: 12px; justify-items: center; text-align: center; padding: 16px 0; }
    .success h3 { font-size: 30px; font-weight: 900; }
    .success p { color: var(--muted); max-width: 34ch; }
    .success .btn { width: 100%; max-width: 300px; }
    .check { width: 68px; height: 68px; border-radius: 50%; background: #2ee66b; color: #fff; font-size: 32px; display: grid; place-items: center; animation: pop 0.6s var(--ease); }
    @keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }
    .redir { font-size: 13px; color: var(--muted); }
    .link { background: none; border: 0; color: var(--muted); text-decoration: underline; font-size: 14px; }
  `,
})
export class LeadForm implements OnDestroy {
  /** Set a new object to pre-select an interest (e.g. from a product slide). */
  readonly preselect = input<{ id: string } | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly leads = inject(LeadService);

  protected readonly cfg = CONFIG;
  protected readonly interests = INTERESTS;
  protected readonly budgets = BUDGETS;
  protected readonly timelines = TIMELINES;

  protected readonly sending = signal(false);
  protected readonly done = signal(false);
  protected readonly submitted = signal(false);
  protected readonly lastName = signal('');
  protected readonly countdown = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+()\-\s\d]{7,18}$/)]],
    email: ['', Validators.email],
    company: [''],
    interests: [[] as string[], Validators.required],
    budget: [BUDGETS[0]],
    timeline: [TIMELINES[0]],
    message: [''],
  });

  constructor() {
    effect(() => {
      const p = this.preselect();
      if (!p) return;
      const cur = this.form.controls.interests.value;
      if (!cur.includes(p.id)) this.form.controls.interests.setValue([...cur, p.id]);
    });
    void this.leads.syncPending();
  }

  protected has(id: string): boolean {
    return this.form.controls.interests.value.includes(id);
  }

  protected toggle(id: string): void {
    const cur = this.form.controls.interests.value;
    this.form.controls.interests.setValue(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
    this.form.controls.interests.markAsTouched();
  }

  protected invalid(name: 'name' | 'phone' | 'email' | 'interests'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.submitted());
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid || this.sending()) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    const v = this.form.getRawValue();
    await this.leads.submit(v);
    this.lastName.set(v.name.split(' ')[0]);
    this.sending.set(false);
    this.done.set(true);
    this.startRedirect();
  }

  protected whatsappLink(): string {
    const v = this.form.getRawValue();
    const picked = INTERESTS.filter((i) => v.interests.includes(i.id)).map((i) => i.label).join(', ');
    const text =
      `Hi The Contrast team, I met you at the exhibition.\n` +
      `Name: ${v.name}\nCompany: ${v.company || '-'}\nInterested in: ${picked || '-'}\n` +
      `Budget: ${v.budget}\nTimeline: ${v.timeline}\n${v.message ? 'Note: ' + v.message : ''}`;
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text.trim())}`;
  }

  protected goNow(): void {
    this.stay();
    window.location.href = CONFIG.redirectUrl;
  }

  protected stay(): void {
    clearInterval(this.timer);
    this.countdown.set(0);
  }

  private startRedirect(): void {
    if (!CONFIG.redirectUrl) return;
    clearInterval(this.timer);
    this.countdown.set(CONFIG.redirectDelaySec);
    this.timer = setInterval(() => {
      const n = this.countdown() - 1;
      this.countdown.set(n);
      if (n <= 0) this.goNow();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  protected reset(): void {
    this.stay();
    this.form.reset();
    this.form.controls.interests.setValue([]);
    this.submitted.set(false);
    this.done.set(false);
  }
}
