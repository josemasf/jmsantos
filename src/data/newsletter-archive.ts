/**
 * Public editions of the newsletter that have actually been sent.
 * Add an entry only after confirming the send in Kit. Drafts and scheduled
 * broadcasts must never be represented here.
 */
export interface SentNewsletter {
  subject: string;
  date: string;
  excerpt: string;
  url: string;
}

export const sentNewsletters: SentNewsletter[] = [];
