import{c as r,d as k,_ as d}from"./auth-BOWgCVVb.js";import{H as y}from"./house-DvnnnsCD.js";import{P as x,T as g}from"./truck-J7k0Gy93.js";import{M as f}from"./mail-BeP-FzBI.js";import{d as b,e as l,b as t,a as i,F as M,k as v,u as s,w as n,h as _,o as a,c,l as w,t as B,i as C,j as L}from"./index-d-g9mRbR.js";/**
 * @license lucide-vue-next v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=r("banknote",[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M6 12h.01M18 12h.01",key:"113zkx"}]]);/**
 * @license lucide-vue-next v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=r("building",[["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3",key:"cabbwy"}],["rect",{x:"4",y:"2",width:"16",height:"20",rx:"2",key:"1uxh74"}]]);/**
 * @license lucide-vue-next v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=r("id-card-lanyard",[["path",{d:"M13.5 8h-3",key:"xvov4w"}],["path",{d:"m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3",key:"16uttc"}],["path",{d:"M16.899 22A5 5 0 0 0 7.1 22",key:"1d0ppr"}],["path",{d:"m9 2 3 6",key:"1o7bd9"}],["circle",{cx:"12",cy:"15",r:"3",key:"g36mzq"}]]);/**
 * @license lucide-vue-next v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=r("store",[["path",{d:"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5",key:"slp6dd"}],["path",{d:"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",key:"o0xfot"}],["path",{d:"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",key:"wn3emo"}]]),H=[{title:"الرئيسية",url:"/management/dashboard",icon:y},{title:"الطلبات",url:"/management/orders",icon:x},{title:"المطاعم",url:"/management/restaurants",icon:A},{title:"السائقين",url:"/management/drivers",icon:g},{title:"التقارير",url:"/management/reports",icon:S},{title:"الموظفين",url:"/management/employees",icon:z},{title:"رسائل",url:"/management/messages",icon:f},{title:"المدن",url:"/management/cities",icon:V}],N={class:"w-64 border-r border-border bg-card flex flex-col transition-all duration-300"},R={class:"flex-1 p-4 space-y-2"},E=b({__name:"Sidebar",setup(T){const m=k(),p=_(),h=()=>{m.logout(),p.push("/management")};return(j,e)=>{const u=C("RouterLink");return a(),l("aside",N,[e[1]||(e[1]=t("div",{class:"p-6 border-b border-border text-center"},[t("h1",{class:"text-2xl font-semibold text-primary"},"لوحة الإدارة"),t("p",{class:"text-xs text-muted-foreground mt-1"},"نظام إدارة التوصيل")],-1)),t("nav",R,[(a(!0),l(M,null,v(s(H),o=>(a(),c(u,{to:o.url,class:"flex items-center gap-2"},{default:n(()=>[i(s(d),{variant:"ghost",class:"w-full justify-start gap-2"},{default:n(()=>[(a(),c(w(o.icon),{class:"w-4 h-4"})),t("p",null,B(o.title),1)]),_:2},1024)]),_:2},1032,["to"]))),256)),i(s(d),{class:"w-full",onClick:h},{default:n(()=>[...e[0]||(e[0]=[L(" تسجيل الخروج ",-1)])]),_:1})]),e[2]||(e[2]=t("div",{class:"border-t border-border p-4 text-center text-xs text-muted-foreground"}," الإصدار 1.0 ",-1))])}}});export{A as S,E as _};
