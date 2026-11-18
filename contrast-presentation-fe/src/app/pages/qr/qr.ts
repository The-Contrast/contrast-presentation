import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import QRCode from 'qrcode';
import { CONFIG } from '../../core/config';

const KEY = 'contrast.qr.url';

/** Printable booth poster: /qr */
@Component({
  selector: 'app-qr',
  imports: [FormsModule],
  template: `
    <div class="tools no-print">
      <label>
        Website URL the QR opens
        <input type="url" [ngModel]="url()" (ngModelChange)="setUrl($event)" placeholder="https://your-deployed-site.com">
      </label>
      <button type="button" (click)="print()">Print poster</button>
      <button type="button" (click)="download()">Download QR (PNG)</button>
      @if (isLocal()) {
        <p class="warn">
          This is a local address. Phones can't open it. Deploy the site first (see README), then paste the live URL above.
        </p>
      }
    </div>

    <main class="poster">
      <p class="eyebrow">Hall · Booth</p>
      <h1>Scan.<br><em>Meet us.</em><br>Build.</h1>
      <div class="qr-box">
        @if (img()) { <img [src]="img()" alt="QR code to open The Contrast page" width="320" height="320"> }
      </div>
      <p class="hint">Point your phone camera here to see our 3 products and share your requirement.</p>
      <div class="brand">the contrast<span>.</span></div>
      <p class="small">{{ cfg.website.replace('https://', '') }} · {{ cfg.phoneDisplay }}</p>
    </main>
  `,
  styles: `
    :host { display: block; min-height: 100vh; background: #e9e9ec; padding: 24px 16px 48px; }
    .tools { max-width: 560px; margin: 0 auto 24px; display: grid; gap: 12px; }
    .tools label { display: grid; gap: 6px; font-size: 13px; font-weight: 600; }
    input { font: inherit; padding: 12px 14px; border: 1.5px solid #ccc; border-radius: 12px; }
    button { padding: 13px; border: 0; border-radius: 12px; background: var(--ink); color: #fff; font-weight: 600; }
    button:last-of-type { background: var(--accent); }
    .warn { background: #fff3cd; padding: 10px 12px; border-radius: 10px; font-size: 13px; margin: 0; }
    .poster {
      max-width: 560px; margin: 0 auto; background: #fff; color: var(--ink); border: 1px solid rgba(15,18,34,.1); box-shadow: 0 30px 70px -40px rgba(15,18,34,.4);
      border-radius: 28px; padding: 48px 36px; text-align: center; display: grid; justify-items: center; gap: 22px;
      aspect-ratio: 3 / 4.2;
    }
    .eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin: 0; }
    h1 { font-size: clamp(44px, 12vw, 76px); font-weight: 900; margin: 0; }
    h1 em { font-style: normal; color: var(--accent); }
    .qr-box { background: #fff; padding: 16px; border-radius: 22px; box-shadow: 0 0 0 8px var(--accent), 0 24px 50px -24px rgba(232,50,26,.6); }
    .qr-box img { width: min(320px, 62vw); height: auto; }
    .hint { max-width: 30ch; color: var(--muted); margin: 0; }
    .brand { font-family: var(--font-display); font-weight: 900; font-size: 26px; }
    .brand span { color: var(--accent); }
    .small { font-family: var(--font-mono); font-size: 12px; color: var(--muted); margin: 0; }
    @media print {
      :host { background: #fff; padding: 0; }
      .poster { border-radius: 0; max-width: none; min-height: 100vh; aspect-ratio: auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `,
})
export class QrPage implements OnInit {
  protected readonly cfg = CONFIG;
  protected readonly url = signal('');
  protected readonly img = signal('');

  ngOnInit(): void {
    let saved = '';
    try { saved = localStorage.getItem(KEY) ?? ''; } catch { /* ignore */ }
    void this.setUrl(saved || CONFIG.siteUrl || location.origin);
  }

  protected isLocal(): boolean {
    return /localhost|127\.0\.0\.1|^http:\/\/192\.168\./.test(this.url());
  }

  protected async setUrl(value: string): Promise<void> {
    this.url.set(value);
    try { localStorage.setItem(KEY, value); } catch { /* ignore */ }
    if (!value) return this.img.set('');
    this.img.set(await QRCode.toDataURL(value, { width: 1024, margin: 1, errorCorrectionLevel: 'H', color: { dark: '#111113', light: '#ffffff' } }));
  }

  protected print(): void { window.print(); }

  protected download(): void {
    const a = document.createElement('a');
    a.href = this.img();
    a.download = 'the-contrast-qr.png';
    a.click();
  }
}
