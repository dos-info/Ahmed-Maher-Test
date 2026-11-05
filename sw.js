// ضعه بجانب index.html (إن كان لديك sw.js فادمج هذا المنطق فيه)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("push", (e) => {
  let d = {}; try { d = e.data.json(); } catch (_) {}
  const ring = !!d.ring;
  e.waitUntil(self.registration.showNotification(d.title || "DOS", {
    body: d.body || "", tag: d.tag || "dos-msg", renotify: true, requireInteraction: ring,
    vibrate: ring ? [600, 250, 600, 250, 600, 250, 600, 250, 600] : [200, 100, 200],
    data: { url: d.url || "./" }
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const c of list) if ("focus" in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
