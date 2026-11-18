# The Contrast: Exhibition Scan Page

Mobile-first Angular site that visitors reach by scanning a QR code at your booth.
They see who you are, your 3 products, proof of work, then fill a requirement form.

## Routes

| Path     | Purpose                                                        |
|----------|----------------------------------------------------------------|
| `/`      | Animated slide deck visitors see after scanning (swipe / arrows / P = autoplay / F = fullscreen) |
| `/site`  | Classic scrolling version of the same content                  |
| `/qr`    | Printable booth poster with the QR code (paste your live URL)  |
| `/leads` | Leads captured on this device, with CSV export                 |

## Run

```bash
npm install
ng serve            # http://localhost:4200
ng build            # output in dist/contrast-presentation/browser
```

## Before the exhibition

1. **Edit contact details and links:** `src/app/core/config.ts`
2. **Edit product / work copy:** `src/app/core/content.ts`
3. **Deploy** `dist/contrast-presentation/browser` (Netlify, Vercel, Cloudflare Pages, or any static host). Phones cannot open `localhost`.
4. Open `/qr` on the live site, confirm the URL, **print the poster**, and test-scan it.
5. **Set up lead delivery** (below).

## Where do the leads go?

Visitors submit from their own phones, so leads must be sent to a server you control.
Set `leadEndpoint` in `config.ts`. Easiest free option, a Google Sheet:

1. Create a Google Sheet, then **Extensions → Apps Script**, paste:

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([
    d.createdAt, d.name, d.phone, d.email, d.company,
    (d.interests || []).join(', '), d.budget, d.timeline, d.message, d.source,
  ]);
  return ContentService.createTextOutput('ok');
}
```

2. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*.
3. Copy the web-app URL into `leadEndpoint`.

Other endpoints (Formspree, Web3Forms) also work; they receive the lead as a JSON POST.

Safety nets already built in:
- Every lead is saved on the device first, and failed sends retry on the next visit.
- After submitting, the visitor gets a **"Send on WhatsApp"** button with their details pre-filled to your number.
