import {
  getWebInstrumentations,
  initializeFaro,
} from "@grafana/faro-web-sdk";
import { ReplayInstrumentation } from "@grafana/faro-instrumentation-replay";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

initializeFaro({
  url: "https://faro-collector-prod-eu-west-6.grafana.net/collect/63603c9b9d149a1b98c4b07ad200ed13",
  app: {
    name: "jmsantos-blog",
    version: "0.3.0",
    environment: import.meta.env.MODE,
  },
  ignoreErrors: [
    // Layout quirks — harmless, not real errors
    /^ResizeObserver loop limit exceeded$/,
    /^ResizeObserver loop completed with undelivered notifications$/,
    // Cross-origin scripts with no useful stack
    /^Script error\.$/,
    // Browser extension interference
    /chrome-extension:\/\//,
    /moz-extension:\/\//,
  ],
  ignoreUrls: [
    // Cloudflare Web Analytics
    /cloudflareinsights\.com/,
  ],
  experimental: {
    trackNavigation: true,
  },
  instrumentations: [
    ...getWebInstrumentations(),
    new TracingInstrumentation(),
    new ReplayInstrumentation({
      blockSelector:
        ".grafana-block, img, picture, svg, video, audio, canvas, iframe, object, embed, input[type=\"hidden\"]",
      ignoreSelector: ".grafana-ignore",
    }),
  ],
});
