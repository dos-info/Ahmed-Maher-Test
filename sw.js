self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", event => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) {}
  const tag = "dos-call-" + (d.callId || "x");
  const who = d.name || "أحد المستخدمين";
  if (d.type === "cancel") {
    event.waitUntil(self.registration.showNotification("مكالمة فائتة", { body: "من " + who, tag, renotify: true, data: { type: "call", url: d.url || "./" } }));
    return;
  }
  event.waitUntil(self.registration.showNotification("📞 مكالمة واردة", {
    body: who + (d.video ? " — مكالمة فيديو" : " — مكالمة صوتية"),
    tag, renotify: true, requireInteraction: true,
    vibrate: [400, 200, 400, 200, 400, 200, 400],
    data: { type: "call", callId: d.callId, url: d.url || "./" },
    actions: [{ action: "answer", title: "رد" }, { action: "decline", title: "تجاهل" }]
  }));
});
self.addEventListener("notificationclick", event => {
  const n = event.notification; n.close();
  if (event.action === "decline") return;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) { c.postMessage({ type: "dos-notification-click", data: n.data }); return c.focus(); } }
    return self.clients.openWindow((n.data && n.data.url) || "./");
  }));
});
