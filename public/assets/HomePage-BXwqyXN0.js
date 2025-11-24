import {
  _ as J,
  a as K,
  b as Q,
  c as X,
  d as Y,
  e as Z,
  f as ee,
} from "./Header.vue_vue_type_script_setup_true_lang-DoQDjMy6.js";
import { c as te, a as re, _ as h, b as U, u as R } from "./auth-BOWgCVVb.js";
import {
  u as se,
  _ as L,
} from "./Input.vue_vue_type_script_setup_true_lang-DEP3HyZt.js";
import { _ as E } from "./Label.vue_vue_type_script_setup_true_lang-DjM-uG6V.js";
import {
  d as z,
  v as oe,
  x as ae,
  u as t,
  e as V,
  o as x,
  n as H,
  y as de,
  f as g,
  z as N,
  c as S,
  w as d,
  a as o,
  b as s,
  j as m,
  t as f,
  A as C,
  l as le,
  p as T,
  B as P,
  C as ne,
  g as ie,
  F as A,
  k as ue,
} from "./index-d-g9mRbR.js";
import { _ as ce } from "./index-cBp-nCgD.js";
import { C as D } from "./clock-DZxvO7r6.js";
import { T as me, P as fe } from "./truck-J7k0Gy93.js";
import {
  _ as I,
  a as M,
  b as O,
  c as F,
} from "./CardTitle.vue_vue_type_script_setup_true_lang-B_Ekwe2Y.js";
import { _ as pe } from "./CardDescription.vue_vue_type_script_setup_true_lang-BzARtVmM.js";
import { u as _e } from "./useWebSocket-BJyQ9zcl.js";
import { _ as ve } from "./CustomPagination.vue_vue_type_script_setup_true_lang-DpwOP1tr.js";
import { C as ge } from "./circle-check-big-C3-2RChK.js";
import "./useForwardPropsEmits-D6-NodRW.js";
import "./DialogTrigger-DKF5dejl.js";
import "./index-DYTBgUmH.js";
import "./PopperContent-BvjY67ll.js";
import "./x-BIILnT8m.js";
import "./SelectValue.vue_vue_type_script_setup_true_lang-BxzYEQ-R.js";
import "./loader-Bt2XS28I.js";
import "./users-AhaMjd8e.js";
import "./house-DvnnnsCD.js";
/**
 * @license lucide-vue-next v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const xe = te("pen", [
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        key: "1a8usu",
      },
    ],
  ]),
  ye = z({
    __name: "Textarea",
    props: { class: {}, defaultValue: {}, modelValue: {} },
    emits: ["update:modelValue"],
    setup(a, { emit: w }) {
      const _ = a,
        i = se(_, "modelValue", w, {
          passive: !0,
          defaultValue: _.defaultValue,
        });
      return (c, v) =>
        oe(
          (x(),
          V(
            "textarea",
            {
              "onUpdate:modelValue":
                v[0] || (v[0] = (b) => (de(i) ? (i.value = b) : null)),
              "data-slot": "textarea",
              class: H(
                t(re)(
                  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  _.class
                )
              ),
            },
            null,
            2
          )),
          [[ae, t(i)]]
        );
    },
  }),
  be = { class: "grid gap-4 py-4" },
  $e = { class: "grid gap-2" },
  ke = { class: "grid gap-2" },
  we = { class: "grid gap-2" },
  he = z({
    __name: "EditOrders",
    props: { open: { type: Boolean }, order: {} },
    emits: ["update:open"],
    setup(a, { emit: w }) {
      const _ = a,
        $ = w,
        i = g(!1),
        c = g({
          order_total_price: 0,
          order_delivery_cost: 0,
          notes: "",
          restaurant_id: 0,
        });
      N(
        () => _.order,
        (p) => {
          p &&
            (c.value = {
              order_total_price: p.order_total_price || 0,
              order_delivery_cost: p.order_delivery_cost || 0,
              notes: p.order_notes || "",
              restaurant_id: p.restaurant_id,
            });
        },
        { immediate: !0 }
      );
      const v = () => {
          $("update:open", !1);
        },
        b = async () => {
          if (_.order) {
            i.value = !0;
            try {
              await U.put(`/orders/${_.order.order_id}`, c.value),
                C.success("تم تحديث الطلب بنجاح!"),
                v();
            } catch (p) {
              C.error(p.response?.data?.message || "فشل تحديث الطلب");
            } finally {
              i.value = !1;
            }
          }
        };
      return (p, n) => (
        x(),
        S(
          t(J),
          { open: a.open, "onUpdate:open": v },
          {
            default: d(() => [
              o(
                t(Z),
                { class: "sm:max-w-[600px]", dir: "rtl" },
                {
                  default: d(() => [
                    o(t(K), null, {
                      default: d(() => [
                        o(t(Q), null, {
                          default: d(() => [
                            m("تعديل الطلب #" + f(a.order?.order_id), 1),
                          ]),
                          _: 1,
                        }),
                        o(t(X), null, {
                          default: d(() => [
                            ...(n[3] ||
                              (n[3] = [
                                m(
                                  " قم بتعديل بيانات الطلب وحفظ التغييرات ",
                                  -1
                                ),
                              ])),
                          ]),
                          _: 1,
                        }),
                      ]),
                      _: 1,
                    }),
                    s("div", be, [
                      s("div", $e, [
                        o(
                          t(E),
                          { for: "order_delivery_cost" },
                          {
                            default: d(() => [
                              ...(n[4] || (n[4] = [m("تكلفة توصيل", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        o(
                          t(L),
                          {
                            id: "order_delivery_cost",
                            type: "number",
                            modelValue: c.value.order_delivery_cost,
                            "onUpdate:modelValue":
                              n[0] ||
                              (n[0] = (u) => (c.value.order_delivery_cost = u)),
                            placeholder: "أدخل تكلفة توصيل الطلب (ج.م)",
                          },
                          null,
                          8,
                          ["modelValue"]
                        ),
                      ]),
                      s("div", ke, [
                        o(
                          t(E),
                          { for: "order_total_price" },
                          {
                            default: d(() => [
                              ...(n[5] ||
                                (n[5] = [m("إجمالي السعر (ج.م)", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        o(
                          t(L),
                          {
                            id: "order_total_price",
                            modelValue: c.value.order_total_price,
                            "onUpdate:modelValue":
                              n[1] ||
                              (n[1] = (u) => (c.value.order_total_price = u)),
                            modelModifiers: { number: !0 },
                            type: "number",
                            step: "0.01",
                            placeholder: "0.00",
                          },
                          null,
                          8,
                          ["modelValue"]
                        ),
                      ]),
                      s("div", we, [
                        o(
                          t(E),
                          { for: "notes" },
                          {
                            default: d(() => [
                              ...(n[6] || (n[6] = [m("ملاحظات", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        o(
                          t(ye),
                          {
                            id: "notes",
                            modelValue: c.value.notes,
                            "onUpdate:modelValue":
                              n[2] || (n[2] = (u) => (c.value.notes = u)),
                            placeholder: "أضف ملاحظات إضافية (اختياري)",
                            rows: "3",
                          },
                          null,
                          8,
                          ["modelValue"]
                        ),
                      ]),
                    ]),
                    o(t(Y), null, {
                      default: d(() => [
                        o(
                          t(h),
                          { variant: "outline", onClick: v, disabled: i.value },
                          {
                            default: d(() => [
                              ...(n[7] || (n[7] = [m(" إلغاء ", -1)])),
                            ]),
                            _: 1,
                          },
                          8,
                          ["disabled"]
                        ),
                        o(
                          t(h),
                          { onClick: b, disabled: i.value },
                          {
                            default: d(() => [
                              m(
                                f(i.value ? "جاري الحفظ..." : "حفظ التغييرات"),
                                1
                              ),
                            ]),
                            _: 1,
                          },
                          8,
                          ["disabled"]
                        ),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                }
              ),
            ]),
            _: 1,
          },
          8,
          ["open"]
        )
      );
    },
  }),
  Ce = { class: "border border-border rounded-lg p-4" },
  Ve = { class: "flex items-start justify-between mb-4" },
  Se = { class: "space-y-1" },
  Te = { class: "flex items-center gap-2" },
  Ue = { class: "font-bold text-primary" },
  Pe = { class: "ml-1 capitalize" },
  De = { class: "text-sm text-muted-foreground" },
  ze = { class: "flex flex-col items-end gap-1" },
  Be = { class: "font-bold text-lg" },
  je = { class: "font-bold text-lg" },
  Ee = { class: "order-items" },
  Ie = ["src"],
  Me = { class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
  Oe = { class: "font-medium" },
  Fe = { class: "text-sm text-muted-foreground" },
  Ne = { class: "text-sm text-muted-foreground" },
  Le = { class: "text-sm text-muted-foreground" },
  Ae = { class: "flex gap-2" },
  Re = { class: "flex flex-col space-y-2" },
  He = { key: 0, class: "bonus btns space-x-1 md:space-x-2" },
  We = z({
    __name: "OrderCard",
    props: { order: {} },
    emits: ["edit-click"],
    setup(a, { emit: w }) {
      const _ = w,
        $ = R(),
        i = (u, r) => {
          U.put(`/orders/${u}?update_status=true`, {
            order_status: r,
            restaurant_id: $.user.id,
          })
            .then((y) => {
              C.success("تم تحديث حالة الطلب بنجاح!");
            })
            .catch((y) => {
              C.error("فشل في تحديث حالة الطلب.");
            });
        },
        c = (u, r) => {
          _("edit-click", u, r);
        },
        v = (u, r, y) => {
          const B = r.order_delivery_cost + y;
          U.put(`/orders/${u}`, {
            order_total_price: r.order_total_price,
            order_delivery_cost: B,
            notes: r.order_notes,
            restaurant_id: r.restaurant_id,
          })
            .then((j) => {
              C.success("تم تحديث تكلفة التوصيل بنجاح!");
            })
            .catch((j) => {
              C.error("فشل في تحديث تكلفة التوصيل.");
            });
        };
      function b(u) {
        switch (u) {
          case "preparing":
            return P(D, { class: "h-4 w-4" });
          case "ready":
            return P(fe, { class: "h-4 w-4" });
          case "picked-up":
            return P(me, { class: "h-4 w-4" });
          default:
            return P(D, { class: "h-4 w-4" });
        }
      }
      function p(u) {
        switch (u) {
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
      function n(u) {
        switch (u) {
          case "preparing":
            return "في التحضير";
          case "ready":
            return "جاهز للاستلام";
          case "picked-up":
            return "تم الاستلام";
          case "delivered":
            return "تم التوصيل";
          default:
            return "في التحضير";
        }
      }
      return (u, r) => (
        x(),
        V("div", Ce, [
          s("div", Ve, [
            s("div", Se, [
              s("div", Te, [
                s("span", Ue, "#" + f(a.order.order_id), 1),
                o(
                  t(ce),
                  { class: H(p(a.order.order_status)) },
                  {
                    default: d(() => [
                      (x(),
                      S(le(b(a.order.order_status)), { class: "h-3 w-3" })),
                      s("span", Pe, f(n(a.order.order_status)), 1),
                    ]),
                    _: 1,
                  },
                  8,
                  ["class"]
                ),
              ]),
              s(
                "p",
                De,
                f(a.order.created_at.replace("T", " ").split(".")[0]),
                1
              ),
            ]),
            s("div", ze, [
              s("span", Be, f(a.order.order_total_price) + " ج.م ", 1),
              s("span", je, f(a.order.order_delivery_cost) + " ج.م ", 1),
            ]),
          ]),
          s("div", Ee, [
            s(
              "img",
              {
                src: "https://deliveryshop.cloud" + a.order.order_receipt,
                alt: "Receipt Image",
                class: "h-36 w-36 rounded-md object-cover mr-2",
              },
              null,
              8,
              Ie
            ),
          ]),
          s("div", Me, [
            s("div", null, [
              s("p", Oe, f(a.order.user_name) + " : الاسم", 1),
              s("p", Fe, f(a.order.user_phone) + " : التليفون ", 1),
              s("p", Ne, f(a.order.user_address) + " : العنوان ", 1),
            ]),
            s("div", null, [
              r[5] || (r[5] = s("p", { class: "font-medium" }, "ملاحظات", -1)),
              s("p", Le, f(a.order.order_notes), 1),
            ]),
          ]),
          s("div", Ae, [
            a.order.order_status === "preparing"
              ? (x(),
                S(
                  t(h),
                  {
                    key: 0,
                    size: "sm",
                    class: "bg-green-600 hover:bg-green-700",
                    onClick:
                      r[0] || (r[0] = (y) => i(a.order.order_id, "ready")),
                  },
                  {
                    default: d(() => [
                      ...(r[6] || (r[6] = [m(" جاهز للاستلام ", -1)])),
                    ]),
                    _: 1,
                  }
                ))
              : T("", !0),
            a.order.order_status !== "delivered"
              ? (x(),
                S(
                  t(h),
                  {
                    key: 1,
                    size: "sm",
                    class: "bg-blue-600 hover:bg-blue-700",
                    onClick: r[1] || (r[1] = (y) => c(a.order, !0)),
                  },
                  {
                    default: d(() => [
                      o(t(xe), { class: "h-4 w-4 mr-2" }),
                      r[7] || (r[7] = m(" تعديل ", -1)),
                    ]),
                    _: 1,
                  }
                ))
              : T("", !0),
          ]),
          s("div", Re, [
            r[11] || (r[11] = s("span", null, "إضافة علي التوصيل", -1)),
            a.order.order_status !== "delivered"
              ? (x(),
                V("div", He, [
                  o(
                    t(h),
                    {
                      onClick:
                        r[2] || (r[2] = (y) => v(a.order.order_id, a.order, 5)),
                    },
                    {
                      default: d(() => [
                        ...(r[8] || (r[8] = [m("+5 ج.م", -1)])),
                      ]),
                      _: 1,
                    }
                  ),
                  o(
                    t(h),
                    {
                      onClick:
                        r[3] ||
                        (r[3] = (y) => v(a.order.order_id, a.order, 10)),
                    },
                    {
                      default: d(() => [
                        ...(r[9] || (r[9] = [m("+10 ج.م", -1)])),
                      ]),
                      _: 1,
                    }
                  ),
                  o(
                    t(h),
                    {
                      onClick:
                        r[4] ||
                        (r[4] = (y) => v(a.order.order_id, a.order, 15)),
                    },
                    {
                      default: d(() => [
                        ...(r[10] || (r[10] = [m("+15 ج.م", -1)])),
                      ]),
                      _: 1,
                    }
                  ),
                ]))
              : T("", !0),
          ]),
        ])
      );
    },
  }),
  qe = { class: "p-6", dir: "rtl" },
  Ge = { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" },
  Je = { class: "text-2xl font-bold text-primary" },
  Ke = { class: "text-2xl font-bold text-green-500" },
  Qe = { class: "mb-4 text-sm text-muted-foreground" },
  Xe = { class: "space-y-4" },
  Ye = { key: 0, class: "text-center py-8" },
  $t = z({
    __name: "HomePage",
    setup(a) {
      const w = R(),
        _ = g(0),
        $ = g([]),
        i = g([]),
        c = g(!1),
        v = g(""),
        b = g(!1),
        p = g({}),
        n = g({}),
        { messages: u } = _e(w.user?.id || 0),
        r = g(1),
        y = g(50),
        B = ne(() => Math.ceil(n.value.sum_of_orders / y.value)),
        j = async () => {
          c.value = !0;
          const e = new Date().toISOString().split("T")[0];
          try {
            const l = await U.get(`/orders?from=${e}&to=${e}`);
            i.value = l.data.orders;
          } catch (l) {
            v.value = l.message || "Failed to fetch restaurants";
          } finally {
            c.value = !1;
          }
        },
        W = async () => {
          c.value = !0;
          const e = new Date().toISOString().split("T")[0];
          try {
            const l = await U.get(
              `/orders?from=${e}&to=${e}&status=true&page=${r.value}`
            );
            (n.value = l.data.stats || {}),
              console.log("Status:", l.data.stats);
          } catch (l) {
            console.error("Failed to fetch stats:", l);
          } finally {
            c.value = !1;
          }
        };
      return (
        ie(() => {
          j(), W();
        }),
        N(
          u,
          (k) => {
            const e = k[k.length - 1];
            e &&
              (e.type === "new_order" &&
                (C.success("تم انشاء طلب جديد!"), i.value.push(e.order)),
              e.type === "updated_order" &&
                (i.value = i.value.map(
                  (l) => (
                    l.order_id === e.order.order_id &&
                      (console.log("Updating order:", e.order, l),
                      (l = e.order)),
                    l
                  )
                )),
              e.type === "order_status_updated" &&
                (console.log("Order status updated:", e.order),
                (i.value = i.value.map(
                  (l) => (
                    l.order_id === e.order.order_id &&
                      (l.order_status = e.order.order_status),
                    l
                  )
                ))));
          },
          { immediate: !0, deep: !0 }
        ),
        N(
          i,
          (k) => {
            ($.value = k.filter((e) => e.order_status !== "delivered")),
              (_.value = k.filter(
                (e) => e.order_status === "delivered"
              ).length);
          },
          { immediate: !0, deep: !0 }
        ),
        (k, e) => (
          x(),
          V(
            A,
            null,
            [
              o(ee),
              s("div", qe, [
                s("div", Ge, [
                  o(t(I), null, {
                    default: d(() => [
                      o(
                        t(M),
                        {
                          class:
                            "flex flex-row items-center justify-between space-y-0 pb-2",
                        },
                        {
                          default: d(() => [
                            o(
                              t(O),
                              { class: "text-sm font-medium" },
                              {
                                default: d(() => [
                                  ...(e[2] ||
                                    (e[2] = [m("طلبات قيد الانتظار", -1)])),
                                ]),
                                _: 1,
                              }
                            ),
                            o(t(D), { class: "h-4 w-4 text-muted-foreground" }),
                          ]),
                          _: 1,
                        }
                      ),
                      o(t(F), null, {
                        default: d(() => [
                          s("div", Je, f($.value.length), 1),
                          e[3] ||
                            (e[3] = s(
                              "p",
                              { class: "text-xs text-muted-foreground" },
                              "محتاجة متابعة",
                              -1
                            )),
                        ]),
                        _: 1,
                      }),
                    ]),
                    _: 1,
                  }),
                  o(t(I), null, {
                    default: d(() => [
                      o(
                        t(M),
                        {
                          class:
                            "flex flex-row items-center justify-between space-y-0 pb-2",
                        },
                        {
                          default: d(() => [
                            o(
                              t(O),
                              { class: "text-sm font-medium" },
                              {
                                default: d(() => [
                                  ...(e[4] ||
                                    (e[4] = [m("تم تسليمها النهارده", -1)])),
                                ]),
                                _: 1,
                              }
                            ),
                            o(t(ge), {
                              class: "h-4 w-4 text-muted-foreground",
                            }),
                          ]),
                          _: 1,
                        }
                      ),
                      o(t(F), null, {
                        default: d(() => [
                          s("div", Ke, f(_.value), 1),
                          e[5] ||
                            (e[5] = s(
                              "p",
                              { class: "text-xs text-muted-foreground" },
                              "طلبات تم تسليمها",
                              -1
                            )),
                        ]),
                        _: 1,
                      }),
                    ]),
                    _: 1,
                  }),
                ]),
                s(
                  "p",
                  Qe,
                  " استعرض كل الطلبات بين التاريخين المحددين (صفحة " +
                    f(r.value) +
                    " من " +
                    f(B.value) +
                    ") ",
                  1
                ),
                o(t(I), null, {
                  default: d(() => [
                    o(t(M), null, {
                      default: d(() => [
                        o(t(O), null, {
                          default: d(() => [
                            ...(e[6] || (e[6] = [m("الطلبات الحالية", -1)])),
                          ]),
                          _: 1,
                        }),
                        o(t(pe), null, {
                          default: d(() => [
                            ...(e[7] ||
                              (e[7] = [
                                m(
                                  " تابع الطلبات اللي شغالة دلوقتي وعدّل حالتها ",
                                  -1
                                ),
                              ])),
                          ]),
                          _: 1,
                        }),
                      ]),
                      _: 1,
                    }),
                    o(t(F), null, {
                      default: d(() => [
                        s("div", Xe, [
                          (x(!0),
                          V(
                            A,
                            null,
                            ue(
                              $.value,
                              (l) => (
                                x(),
                                S(
                                  We,
                                  {
                                    order: l,
                                    key: l.order_id,
                                    onEditClick: (q, G) => {
                                      (p.value = q), (b.value = G);
                                    },
                                  },
                                  null,
                                  8,
                                  ["order", "onEditClick"]
                                )
                              )
                            ),
                            128
                          )),
                          i.value.length
                            ? T("", !0)
                            : (x(),
                              V("div", Ye, [
                                o(t(D), {
                                  class:
                                    "h-12 w-12 text-muted-foreground mx-auto mb-4",
                                }),
                                e[8] ||
                                  (e[8] = s(
                                    "p",
                                    { class: "text-muted-foreground" },
                                    "مافيش طلبات شغالة دلوقتي",
                                    -1
                                  )),
                                e[9] ||
                                  (e[9] = s(
                                    "p",
                                    { class: "text-sm text-muted-foreground" },
                                    "أي طلب جديد هيظهر هنا",
                                    -1
                                  )),
                              ])),
                          !c.value && i.value.length > 0
                            ? (x(),
                              S(
                                ve,
                                {
                                  key: 1,
                                  "current-page": r.value,
                                  "total-items": n.value.sum_of_orders,
                                  "items-per-page": y.value,
                                  "onUpdate:currentPage":
                                    e[0] || (e[0] = (l) => (r.value = l)),
                                },
                                null,
                                8,
                                [
                                  "current-page",
                                  "total-items",
                                  "items-per-page",
                                ]
                              ))
                            : T("", !0),
                        ]),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                }),
              ]),
              o(
                he,
                {
                  open: b.value,
                  "onUpdate:open": e[1] || (e[1] = (l) => (b.value = l)),
                  order: p.value,
                },
                null,
                8,
                ["open", "order"]
              ),
            ],
            64
          )
        )
      );
    },
  });
export { $t as default };
