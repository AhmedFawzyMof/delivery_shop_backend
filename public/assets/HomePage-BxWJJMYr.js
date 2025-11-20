import {
  _ as G,
  a as J,
  b as K,
  c as Q,
  d as X,
  e as Y,
  f as Z,
  g as ee,
} from "./Header.vue_vue_type_script_setup_true_lang-LlrXtQz1.js";
import { c as te, _ as w } from "./createLucideIcon-Dne6exBT.js";
import { _ as M } from "./Input.vue_vue_type_script_setup_true_lang-DPaSW7O1.js";
import { _ as j } from "./Label.vue_vue_type_script_setup_true_lang-BxLVb_f6.js";
import {
  d as L,
  f as p,
  B as N,
  c as C,
  w as a,
  u as r,
  o as v,
  a as o,
  b as s,
  k as m,
  t as f,
  z as U,
  A as h,
  g as q,
  e as V,
  n as re,
  p as se,
  q as P,
  C as D,
  D as oe,
  h as ae,
  F as A,
  l as de,
} from "./index-CTakD6A6.js";
import { _ as le } from "./index-DaZ9IdLv.js";
import { C as T } from "./clock-CCw5LDAO.js";
import { T as ne, P as ie } from "./truck-C0S8qbak.js";
import {
  _ as E,
  a as I,
  b as O,
  c as F,
} from "./CardTitle.vue_vue_type_script_setup_true_lang-DXNmbM2X.js";
import { _ as ue } from "./CardDescription.vue_vue_type_script_setup_true_lang-CqkYoIfs.js";
import { u as ce } from "./useWebSocket-TuyKYm3Q.js";
import { _ as me } from "./CustomPagination.vue_vue_type_script_setup_true_lang-BHUexTDH.js";
import { C as fe } from "./circle-check-big-rjFRL17W.js";
import "./useForwardPropsEmits-Bg8EFT5z.js";
import "./DialogTrigger-BkCo_TNH.js";
import "./index-B02yCj5F.js";
import "./Teleport-DGzoDYVu.js";
import "./x-CmVwNS2Q.js";
import "./plus-DsEdje6f.js";
import "./loader-ovkpVySn.js";
import "./users-REV2xOJM.js";
import "./house-B8Sz2ej8.js";
/**
 * @license lucide-vue-next v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const _e = te("pen", [
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        key: "1a8usu",
      },
    ],
  ]),
  pe = { class: "grid gap-4 py-4" },
  ge = { class: "grid gap-2" },
  ve = { class: "grid gap-2" },
  ye = { class: "grid gap-2" },
  xe = L({
    __name: "EditOrders",
    props: { open: { type: Boolean }, order: {} },
    emits: ["update:open"],
    setup(d, { emit: S }) {
      const x = d,
        $ = S,
        u = p(!1),
        c = p({
          order_total_price: 0,
          order_delivery_cost: 0,
          notes: "",
          restaurant_id: 0,
        });
      N(
        () => x.order,
        (_) => {
          _ &&
            (c.value = {
              order_total_price: _.order_total_price || 0,
              order_delivery_cost: _.order_delivery_cost || 0,
              notes: _.order_notes || "",
              restaurant_id: _.restaurant_id,
            });
        },
        { immediate: !0 }
      );
      const y = () => {
          $("update:open", !1);
        },
        k = async () => {
          if (x.order) {
            u.value = !0;
            try {
              await U.put(`/orders/${x.order.order_id}`, c.value),
                h.success("تم تحديث الطلب بنجاح!"),
                y();
            } catch (_) {
              h.error(_.response?.data?.message || "فشل تحديث الطلب");
            } finally {
              u.value = !1;
            }
          }
        };
      return (_, n) => (
        v(),
        C(
          r(G),
          { open: d.open, "onUpdate:open": y },
          {
            default: a(() => [
              o(
                r(Z),
                { class: "sm:max-w-[600px]", dir: "rtl" },
                {
                  default: a(() => [
                    o(r(J), null, {
                      default: a(() => [
                        o(r(K), null, {
                          default: a(() => [
                            m("تعديل الطلب #" + f(d.order?.order_id), 1),
                          ]),
                          _: 1,
                        }),
                        o(r(Q), null, {
                          default: a(() => [
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
                    s("div", pe, [
                      s("div", ge, [
                        o(
                          r(j),
                          { for: "order_delivery_cost" },
                          {
                            default: a(() => [
                              ...(n[4] || (n[4] = [m("تكلفة توصيل", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        o(
                          r(M),
                          {
                            id: "order_delivery_cost",
                            type: "number",
                            modelValue: c.value.order_delivery_cost,
                            "onUpdate:modelValue":
                              n[0] ||
                              (n[0] = (i) => (c.value.order_delivery_cost = i)),
                            placeholder: "أدخل تكلفة توصيل الطلب (ج.م)",
                          },
                          null,
                          8,
                          ["modelValue"]
                        ),
                      ]),
                      s("div", ve, [
                        o(
                          r(j),
                          { for: "order_total_price" },
                          {
                            default: a(() => [
                              ...(n[5] ||
                                (n[5] = [m("إجمالي السعر (ج.م)", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        o(
                          r(M),
                          {
                            id: "order_total_price",
                            modelValue: c.value.order_total_price,
                            "onUpdate:modelValue":
                              n[1] ||
                              (n[1] = (i) => (c.value.order_total_price = i)),
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
                      s("div", ye, [
                        o(
                          r(j),
                          { for: "notes" },
                          {
                            default: a(() => [
                              ...(n[6] || (n[6] = [m("ملاحظات", -1)])),
                            ]),
                            _: 1,
                          }
                        ),
                        o(
                          r(X),
                          {
                            id: "notes",
                            modelValue: c.value.notes,
                            "onUpdate:modelValue":
                              n[2] || (n[2] = (i) => (c.value.notes = i)),
                            placeholder: "أضف ملاحظات إضافية (اختياري)",
                            rows: "3",
                          },
                          null,
                          8,
                          ["modelValue"]
                        ),
                      ]),
                    ]),
                    o(r(Y), null, {
                      default: a(() => [
                        o(
                          r(w),
                          { variant: "outline", onClick: y, disabled: u.value },
                          {
                            default: a(() => [
                              ...(n[7] || (n[7] = [m(" إلغاء ", -1)])),
                            ]),
                            _: 1,
                          },
                          8,
                          ["disabled"]
                        ),
                        o(
                          r(w),
                          { onClick: k, disabled: u.value },
                          {
                            default: a(() => [
                              m(
                                f(u.value ? "جاري الحفظ..." : "حفظ التغييرات"),
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
  be = { class: "border border-border rounded-lg p-4" },
  $e = { class: "flex items-start justify-between mb-4" },
  ke = { class: "space-y-1" },
  we = { class: "flex items-center gap-2" },
  he = { class: "font-bold text-primary" },
  Ce = { class: "ml-1 capitalize" },
  Se = { class: "text-sm text-muted-foreground" },
  Ve = { class: "flex flex-col items-end gap-1" },
  Pe = { class: "font-bold text-lg" },
  Ue = { class: "font-bold text-lg" },
  De = { class: "order-items" },
  Te = ["src"],
  Be = { class: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" },
  ze = { class: "font-medium" },
  je = { class: "text-sm text-muted-foreground" },
  Ee = { class: "text-sm text-muted-foreground" },
  Ie = { class: "text-sm text-muted-foreground" },
  Oe = { class: "flex gap-2" },
  Fe = { class: "flex flex-col space-y-2" },
  Ne = { key: 0, class: "bonus btns space-x-1 md:space-x-2" },
  Le = L({
    __name: "OrderCard",
    props: { order: {} },
    emits: ["edit-click"],
    setup(d, { emit: S }) {
      const x = S,
        $ = q(),
        u = (i, t) => {
          U.put(`/orders/${i}?update_status=true`, {
            order_status: t,
            restaurant_id: $.user.id,
          })
            .then((g) => {
              h.success("تم تحديث حالة الطلب بنجاح!");
            })
            .catch((g) => {
              h.error("فشل في تحديث حالة الطلب.");
            });
        },
        c = (i, t) => {
          x("edit-click", i, t);
        },
        y = (i, t, g) => {
          const B = t.order_delivery_cost + g;
          U.put(`/orders/${i}`, {
            order_total_price: t.order_total_price,
            order_delivery_cost: B,
            notes: t.order_notes,
            restaurant_id: t.restaurant_id,
          })
            .then((z) => {
              h.success("تم تحديث تكلفة التوصيل بنجاح!");
            })
            .catch((z) => {
              h.error("فشل في تحديث تكلفة التوصيل.");
            });
        };
      function k(i) {
        switch (i) {
          case "preparing":
            return D(T, { class: "h-4 w-4" });
          case "ready":
            return D(ie, { class: "h-4 w-4" });
          case "picked-up":
            return D(ne, { class: "h-4 w-4" });
          default:
            return D(T, { class: "h-4 w-4" });
        }
      }
      function _(i) {
        switch (i) {
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
      function n(i) {
        switch (i) {
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
      return (i, t) => (
        v(),
        V("div", be, [
          s("div", $e, [
            s("div", ke, [
              s("div", we, [
                s("span", he, "#" + f(d.order.order_id), 1),
                o(
                  r(le),
                  { class: re(_(d.order.order_status)) },
                  {
                    default: a(() => [
                      (v(),
                      C(se(k(d.order.order_status)), { class: "h-3 w-3" })),
                      s("span", Ce, f(n(d.order.order_status)), 1),
                    ]),
                    _: 1,
                  },
                  8,
                  ["class"]
                ),
              ]),
              s(
                "p",
                Se,
                f(d.order.created_at.replace("T", " ").split(".")[0]),
                1
              ),
            ]),
            s("div", Ve, [
              s("span", Pe, f(d.order.order_total_price) + " ج.م ", 1),
              s("span", Ue, f(d.order.order_delivery_cost) + " ج.م ", 1),
            ]),
          ]),
          s("div", De, [
            s(
              "img",
              {
                src: "https://deliveryshop.cloud" + d.order.order_receipt,
                alt: "Receipt Image",
                class: "h-36 w-36 rounded-md object-cover mr-2",
              },
              null,
              8,
              Te
            ),
          ]),
          s("div", Be, [
            s("div", null, [
              s("p", ze, f(d.order.user_name) + " : الاسم", 1),
              s("p", je, f(d.order.user_phone) + " : التليفون ", 1),
              s("p", Ee, f(d.order.user_address) + " : العنوان ", 1),
            ]),
            s("div", null, [
              t[5] || (t[5] = s("p", { class: "font-medium" }, "ملاحظات", -1)),
              s("p", Ie, f(d.order.order_notes), 1),
            ]),
          ]),
          s("div", Oe, [
            d.order.order_status === "preparing"
              ? (v(),
                C(
                  r(w),
                  {
                    key: 0,
                    size: "sm",
                    class: "bg-green-600 hover:bg-green-700",
                    onClick:
                      t[0] || (t[0] = (g) => u(d.order.order_id, "ready")),
                  },
                  {
                    default: a(() => [
                      ...(t[6] || (t[6] = [m(" جاهز للاستلام ", -1)])),
                    ]),
                    _: 1,
                  }
                ))
              : P("", !0),
            d.order.order_status !== "delivered"
              ? (v(),
                C(
                  r(w),
                  {
                    key: 1,
                    size: "sm",
                    class: "bg-blue-600 hover:bg-blue-700",
                    onClick: t[1] || (t[1] = (g) => c(d.order, !0)),
                  },
                  {
                    default: a(() => [
                      o(r(_e), { class: "h-4 w-4 mr-2" }),
                      t[7] || (t[7] = m(" تعديل ", -1)),
                    ]),
                    _: 1,
                  }
                ))
              : P("", !0),
          ]),
          s("div", Fe, [
            t[11] || (t[11] = s("span", null, "إضافة علي التوصيل", -1)),
            d.order.order_status !== "delivered"
              ? (v(),
                V("div", Ne, [
                  o(
                    r(w),
                    {
                      onClick:
                        t[2] || (t[2] = (g) => y(d.order.order_id, d.order, 5)),
                    },
                    {
                      default: a(() => [
                        ...(t[8] || (t[8] = [m("+5 ج.م", -1)])),
                      ]),
                      _: 1,
                    }
                  ),
                  o(
                    r(w),
                    {
                      onClick:
                        t[3] ||
                        (t[3] = (g) => y(d.order.order_id, d.order, 10)),
                    },
                    {
                      default: a(() => [
                        ...(t[9] || (t[9] = [m("+10 ج.م", -1)])),
                      ]),
                      _: 1,
                    }
                  ),
                  o(
                    r(w),
                    {
                      onClick:
                        t[4] ||
                        (t[4] = (g) => y(d.order.order_id, d.order, 15)),
                    },
                    {
                      default: a(() => [
                        ...(t[10] || (t[10] = [m("+15 ج.م", -1)])),
                      ]),
                      _: 1,
                    }
                  ),
                ]))
              : P("", !0),
          ]),
        ])
      );
    },
  }),
  Me = { class: "p-6", dir: "rtl" },
  Ae = { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" },
  qe = { class: "text-2xl font-bold text-primary" },
  He = { class: "text-2xl font-bold text-green-500" },
  Re = { class: "mb-4 text-sm text-muted-foreground" },
  We = { class: "space-y-4" },
  Ge = { key: 0, class: "text-center py-8" },
  gt = L({
    __name: "HomePage",
    setup(d) {
      const S = q(),
        x = p(0),
        $ = p([]),
        u = p([]),
        c = p(!1),
        y = p(""),
        k = p(!1),
        _ = p({}),
        n = p({}),
        { messages: i } = ce(S.user?.id || 0),
        t = p(1),
        g = p(50),
        B = oe(() => Math.ceil(n.value.sum_of_orders / g.value)),
        z = async () => {
          c.value = !0;
          const e = new Date().toISOString().split("T")[0];
          try {
            const l = await U.get(`/orders?from=${e}&to=${e}`);
            u.value = l.data.orders;
          } catch (l) {
            y.value = l.message || "Failed to fetch restaurants";
          } finally {
            c.value = !1;
          }
        },
        H = async () => {
          c.value = !0;
          const e = new Date().toISOString().split("T")[0];
          try {
            const l = await U.get(
              `/orders?from=${e}&to=${e}&status=true&page=${t.value}`
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
        ae(() => {
          z(), H();
        }),
        N(
          i,
          (b) => {
            const e = b[b.length - 1];
            e &&
              (e.type === "new_order" &&
                (h.success("تم انشاء طلب جديد!"), u.value.push(e.order)),
              e.type === "updated_order" &&
                (u.value = u.value.map(
                  (l) => (
                    l.order_id === e.order.order_id &&
                      (console.log("Updating order:", e.order, l),
                      (l = e.order)),
                    l
                  )
                )),
              e.type === "order_status_updated" &&
                (console.log("Order status updated:", e.order),
                (u.value = u.value.map(
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
          u,
          (b) => {
            ($.value = b.filter((e) => e.order_status !== "delivered")),
              (x.value = b.filter(
                (e) => e.order_status === "delivered"
              ).length);
          },
          { immediate: !0, deep: !0 }
        ),
        (b, e) => (
          v(),
          V(
            A,
            null,
            [
              o(ee),
              s("div", Me, [
                s("div", Ae, [
                  o(r(E), null, {
                    default: a(() => [
                      o(
                        r(I),
                        {
                          class:
                            "flex flex-row items-center justify-between space-y-0 pb-2",
                        },
                        {
                          default: a(() => [
                            o(
                              r(O),
                              { class: "text-sm font-medium" },
                              {
                                default: a(() => [
                                  ...(e[2] ||
                                    (e[2] = [m("طلبات قيد الانتظار", -1)])),
                                ]),
                                _: 1,
                              }
                            ),
                            o(r(T), { class: "h-4 w-4 text-muted-foreground" }),
                          ]),
                          _: 1,
                        }
                      ),
                      o(r(F), null, {
                        default: a(() => [
                          s("div", qe, f($.value.length), 1),
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
                  o(r(E), null, {
                    default: a(() => [
                      o(
                        r(I),
                        {
                          class:
                            "flex flex-row items-center justify-between space-y-0 pb-2",
                        },
                        {
                          default: a(() => [
                            o(
                              r(O),
                              { class: "text-sm font-medium" },
                              {
                                default: a(() => [
                                  ...(e[4] ||
                                    (e[4] = [m("تم تسليمها النهارده", -1)])),
                                ]),
                                _: 1,
                              }
                            ),
                            o(r(fe), {
                              class: "h-4 w-4 text-muted-foreground",
                            }),
                          ]),
                          _: 1,
                        }
                      ),
                      o(r(F), null, {
                        default: a(() => [
                          s("div", He, f(x.value), 1),
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
                  Re,
                  " استعرض كل الطلبات بين التاريخين المحددين (صفحة " +
                    f(t.value) +
                    " من " +
                    f(B.value) +
                    ") ",
                  1
                ),
                o(r(E), null, {
                  default: a(() => [
                    o(r(I), null, {
                      default: a(() => [
                        o(r(O), null, {
                          default: a(() => [
                            ...(e[6] || (e[6] = [m("الطلبات الحالية", -1)])),
                          ]),
                          _: 1,
                        }),
                        o(r(ue), null, {
                          default: a(() => [
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
                    o(r(F), null, {
                      default: a(() => [
                        s("div", We, [
                          (v(!0),
                          V(
                            A,
                            null,
                            de(
                              $.value,
                              (l) => (
                                v(),
                                C(
                                  Le,
                                  {
                                    order: l,
                                    key: l.order_id,
                                    onEditClick: (R, W) => {
                                      (_.value = R), (k.value = W);
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
                          u.value.length
                            ? P("", !0)
                            : (v(),
                              V("div", Ge, [
                                o(r(T), {
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
                          !c.value && u.value.length > 0
                            ? (v(),
                              C(
                                me,
                                {
                                  key: 1,
                                  "current-page": t.value,
                                  "total-items": n.value.sum_of_orders,
                                  "items-per-page": g.value,
                                  "onUpdate:currentPage":
                                    e[0] || (e[0] = (l) => (t.value = l)),
                                },
                                null,
                                8,
                                [
                                  "current-page",
                                  "total-items",
                                  "items-per-page",
                                ]
                              ))
                            : P("", !0),
                        ]),
                      ]),
                      _: 1,
                    }),
                  ]),
                  _: 1,
                }),
              ]),
              o(
                xe,
                {
                  open: k.value,
                  "onUpdate:open": e[1] || (e[1] = (l) => (k.value = l)),
                  order: _.value,
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
export { gt as default };
