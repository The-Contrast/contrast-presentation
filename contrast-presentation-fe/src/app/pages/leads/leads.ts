import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { INTERESTS } from '../../core/content';
import { LeadService } from '../../core/lead.service';

/** Booth-device lead list: /leads (leads captured on THIS device only). */
@Component({
  selector: 'app-leads',
  imports: [DatePipe],
  template: `
    <header>
      <h1>Leads <span>{{ svc.leads().length }}</span></h1>
      <div class="actions">
        <button type="button" (click)="csv()" [disabled]="!svc.leads().length">Export CSV</button>
        <button type="button" class="danger" (click)="wipe()" [disabled]="!svc.leads().length">
          {{ confirm() ? 'Tap again to delete all' : 'Clear all' }}
        </button>
      </div>
    </header>
    <p class="note">Shows leads submitted from this device's browser. Leads from visitors' own phones go to your lead endpoint (see README).</p>

    @for (l of svc.leads(); track l.id) {
      <article>
        <div class="top"><strong>{{ l.name }}</strong><time>{{ l.createdAt | date: 'd MMM, h:mm a' }}</time></div>
        <a [href]="'tel:' + l.phone">{{ l.phone }}</a>
        @if (l.email) { · <a [href]="'mailto:' + l.email">{{ l.email }}</a> }
        @if (l.company) { <div>{{ l.company }}</div> }
        <div class="tags">
          @for (i of label(l.interests); track i) { <span>{{ i }}</span> }
          <span class="muted">{{ l.budget }}</span><span class="muted">{{ l.timeline }}</span>
        </div>
        @if (l.message) { <p>{{ l.message }}</p> }
        <small>{{ l.synced ? '✓ synced' : '• not synced' }}</small>
      </article>
    } @empty {
      <p class="empty">No leads yet.</p>
    }
  `,
  styles: `
    :host { display: block; max-width: 760px; margin: 0 auto; padding: 28px 16px 60px; }
    header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
    h1 { font-size: 32px; margin: 0; } h1 span { color: var(--accent); }
    .actions { display: flex; gap: 8px; }
    button { padding: 11px 18px; border: 0; border-radius: 999px; background: var(--ink); color: #fff; font-weight: 600; }
    button.danger { background: #fff; color: var(--accent); border: 1.5px solid var(--accent); }
    button[disabled] { opacity: 0.4; }
    .note { color: var(--muted); font-size: 13px; margin: 14px 0 22px; }
    article { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px; margin-bottom: 12px; display: block; }
    .top { display: flex; justify-content: space-between; } time { color: var(--muted); font-size: 13px; }
    a { color: inherit; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0; }
    .tags span { font-size: 12px; padding: 4px 10px; border-radius: 999px; background: var(--ink); color: #fff; }
    .tags .muted { background: var(--paper-2); color: var(--ink); }
    p { margin: 6px 0; } small { color: var(--muted); }
    .empty { text-align: center; color: var(--muted); padding: 60px 0; }
  `,
})
export class LeadsPage {
  protected readonly svc = inject(LeadService);
  protected readonly confirm = signal(false);

  protected label(ids: string[]): string[] {
    return ids.map((id) => INTERESTS.find((i) => i.id === id)?.label ?? id);
  }

  protected csv(): void {
    const blob = new Blob([this.svc.toCsv()], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `contrast-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  protected wipe(): void {
    if (!this.confirm()) {
      this.confirm.set(true);
      setTimeout(() => this.confirm.set(false), 4000);
      return;
    }
    this.svc.clear();
    this.confirm.set(false);
  }
}
