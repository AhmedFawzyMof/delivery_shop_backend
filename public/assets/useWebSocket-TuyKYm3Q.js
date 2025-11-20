import { O as r, f as n } from "./index-CTakD6A6.js";
const e = n(null),
  s = n(!1),
  c = n([]),
  u = "wss://deliveryshop.cloud";
function v(l) {
  function a() {
    (e.value = new WebSocket(u)),
      (e.value.onopen = () => {
        (s.value = !0),
          console.log("✅ WebSocket connected"),
          e.value?.send(JSON.stringify({ restaurant_id: l }));
      }),
      (e.value.onmessage = (o) => {
        const t = JSON.parse(o.data);
        c.value.push(t), console.log("📩 New message:", t);
      }),
      (e.value.onclose = () => {
        (s.value = !1),
          console.warn("❌ WebSocket disconnected, reconnecting..."),
          setTimeout(a, 3e3);
      }),
      (e.value.onerror = (o) => {
        console.error("WebSocket error:", o), e.value?.close();
      });
  }
  return (
    a(),
    r(() => e.value?.close()),
    {
      ws: e,
      isConnected: s,
      messages: c,
      sendMessage: (o) => {
        e.value &&
          e.value.readyState === WebSocket.OPEN &&
          e.value.send(JSON.stringify(o));
      },
    }
  );
}
export { u as W, v as u };
