if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((reg) => {})
    .catch((err) => {});
}
