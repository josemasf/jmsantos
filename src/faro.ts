import {
  getWebInstrumentations,
  initializeFaro,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

// Only import and call this function after explicit analytics consent.
// Session Replay is intentionally disabled: it is unnecessary for page-view analytics.
export function startFaro() {
  return initializeFaro({
    url: "https://faro-collector-prod-eu-west-6.grafana.net/collect/63603c9b9d149a1b98c4b07ad200ed13",
    app: {
      name: "jmsantos-blog",
      version: "0.3.0",
      environment: import.meta.env.MODE,
    },
    ignoreErrors: [
      /^ResizeObserver loop limit exceeded$/,
      /^ResizeObserver loop completed with undelivered notifications$/,
      /^Script error\.$/,
      /chrome-extension:\/\//,
      /moz-extension:\/\//,
    ],
    ignoreUrls: [/cloudflareinsights\.com/],
    experimental: {
      trackNavigation: true,
    },
    instrumentations: [
      ...getWebInstrumentations(),
      new TracingInstrumentation(),
    ],
  });
}
