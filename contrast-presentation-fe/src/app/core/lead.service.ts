import { Injectable, signal } from '@angular/core';
import { CONFIG } from './config';

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  interests: string[];
  budget: string;
  timeline: string;
  message: string;
  synced: boolean;
}

export type NewLead = Omit<Lead, 'id' | 'createdAt' | 'synced'>;

const KEY = 'contrast.leads.v1';

@Injectable({ providedIn: 'root' })
export class LeadService {
  readonly leads = signal<Lead[]>(this.read());

  /** Saves locally first (never lose a lead), then tries to send to the endpoint. */
  async submit(data: NewLead): Promise<{ saved: true; synced: boolean }> {
    const lead: Lead = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      synced: false,
    };
    this.write([lead, ...this.leads()]);
    const synced = await this.send(lead);
    if (synced) this.update(lead.id, { synced: true });
    return { saved: true, synced };
  }

  /** Retry anything that failed earlier (e.g. patchy exhibition Wi-Fi). */
  async syncPending(): Promise<void> {
    for (const lead of this.leads().filter((l) => !l.synced)) {
      if (await this.send(lead)) this.update(lead.id, { synced: true });
    }
  }

  clear(): void {
    this.write([]);
  }

  toCsv(): string {
    const cols: (keyof Lead)[] = ['createdAt', 'name', 'phone', 'email', 'company', 'interests', 'budget', 'timeline', 'message', 'synced'];
    const esc = (v: unknown) => `"${String(Array.isArray(v) ? v.join('; ') : v).replace(/"/g, '""')}"`;
    return [cols.join(','), ...this.leads().map((l) => cols.map((c) => esc(l[c])).join(','))].join('\n');
  }

  private async send(lead: Lead): Promise<boolean> {
    if (!CONFIG.leadEndpoint) return false;
    try {
      // text/plain avoids a CORS preflight, which Google Apps Script web apps cannot answer.
      await fetch(CONFIG.leadEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...lead, source: 'exhibition-qr' }),
      });
      return true;
    } catch {
      return false;
    }
  }

  private update(id: string, patch: Partial<Lead>): void {
    this.write(this.leads().map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  private read(): Lead[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private write(list: Lead[]): void {
    this.leads.set(list);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* storage unavailable (private mode); lead still lives in memory */
    }
  }
}
