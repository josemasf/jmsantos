type Faro = ReturnType<typeof import("../faro")["startFaro"]>;

type AnalyticsChoice = "accepted" | "rejected";

const CONSENT_KEY = "jmsantos.analytics-consent.v1";

let faroPromise: Promise<Faro | null> | undefined;
let faroStarted = false;
let lastTrackedPath: string | null = null;
let consentForThisPage: AnalyticsChoice | null = null;

function getConsent(): AnalyticsChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return consentForThisPage ?? (value === "accepted" || value === "rejected" ? value : null);
  } catch {
    return consentForThisPage;
  }
}

function storeConsent(value: AnalyticsChoice) {
  consentForThisPage = value;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Browsers with blocked storage keep the choice only for this page.
  }
}

async function getFaro(): Promise<Faro | null> {
  if (getConsent() !== "accepted") return null;

  faroPromise ??= import("../faro")
    .then(({ startFaro }) => {
      // Consent may have been withdrawn while the script was loading.
      if (getConsent() !== "accepted") return null;
      const instance = startFaro();
      faroStarted = true;
      return instance;
    })
    .catch(() => {
      // Allow retry after temporary loading failures.
      faroPromise = undefined;
      return null;
    });

  return faroPromise;
}

async function trackPageView() {
  if (getConsent() !== "accepted") return;
  const faro = await getFaro();
  if (!faro || getConsent() !== "accepted") return;

  // Never include search params or fragments in analytics events.
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === lastTrackedPath) return;
  lastTrackedPath = path;

  faro.api.setPage(path);
  faro.api.pushEvent("blog_page_view", { path }, "content");
}

function showConsentBanner(open: boolean) {
  const banner = document.getElementById("analytics-consent-banner");
  if (banner) banner.hidden = !open;
  document.documentElement.classList.toggle("analytics-consent-open", open);
}

function loadKitStickyBar() {
  // Kit can show its own floating UI. Only load it once the choice has been
  // made so it never competes with the consent notice. Rejection is valid.
  if (!getConsent()) return;

  const config = document.querySelector<HTMLElement>("[data-kit-sticky-config]");
  if (!config || document.querySelector("script[data-kit-sticky-bar]")) return;

  const src = config.dataset.scriptSrc;
  const uid = config.dataset.uid;
  if (!src || !uid) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  script.dataset.uid = uid;
  script.dataset.kitStickyBar = "";
  document.body.append(script);
}

function updatePageUi() {
  // After ClientRouter swaps a page, new DOM elements need their own listeners.
  const banner = document.getElementById("analytics-consent-banner");
  const accept = banner?.querySelector<HTMLButtonElement>("[data-consent-accept]");
  const reject = banner?.querySelector<HTMLButtonElement>("[data-consent-reject]");
  const choice = getConsent();

  showConsentBanner(choice === null);

  if (accept) accept.onclick = () => chooseConsent("accepted");
  if (reject) reject.onclick = () => chooseConsent("rejected");

  document.querySelectorAll<HTMLButtonElement>("[data-consent-preferences]").forEach((button) => {
    button.onclick = () => {
      showConsentBanner(true);
      accept?.focus();
    };
  });

  if (choice) loadKitStickyBar();
  if (choice === "accepted") void trackPageView();
}

function chooseConsent(value: AnalyticsChoice) {
  storeConsent(value);
  showConsentBanner(false);

  if (value === "rejected" && faroStarted) {
    // Fully stop Faro and its instrumentations after withdrawing consent.
    // Grafana recommends reloading rather than attempting a partial teardown.
    window.location.reload();
    return;
  }

  if (value === "accepted") void trackPageView();
  loadKitStickyBar();
}

document.addEventListener("astro:page-load", updatePageUi);
// Also support full navigations without ClientRouter.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updatePageUi, { once: true });
} else {
  updatePageUi();
}
