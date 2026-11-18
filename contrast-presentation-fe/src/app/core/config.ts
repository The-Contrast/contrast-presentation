/**
 * Exhibition settings. Edit these before the event.
 */
export const CONFIG = {
  /**
   * Where leads are sent (HTTPS POST, JSON body).
   * Use a Google Apps Script web-app URL (writes to a Google Sheet), Formspree, Web3Forms, etc.
   * See README "Where do the leads go?". If empty, leads are stored only on the device.
   */
  leadEndpoint: '',

  /** Public URL the QR code points to (override on the /qr page). */
  siteUrl: '',

  /** After a lead is submitted, the visitor is sent here (after a short thank-you). */
  redirectUrl: 'https://thecontrast.in/',
  redirectDelaySec: 6,

  whatsappNumber: '917021206306',
  phoneDisplay: '+91 7021 206 306',
  phoneHref: 'tel:+917021206306',
  email: 'info@thecontrast.in',
  website: 'https://thecontrast.in',
  bookingUrl: 'https://cal.com',
  address: 'Office No 107, Citi Enclave, Sector 2A, Koparkhairane, Navi Mumbai 400709',
  linkedin: 'https://www.linkedin.com/company/the-contrast-india',
  instagram: 'https://www.instagram.com/thecontrastindia',
};
