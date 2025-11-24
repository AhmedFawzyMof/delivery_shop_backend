import {
  _ as y,
  a as w,
  b,
  c as h,
} from "./CardTitle.vue_vue_type_script_setup_true_lang-B_Ekwe2Y.js";
import { _ as S } from "./CardDescription.vue_vue_type_script_setup_true_lang-BzARtVmM.js";
import { f as U } from "./Header.vue_vue_type_script_setup_true_lang-DoQDjMy6.js";
import { b as j, _ as M } from "./auth-BOWgCVVb.js";
import { _ as D } from "./Input.vue_vue_type_script_setup_true_lang-DEP3HyZt.js";
import { _ as R } from "./index-cBp-nCgD.js";
import {
  d as A,
  f as i,
  C as E,
  g as q,
  z as G,
  e as _,
  a as e,
  b as a,
  w as l,
  u as t,
  F as N,
  A as T,
  o as u,
  j as c,
  t as n,
  c as V,
  p as v,
  k as H,
  n as J,
  l as K,
  B as k,
} from "./index-d-g9mRbR.js";
import { _ as Q } from "./CustomPagination.vue_vue_type_script_setup_true_lang-DpwOP1tr.js";
import { L as z } from "./loader-circle-Bkeg2r1Z.js";
import { C as $ } from "./clock-DZxvO7r6.js";
import { C as W } from "./circle-check-big-C3-2RChK.js";
import { T as X, P as Y } from "./truck-J7k0Gy93.js";
import "./useForwardPropsEmits-D6-NodRW.js";
import "./DialogTrigger-DKF5dejl.js";
import "./index-DYTBgUmH.js";
import "./PopperContent-BvjY67ll.js";
import "./Label.vue_vue_type_script_setup_true_lang-DjM-uG6V.js";
import "./x-BIILnT8m.js";
import "./SelectValue.vue_vue_type_script_setup_true_lang-BxzYEQ-R.js";
import "./loader-Bt2XS28I.js";
import "./users-AhaMjd8e.js";
import "./house-DvnnnsCD.js";
const Z = { class: "p-6 space-y-8", dir: "rtl" },
  ee = { class: "flex flex-col md:flex-row gap-4 items-end" },
  te = { class: "flex flex-col" },
  se = { class: "flex flex-col" },
  ae = { class: "grid grid-cols-1 md:grid-cols-2 gap-6" },
  le = { class: "text-2xl font-bold text-primary" },
  oe = { class: "text-2xl font-bold text-green-500" },
  re = { class: "space-y-4" },
  ne = { class: "flex items-start justify-between mb-4" },
  ue = { class: "space-y-1" },
  ie = { class: "flex items-center gap-2" },
  de = { class: "font-bold text-primary" },
  ce = { class: "ml-1 capitalize" },
  me = { class: "text-sm text-muted-foreground" },
  fe = { class: "font-bold text-lg" },
  pe = { class: "flex flex-wrap gap-4" },
  _e = ["src"],
  ge = { class: "font-medium" },
  ve = { class: "text-sm text-muted-foreground" },
  xe = { class: "text-sm text-muted-foreground" },
  ye = { key: 0, class: "text-center py-8" },
  we = { key: 1, class: "flex justify-center py-8" },
  qe = A({
    __name: "OrderReportsPage",
    setup(be) {
      const x = i([]),
        d = i(!1),
        P = i(""),
        g = i({}),
        m = i(""),
        f = i(""),
        p = i(1),
        B = i(50),
        F = E(() => Math.ceil(g.value.sum_of_orders / B.value)),
        C = async () => {
          if (!m.value || !f.value) {
            T.warning("اختار تاريخ البداية والنهاية الأول");
            return;
          }
          d.value = !0;
          try {
            const o = await j.get(
              `/orders?from=${m.value}&to=${f.value}&page=${p.value}`
            );
            x.value = o.data.orders || [];
          } catch (o) {
            (P.value = o.message || "فشل في جلب الطلبات"), T.error(P.value);
          } finally {
            d.value = !1;
          }
        },
        I = async () => {
          try {
            const o = await j.get(
              `/orders?from=${m.value}&to=${f.value}&status=true&page=${p.value}`
            );
            (g.value = o.data.stats || {}),
              console.log("Status:", o.data.stats);
          } catch (o) {
            console.error("Failed to fetch stats:", o);
          }
        };
      q(async () => {
        const o = new Date().toISOString().split("T")[0];
        (m.value = o), (f.value = o), await C(), await I();
      });
      function L(o) {
        switch (o) {
          case "preparing":
            return k($, { class: "h-4 w-4" });
          case "ready":
            return k(Y, { class: "h-4 w-4" });
          case "picked-up":
            return k(X, { class: "h-4 w-4" });
          default:
            return k($, { class: "h-4 w-4" });
        }
      }
      function O(o) {
        switch (o) {
          case "preparing":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
          case "ready":
            return "bg-green-500/10 text-green-500 border-green-500/20";
          case "picked-up":
            return "bg-primary/10 text-primary border-primary/20";
          default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
      }
      return (
        G(p, async (o, s) => {
          o !== s && (await C());
        }),
        (o, s) => (
          u(),
          _(
            N,
            null,
            [
              e(U),
              a("div", Z, [
                e(t(y), null, {
                  default: l(() => [
                    e(t(w), null, {
                      default: l(() => [
                        e(t(b), null, {
                          default: l(() => [
                            ...(s[3] || (s[3] = [c("بحث حسب التاريخ", -1)])),
                          ]),
                          _: 1,
                        }),
                        e(t(S), null, {
                          default: l(() => [
                            c(
                              "استعرض كل الطلبات بين التاريخين المحددين (صفحة " +
                                n(p.value) +
                                " من " +
                                n(F.value) +
                                ")",
                              1
                            ),
                          ]),
                          _: 1,
                        }),
                      ]),
                      _: 1,
                    }),
                    e(t(h), null, {
                      default: l(() => [
                        a("div", ee, [
                          a("div", te, [
                            s[4] ||
                              (s[4] = a(
                                "label",
                                { class: "text-sm font-medium mb-1" },
                                "من تاريخ",
                                -1
                              )),
                            e(
                              t(D),
                              {
                                type: "date",
                                modelValue: m.value,
                                "onUpdate:modelValue":
                                  s[0] || (s[0] = (r) => (m.value = r)),
                              },
                              null,
                              8,
                              ["modelValue"]
                            ),
                          ]),
                          a("div", se, [
                            s[5] ||
                              (s[5] = a(
                                "label",
                                { class: "text-sm font-medium mb-1" },
                                "إلى تاريخ",
                                -1
                              )),
                            e(
                              t(D),
                              {
                                type: "date",
                                modelValue: f.value,
                                "onUpdate:modelValue":
                                  s[1] || (s[1] = (r) => (f.value = r)),
                              },
                              null,
                              8,
                              ["modelValue"]
                            ),
                          ]),
                          e(
                            t(M),
                            { onClick: C, disabled: d.value },
                            {
                              default: l(() => [
                                d.value
                                  ? (u(),
                                    V(t(z), {
                                      key: 0,
                                      class: "mr-2 h-4 w-4 animate-spin",
                                    }))
                                  : v("", !0),
                                s[6] || (s[6] = c(" بحث ", -1)),
                              ]),
                              _: 1,
                            },
                            8,
                            ["disabled"]
                          ),
                        ]),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                }),
                a("div", ae, [
                  e(t(y), null, {
                    default: l(() => [
                      e(
                        t(w),
                        {
                          class:
                            "flex flex-row items-center justify-between space-y-0 pb-2",
                        },
                        {
                          default: l(() => [
                            e(
                              t(b),
                              { class: "text-sm font-medium" },
                              {
                                default: l(() => [
                                  ...(s[7] ||
                                    (s[7] = [
                                      c("المبلغ الإجمالي للطلبات", -1),
                                    ])),
                                ]),
                                _: 1,
                              }
                            ),
                            e(t($), { class: "h-4 w-4 text-muted-foreground" }),
                          ]),
                          _: 1,
                        }
                      ),
                      e(t(h), null, {
                        default: l(() => [
                          a("div", le, n(g.value.total_price) + " ج.م ", 1),
                        ]),
                        _: 1,
                      }),
                    ]),
                    _: 1,
                  }),
                  e(t(y), null, {
                    default: l(() => [
                      e(
                        t(w),
                        {
                          class:
                            "flex flex-row items-center justify-between space-y-0 pb-2",
                        },
                        {
                          default: l(() => [
                            e(
                              t(b),
                              { class: "text-sm font-medium" },
                              {
                                default: l(() => [
                                  ...(s[8] ||
                                    (s[8] = [c(" إجمالي تكلفة التوصيل ", -1)])),
                                ]),
                                _: 1,
                              }
                            ),
                            e(t(W), { class: "h-4 w-4 text-muted-foreground" }),
                          ]),
                          _: 1,
                        }
                      ),
                      e(t(h), null, {
                        default: l(() => [
                          a("div", oe, n(g.value.delivery_cost) + " ج.م ", 1),
                        ]),
                        _: 1,
                      }),
                    ]),
                    _: 1,
                  }),
                ]),
                e(t(y), null, {
                  default: l(() => [
                    e(t(w), null, {
                      default: l(() => [
                        e(t(b), null, {
                          default: l(() => [
                            ...(s[9] || (s[9] = [c("الطلبات", -1)])),
                          ]),
                          _: 1,
                        }),
                        e(t(S), null, {
                          default: l(() => [
                            ...(s[10] ||
                              (s[10] = [
                                c(
                                  "استعرض كل الطلبات بين التاريخين المحددين",
                                  -1
                                ),
                              ])),
                          ]),
                          _: 1,
                        }),
                      ]),
                      _: 1,
                    }),
                    e(t(h), null, {
                      default: l(() => [
                        a("div", re, [
                          (u(!0),
                          _(
                            N,
                            null,
                            H(
                              x.value,
                              (r) => (
                                u(),
                                _(
                                  "div",
                                  {
                                    key: r.id,
                                    class:
                                      "border border-border rounded-lg p-4",
                                  },
                                  [
                                    a("div", ne, [
                                      a("div", ue, [
                                        a("div", ie, [
                                          a("span", de, "#" + n(r.order_id), 1),
                                          e(
                                            t(R),
                                            { class: J(O(r.order_status)) },
                                            {
                                              default: l(() => [
                                                (u(),
                                                V(K(L(r.order_status)), {
                                                  class: "h-3 w-3",
                                                })),
                                                a(
                                                  "span",
                                                  ce,
                                                  n(
                                                    r.order_status.replace(
                                                      "-",
                                                      " "
                                                    )
                                                  ),
                                                  1
                                                ),
                                              ]),
                                              _: 2,
                                            },
                                            1032,
                                            ["class"]
                                          ),
                                        ]),
                                        a("p", me, n(r.created_at), 1),
                                      ]),
                                      a(
                                        "span",
                                        fe,
                                        n(r.order_total_price) + " ج.م",
                                        1
                                      ),
                                    ]),
                                    a("div", pe, [
                                      r.order_receipt
                                        ? (u(),
                                          _(
                                            "img",
                                            {
                                              key: 0,
                                              src:
                                                "https://deliveryshop.cloud" +
                                                r.order_receipt,
                                              alt: "Receipt Image",
                                              class:
                                                "h-36 w-36 rounded-md object-cover",
                                            },
                                            null,
                                            8,
                                            _e
                                          ))
                                        : v("", !0),
                                      a("div", null, [
                                        a(
                                          "p",
                                          ge,
                                          n(r.user_name) + " : الاسم",
                                          1
                                        ),
                                        a(
                                          "p",
                                          ve,
                                          n(r.user_phone) + " : التليفون ",
                                          1
                                        ),
                                        a(
                                          "p",
                                          xe,
                                          n(r.user_address) + " : العنوان ",
                                          1
                                        ),
                                      ]),
                                    ]),
                                  ]
                                )
                              )
                            ),
                            128
                          )),
                          !d.value && !x.value.length
                            ? (u(),
                              _("div", ye, [
                                e(t($), {
                                  class:
                                    "h-12 w-12 text-muted-foreground mx-auto mb-4",
                                }),
                                s[11] ||
                                  (s[11] = a(
                                    "p",
                                    { class: "text-muted-foreground" },
                                    "مافيش طلبات للفترة المحددة",
                                    -1
                                  )),
                              ]))
                            : v("", !0),
                          d.value
                            ? (u(),
                              _("div", we, [
                                e(t(z), {
                                  class: "h-8 w-8 animate-spin text-primary",
                                }),
                              ]))
                            : v("", !0),
                          !d.value && x.value.length > 0
                            ? (u(),
                              V(
                                Q,
                                {
                                  key: 2,
                                  "current-page": p.value,
                                  "total-items": g.value.sum_of_orders,
                                  "items-per-page": B.value,
                                  "onUpdate:currentPage":
                                    s[2] || (s[2] = (r) => (p.value = r)),
                                },
                                null,
                                8,
                                [
                                  "current-page",
                                  "total-items",
                                  "items-per-page",
                                ]
                              ))
                            : v("", !0),
                        ]),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                }),
              ]),
            ],
            64
          )
        )
      );
    },
  });
export { qe as default };
