export default {
  site: "https://josemariasantos.com/",
  scanner: {
    device: "mobile",
    throttle: true,
    samples: 3,
    dynamicSampling: false,
    crawler: true,
    sitemap: true,
  },
  puppeteerClusterOptions: {
    maxConcurrency: 1,
  },
};
