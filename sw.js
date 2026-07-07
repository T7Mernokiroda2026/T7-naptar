/* T7 naptár – service worker
   Célja: értesítések megjelenítése (Androidon a lap közvetlen Notification-je nem működik,
   csak a service worker showNotification-je), és kattintásra az app előtérbe hozása.
   Megjegyzés: valódi „push" (amikor az app teljesen be van zárva) Web Push + háttérszerver
   nélkül nem garantálható – ez a service worker az előtérből/nemrég aktív állapotból küldött
   emlékeztetőket jeleníti meg. */
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(self.clients.claim()); });

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});

/* A lap üzenetküldéssel is kérheti értesítés megjelenítését */
self.addEventListener("message", (event) => {
  const d = event.data || {};
  if (d.type === "notify" && d.title) {
    self.registration.showNotification(d.title, d.options || {});
  }
});
