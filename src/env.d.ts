/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  /** HTTPS endpoint for the Safety Kit waitlist. Empty until a provider is chosen. */
  readonly PUBLIC_WAITLIST_FORM_ACTION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
