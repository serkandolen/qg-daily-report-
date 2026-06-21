import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

/* ============================================================
   QG EPC04 — Site Follow-Up  ·  single-file build (main.jsx)
   Clean redesign · mobile-first · Google Sheets backend preserved
   This ONE file replaces your old main.jsx. Nothing else changes.
   ============================================================ */

/* ---- Inject design-system CSS + font (no extra files needed) ---- */
(function injectStyles(){
  if (typeof document === "undefined") return;
  if (document.getElementById("sfu-css")) return;
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(link);
  var style = document.createElement("style");
  style.id = "sfu-css";
  style.textContent = "/* ============================================================\n   SITE FOLLOW-UP — Design System\n   Clean corporate / light theme · mobile-first\n   ============================================================ */\n\n:root{\n  /* Brand */\n  --primary:        #0E4D64;   /* deep petrol blue */\n  --primary-600:    #0A3D50;\n  --primary-700:    #082F3D;\n  --primary-soft:   #E5F0F4;\n  --primary-tint:   #F2F8FA;\n\n  --accent:         #F2870D;   /* safety amber — totals / key data */\n  --accent-soft:    #FDF1E1;\n\n  /* Neutrals */\n  --bg:             #EEF1F5;\n  --surface:        #FFFFFF;\n  --surface-2:      #F5F7FA;\n  --border:         #E4E8EF;\n  --border-strong:  #D2DAE4;\n\n  --text:           #16202E;\n  --text-2:         #5C6B80;\n  --text-3:         #93A1B3;\n\n  /* Status */\n  --success:        #1E8E5A;\n  --success-soft:   #E7F6EE;\n  --danger:         #D14343;\n  --danger-soft:    #FBECEC;\n  --info:           #2B6CB0;\n  --info-soft:      #EAF2FB;\n  --warn:           #C9820B;\n  --warn-soft:      #FCF3E2;\n\n  /* Radius / shadow */\n  --r-xs: 8px;\n  --r-sm: 10px;\n  --r:    14px;\n  --r-lg: 20px;\n  --shadow-sm: 0 1px 2px rgba(16,32,46,.06), 0 1px 3px rgba(16,32,46,.04);\n  --shadow:    0 2px 6px rgba(16,32,46,.06), 0 8px 24px rgba(16,32,46,.06);\n  --shadow-lg: 0 12px 40px rgba(16,32,46,.16);\n\n  --font: \"IBM Plex Sans\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif;\n  --nav-h: 64px;\n}\n\n*{ box-sizing:border-box; }\nhtml,body{ margin:0; padding:0; }\nbody{\n  font-family:var(--font);\n  background:#cfd6df;\n  color:var(--text);\n  -webkit-font-smoothing:antialiased;\n  text-rendering:optimizeLegibility;\n}\nbutton{ font-family:inherit; }\ninput,select,textarea{ font-family:inherit; }\n.tnum{ font-variant-numeric:tabular-nums; }\n\n/* ============================================================\n   APP SHELL (real viewport — production)\n   ============================================================ */\nhtml, body, #root{ height:100%; }\nbody{ background:var(--bg); }\n.app{\n  position:fixed; inset:0;\n  display:flex; flex-direction:column;\n  min-height:0; background:var(--bg);\n  max-width:560px; margin:0 auto;\n  box-shadow:0 0 60px rgba(16,32,46,.08);\n}\n.screen{\n  flex:1 1 auto;\n  overflow-y:auto;\n  -webkit-overflow-scrolling:touch;\n  padding:18px 18px calc(var(--nav-h) + 28px);\n}\n.screen::-webkit-scrollbar{ width:0; }\n\n/* App-loading splash */\n.boot{\n  position:fixed; inset:0; display:flex; flex-direction:column;\n  align-items:center; justify-content:center; gap:18px;\n  background:var(--bg); color:var(--text-2);\n}\n.boot .spin{\n  width:38px; height:38px; border-radius:50%;\n  border:3px solid var(--border-strong); border-top-color:var(--primary);\n  animation:spin 0.8s linear infinite;\n}\n@keyframes spin{ to{ transform:rotate(360deg); } }\n\n/* ============================================================\n   TOP BAR\n   ============================================================ */\n.topbar{\n  flex:0 0 auto;\n  background:var(--surface);\n  border-bottom:1px solid var(--border);\n  padding:14px 18px;\n  display:flex; align-items:center; gap:12px;\n}\n.topbar .brand-mark{\n  width:38px; height:38px; border-radius:11px;\n  background:linear-gradient(150deg, var(--primary), var(--primary-700));\n  display:flex; align-items:center; justify-content:center;\n  color:#fff; flex:0 0 auto;\n  box-shadow:inset 0 1px 0 rgba(255,255,255,.18);\n}\n.topbar .t-titles{ display:flex; flex-direction:column; line-height:1.1; min-width:0; }\n.topbar .t-kicker{\n  font-size:9.5px; letter-spacing:.16em; text-transform:uppercase;\n  color:var(--primary); font-weight:700;\n}\n.topbar .t-title{ font-size:16px; font-weight:700; letter-spacing:-.01em; }\n.topbar .t-actions{ margin-left:auto; display:flex; align-items:center; gap:8px; }\n\n.iconbtn{\n  width:40px; height:40px; border-radius:12px;\n  border:1px solid var(--border); background:var(--surface);\n  color:var(--text-2); display:flex; align-items:center; justify-content:center;\n  cursor:pointer; position:relative; transition:.15s;\n}\n.iconbtn:active{ transform:scale(.94); }\n.iconbtn .dot{\n  position:absolute; top:-3px; right:-3px; min-width:18px; height:18px;\n  padding:0 5px; border-radius:9px; background:var(--danger); color:#fff;\n  font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center;\n  border:2px solid var(--surface);\n}\n\n/* ============================================================\n   BOTTOM NAV\n   ============================================================ */\n.bottomnav{\n  position:absolute; left:0; right:0; bottom:0;\n  border-radius:0;\n  height:var(--nav-h);\n  background:rgba(255,255,255,.92);\n  backdrop-filter:blur(12px);\n  border-top:1px solid var(--border);\n  display:flex; align-items:stretch;\n  padding-bottom:env(safe-area-inset-bottom);\n  z-index:20;\n}\n.navitem{\n  flex:1; border:none; background:none; cursor:pointer;\n  display:flex; flex-direction:column; align-items:center; justify-content:center;\n  gap:3px; color:var(--text-3); font-size:10px; font-weight:600;\n  position:relative; transition:.15s; padding-top:6px;\n}\n.navitem .ni-ico{ width:24px; height:24px; display:flex; align-items:center; justify-content:center; }\n.navitem.active{ color:var(--primary); }\n.navitem.active .ni-ico{ transform:translateY(-1px); }\n.navitem .ni-badge{\n  position:absolute; top:4px; left:calc(50% + 6px);\n  min-width:16px; height:16px; padding:0 4px; border-radius:8px;\n  background:var(--danger); color:#fff; font-size:9px; font-weight:700;\n  display:flex; align-items:center; justify-content:center;\n  border:2px solid #fff;\n}\n\n/* ============================================================\n   CARDS / SECTIONS\n   ============================================================ */\n.card{\n  background:var(--surface);\n  border:1px solid var(--border);\n  border-radius:var(--r);\n  box-shadow:var(--shadow-sm);\n}\n.card.pad{ padding:18px; }\n.card + .card{ margin-top:14px; }\n\n.section-head{\n  display:flex; align-items:center; gap:10px; margin-bottom:14px;\n}\n.section-head .bar{ width:4px; height:18px; border-radius:3px; background:var(--primary); }\n.section-head .st{\n  font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;\n  color:var(--text-2);\n}\n.section-head .right{ margin-left:auto; }\n\n.page-title{ font-size:22px; font-weight:700; letter-spacing:-.02em; margin:2px 0 16px; }\n.page-sub{ color:var(--text-2); font-size:13px; margin-top:-12px; margin-bottom:16px; }\n\n/* ============================================================\n   FORM CONTROLS\n   ============================================================ */\n.field{ margin-bottom:15px; }\n.label{\n  display:block; font-size:11px; font-weight:700; letter-spacing:.05em;\n  text-transform:uppercase; color:var(--text-2); margin-bottom:7px;\n}\n.label .req{ color:var(--accent); }\n.input, .select, .textarea{\n  width:100%; padding:13px 14px; min-height:48px;\n  background:var(--surface); border:1.5px solid var(--border-strong);\n  border-radius:var(--r-xs); color:var(--text); font-size:15px;\n  outline:none; transition:.15s; -webkit-appearance:none; appearance:none;\n}\n.textarea{ min-height:auto; resize:vertical; line-height:1.55; }\n.input:focus, .select:focus, .textarea:focus{\n  border-color:var(--primary); box-shadow:0 0 0 4px var(--primary-soft);\n}\n.input::placeholder, .textarea::placeholder{ color:var(--text-3); }\n.select{\n  cursor:pointer;\n  background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235C6B80' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\");\n  background-repeat:no-repeat; background-position:right 13px center; padding-right:40px;\n}\n.grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }\n.grid-3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }\n\n.locked-field{\n  display:flex; align-items:center; gap:10px;\n  padding:11px 14px; min-height:48px;\n  border:1.5px solid var(--primary-soft); border-radius:var(--r-xs);\n  background:var(--primary-tint);\n}\n.locked-field .lk{ margin-left:auto; font-size:10px; color:var(--text-3);\n  display:flex; align-items:center; gap:4px; }\n\n/* Numeric subpanel */\n.subpanel{\n  background:var(--surface-2); border:1px solid var(--border);\n  border-radius:var(--r-sm); padding:15px; margin-bottom:15px;\n}\n.subpanel .sp-title{\n  font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;\n  color:var(--primary); margin-bottom:13px; display:flex; align-items:center; gap:7px;\n}\n.total-box{\n  display:flex; align-items:center; justify-content:center;\n  border:1.5px solid var(--accent); background:var(--accent-soft);\n  border-radius:var(--r-xs); min-height:48px;\n  font-size:26px; font-weight:800; color:var(--accent); font-variant-numeric:tabular-nums;\n}\n\n/* ============================================================\n   BUTTONS\n   ============================================================ */\n.btn{\n  display:inline-flex; align-items:center; justify-content:center; gap:8px;\n  padding:13px 18px; min-height:48px; border-radius:var(--r-xs);\n  font-size:14px; font-weight:700; cursor:pointer; border:1.5px solid transparent;\n  transition:.15s; width:100%;\n}\n.btn:active{ transform:translateY(1px); }\n.btn-primary{ background:var(--primary); color:#fff; box-shadow:var(--shadow-sm); }\n.btn-primary:active{ background:var(--primary-600); }\n.btn-accent{ background:var(--accent); color:#fff; }\n.btn-success{ background:var(--success); color:#fff; }\n.btn-outline{ background:var(--surface); color:var(--primary); border-color:var(--primary); }\n.btn-ghost{ background:var(--surface-2); color:var(--text-2); border-color:var(--border); }\n.btn-sm{ min-height:auto; padding:8px 14px; font-size:12px; width:auto; border-radius:var(--r-xs); }\n.btn-block + .btn-block{ margin-top:10px; }\n\n/* ============================================================\n   BADGES / CHIPS / PILLS\n   ============================================================ */\n.chip{\n  display:inline-flex; align-items:center; gap:5px;\n  background:var(--surface-2); border:1px solid var(--border);\n  border-radius:7px; padding:3px 9px; font-size:12px; font-weight:600; color:var(--text);\n}\n.chip.area{ background:var(--primary-tint); border-color:var(--primary-soft); color:var(--primary); }\n.pill{\n  display:inline-flex; align-items:center; gap:4px;\n  border-radius:99px; padding:3px 10px; font-size:10.5px; font-weight:700;\n  letter-spacing:.03em; text-transform:uppercase;\n}\n.pill.open{ background:var(--danger-soft); color:var(--danger); }\n.pill.resolved{ background:var(--success-soft); color:var(--success); }\n\n.count-pill{\n  display:inline-flex; align-items:center; justify-content:center;\n  min-width:20px; height:20px; padding:0 6px; border-radius:10px;\n  background:var(--primary); color:#fff; font-size:11px; font-weight:700;\n}\n\n/* ============================================================\n   AVATAR\n   ============================================================ */\n.avatar{\n  border-radius:50%; display:flex; align-items:center; justify-content:center;\n  color:#fff; font-weight:700; flex:0 0 auto; text-transform:uppercase;\n}\n\n/* ============================================================\n   STATS\n   ============================================================ */\n.stat{\n  background:var(--surface); border:1px solid var(--border); border-radius:var(--r-sm);\n  padding:13px 10px; text-align:center;\n}\n.stat .sv{ font-size:24px; font-weight:800; color:var(--text); font-variant-numeric:tabular-nums; line-height:1; }\n.stat .sl{ font-size:9.5px; letter-spacing:.07em; text-transform:uppercase; color:var(--text-3); margin-top:6px; font-weight:600; }\n.stat.accent .sv{ color:var(--accent); }\n.stat.primary .sv{ color:var(--primary); }\n.stat.danger  .sv{ color:var(--danger); }\n.stat-row{ display:grid; gap:10px; }\n\n/* ============================================================\n   TABLE\n   ============================================================ */\n.tbl-wrap{ overflow-x:auto; border-radius:var(--r-sm); }\ntable.tbl{ width:100%; border-collapse:collapse; font-size:13px; }\ntable.tbl th{\n  text-align:left; padding:10px 12px; font-size:9.5px; font-weight:700;\n  letter-spacing:.06em; text-transform:uppercase; color:var(--text-3);\n  background:var(--surface-2); white-space:nowrap; border-bottom:1px solid var(--border);\n}\ntable.tbl td{ padding:11px 12px; border-bottom:1px solid var(--border); white-space:nowrap; }\ntable.tbl tr:last-child td{ border-bottom:none; }\ntable.tbl .tot-row td{ background:var(--surface-2); font-weight:800; border-top:2px solid var(--primary); }\n.num{ text-align:center; font-variant-numeric:tabular-nums; }\n\n/* ============================================================\n   ENGINEERING CARD\n   ============================================================ */\n.eng{\n  border-radius:var(--r-sm); border:1px solid var(--border);\n  background:var(--surface); padding:14px 15px; box-shadow:var(--shadow-sm);\n}\n.eng + .eng{ margin-top:10px; }\n.eng.open{ border-left:4px solid var(--danger); }\n.eng.resolved{ border-left:4px solid var(--success); background:var(--surface-2); }\n.eng .eng-meta{ display:flex; gap:7px; flex-wrap:wrap; align-items:center; margin-bottom:9px; }\n.eng .eng-date{ font-size:11px; color:var(--text-2); font-weight:600; }\n.eng .eng-id{ font-size:10px; color:var(--text-3); margin-left:auto; }\n.eng .eng-desc{ font-size:14px; line-height:1.6; color:var(--text); white-space:pre-wrap; }\n.eng .eng-photos{ display:flex; gap:8px; flex-wrap:wrap; margin-top:11px; }\n.eng .eng-photos img{ width:64px; height:64px; object-fit:cover; border-radius:8px; border:1px solid var(--border); cursor:zoom-in; }\n.eng .resolved-stamp{\n  display:flex; align-items:center; gap:7px; margin-top:10px;\n  background:var(--success-soft); border-radius:8px; padding:7px 11px;\n  font-size:12px; color:var(--success); font-weight:600;\n}\n\n/* ============================================================\n   PENDING / STAGED\n   ============================================================ */\n.pending{\n  background:var(--surface); border:1.5px dashed var(--accent);\n  border-radius:var(--r); padding:15px; margin-bottom:16px;\n}\n.pending .ph{\n  display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;\n}\n.pending .ph-label{\n  font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;\n  color:var(--accent); display:flex; align-items:center; gap:7px;\n}\n.staged-row{\n  display:flex; align-items:center; gap:10px; padding:10px 0;\n  border-bottom:1px solid var(--border);\n}\n.staged-row:last-child{ border-bottom:none; }\n.staged-row .x{\n  width:30px; height:30px; flex:0 0 auto; border-radius:8px;\n  border:1px solid var(--danger); color:var(--danger); background:var(--danger-soft);\n  cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px;\n}\n\n/* ============================================================\n   FLASH / TOAST\n   ============================================================ */\n.flash{\n  position:absolute; left:14px; right:14px; top:14px; z-index:40;\n  background:var(--success); color:#fff; padding:13px 16px; border-radius:var(--r-sm);\n  font-size:14px; font-weight:600; box-shadow:var(--shadow-lg);\n  display:flex; align-items:center; gap:9px;\n  animation:flashIn .25s ease;\n}\n@keyframes flashIn{ from{ opacity:0; transform:translateY(-12px); } to{ opacity:1; transform:none; } }\n\n.banner{\n  display:flex; align-items:center; gap:10px; padding:12px 14px;\n  border-radius:var(--r-sm); font-size:13px; margin-bottom:14px; font-weight:500;\n}\n.banner.danger{ background:var(--danger-soft); color:var(--danger); border:1px solid #f3cccc; }\n.banner.info{ background:var(--info-soft); color:var(--info); border:1px solid #cfe0f3; }\n\n.alert{\n  background:var(--danger-soft); border:1px solid #f1c9c9; color:var(--danger);\n  border-radius:var(--r-xs); padding:11px 13px; font-size:13px; margin-bottom:13px; font-weight:500;\n}\n\n/* ============================================================\n   SEGMENTED FILTER\n   ============================================================ */\n.segmented{ display:inline-flex; background:var(--surface-2); border:1px solid var(--border);\n  border-radius:10px; padding:3px; gap:2px; }\n.segmented button{\n  border:none; background:none; cursor:pointer; padding:7px 14px; border-radius:8px;\n  font-size:12px; font-weight:600; color:var(--text-2); transition:.12s;\n}\n.segmented button.on{ background:var(--surface); color:var(--primary); box-shadow:var(--shadow-sm); }\n\n/* ============================================================\n   EMPTY STATE\n   ============================================================ */\n.empty{\n  text-align:center; padding:34px 20px; color:var(--text-3); font-size:14px;\n}\n.empty .ee{ font-size:30px; margin-bottom:10px; opacity:.6; }\n\n/* ============================================================\n   CHAT\n   ============================================================ */\n.chat-wrap{ display:flex; flex-direction:column; height:100%; }\n.chat-scroll{ flex:1; overflow-y:auto; padding:4px 2px; }\n.chat-scroll::-webkit-scrollbar{ width:0; }\n.msg-group{ margin-bottom:14px; display:flex; flex-direction:column; }\n.msg-group.me{ align-items:flex-end; }\n.msg-head{ display:flex; align-items:center; gap:7px; margin-bottom:5px; }\n.msg-head.me{ flex-direction:row-reverse; }\n.msg-head .nm{ font-size:12px; font-weight:700; }\n.msg-head .tm{ font-size:10px; color:var(--text-3); }\n.bubble{\n  max-width:78%; padding:10px 13px; font-size:14px; line-height:1.5;\n  border-radius:16px; word-break:break-word; margin-left:34px;\n}\n.msg-group.me .bubble{ margin-left:0; margin-right:34px; }\n.bubble.them{ background:var(--surface); border:1px solid var(--border); border-top-left-radius:5px; color:var(--text); }\n.bubble.me{ background:var(--primary); color:#fff; border-bottom-right-radius:5px; }\n.bubble + .bubble{ margin-top:4px; }\n.chat-input{\n  display:flex; gap:9px; align-items:flex-end; padding-top:11px;\n  border-top:1px solid var(--border);\n}\n.chat-input .ci-box{\n  flex:1; border:1.5px solid var(--border-strong); border-radius:22px;\n  padding:11px 16px; font-size:14px; outline:none; resize:none; max-height:90px; min-height:46px;\n}\n.chat-input .ci-box:focus{ border-color:var(--primary); }\n.chat-input .send{\n  width:46px; height:46px; flex:0 0 auto; border-radius:50%; border:none;\n  background:var(--primary); color:#fff; cursor:pointer; display:flex;\n  align-items:center; justify-content:center;\n}\n.chat-input .send:disabled{ background:var(--border-strong); cursor:default; }\n\n/* ============================================================\n   LIGHTBOX\n   ============================================================ */\n.lightbox{\n  position:absolute; inset:0; z-index:90; background:rgba(8,12,18,.88);\n  display:flex; align-items:center; justify-content:center; padding:24px;\n}\n.lightbox img{ max-width:100%; max-height:100%; border-radius:12px; }\n.lightbox .lx-close{ position:absolute; top:18px; right:18px; width:40px; height:40px;\n  border-radius:50%; background:rgba(255,255,255,.15); color:#fff; border:none;\n  font-size:20px; cursor:pointer; }\n\n/* ============================================================\n   SHEET (more menu / profile)\n   ============================================================ */\n.sheet-scrim{ position:absolute; inset:0; z-index:60; background:rgba(16,32,46,.42);\n  display:flex; align-items:flex-end; animation:fade .2s ease; }\n@keyframes fade{ from{ opacity:0; } to{ opacity:1; } }\n.sheet{\n  width:100%; background:var(--surface); border-radius:22px 22px 0 0;\n  padding:10px 18px calc(20px + env(safe-area-inset-bottom));\n  box-shadow:var(--shadow-lg); animation:sheetUp .26s cubic-bezier(.2,.8,.2,1);\n}\n@keyframes sheetUp{ from{ transform:translateY(100%); } to{ transform:none; } }\n.sheet .grip{ width:40px; height:4px; border-radius:2px; background:var(--border-strong);\n  margin:6px auto 14px; }\n.sheet .s-row{\n  display:flex; align-items:center; gap:13px; padding:14px 6px;\n  border-bottom:1px solid var(--border); cursor:pointer; font-size:15px; font-weight:600;\n}\n.sheet .s-row:last-child{ border-bottom:none; }\n.sheet .s-row .s-ico{ width:38px; height:38px; border-radius:11px; background:var(--surface-2);\n  display:flex; align-items:center; justify-content:center; color:var(--primary); flex:0 0 auto; }\n.sheet .s-row.danger{ color:var(--danger); }\n.sheet .s-row.danger .s-ico{ color:var(--danger); background:var(--danger-soft); }\n\n/* ============================================================\n   COMBOBOX (type-ahead sub-area)\n   ============================================================ */\n.cmb{ position:relative; }\n.cmb-list{\n  position:absolute; left:0; right:0; top:calc(100% + 5px); z-index:50;\n  background:var(--surface); border:1px solid var(--border-strong);\n  border-radius:var(--r-xs); box-shadow:var(--shadow);\n  max-height:190px; overflow-y:auto; padding:5px;\n}\n.cmb-item{\n  padding:10px 12px; border-radius:8px; font-size:14px; cursor:pointer;\n  display:flex; align-items:center; gap:6px; color:var(--text);\n}\n.cmb-item:hover{ background:var(--primary-tint); }\n.cmb-new{ color:var(--accent); font-weight:600; border-top:1px solid var(--border); margin-top:3px; padding-top:11px; border-radius:0 0 8px 8px; }\n.cmb-new:hover{ background:var(--accent-soft); }\n\n/* sub-area chip in management */\n.sa-chip{\n  display:inline-flex; align-items:center; gap:6px;\n  background:var(--surface-2); border:1px solid var(--border);\n  border-radius:8px; padding:5px 7px 5px 11px; font-size:13px; font-weight:600; color:var(--text);\n}\n.sa-chip button{\n  width:20px; height:20px; border:none; border-radius:6px; cursor:pointer;\n  background:var(--danger-soft); color:var(--danger);\n  display:flex; align-items:center; justify-content:center;\n}\n.sa-group{ padding:12px 0; border-bottom:1px solid var(--border); }\n.sa-group:last-child{ border-bottom:none; }\n\n/* ============================================================\n   MANAGEMENT ROWS (admin)\n   ============================================================ */\n.mgmt-row{\n  display:flex; align-items:center; gap:11px;\n  padding:11px 0; border-bottom:1px solid var(--border);\n}\n.mgmt-row:last-of-type{ border-bottom:none; }\n.sq{\n  width:38px; height:38px; flex:0 0 auto; border-radius:10px;\n  border:1px solid var(--border-strong); background:var(--surface);\n  color:var(--text-2); cursor:pointer; display:flex; align-items:center; justify-content:center;\n  transition:.15s;\n}\n.sq:active{ transform:scale(.93); }\n.sq:disabled{ opacity:.4; cursor:default; }\n.sq.ok{ border-color:var(--success); color:var(--success); background:var(--success-soft); }\n.sq.danger{ border-color:var(--danger); color:var(--danger); background:var(--danger-soft); }\n\n/* ============================================================\n   LOGIN\n   ============================================================ */\n.login{\n  position:absolute; inset:0; display:flex; flex-direction:column;\n  background:\n    linear-gradient(180deg, var(--primary-700) 0%, var(--primary) 46%, #0d5570 100%);\n  color:#fff; overflow:hidden;\n}\n.login .lg-deco{ position:absolute; inset:0; opacity:.5; pointer-events:none; }\n.login .lg-top{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;\n  padding:40px 32px 10px; position:relative; z-index:2; }\n.login .lg-logo{\n  width:74px; height:74px; border-radius:22px; margin-bottom:22px;\n  background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.2);\n  display:flex; align-items:center; justify-content:center;\n  backdrop-filter:blur(8px); box-shadow:var(--shadow-lg);\n}\n.login .lg-kicker{ font-size:11px; letter-spacing:.22em; text-transform:uppercase;\n  color:rgba(255,255,255,.7); font-weight:600; margin-bottom:8px; }\n.login .lg-title{ font-size:30px; font-weight:800; letter-spacing:-.02em; text-align:center; line-height:1.1; }\n.login .lg-tag{ font-size:13px; color:rgba(255,255,255,.62); margin-top:10px; text-align:center; }\n.login .lg-card{\n  position:relative; z-index:2; background:var(--surface); color:var(--text);\n  border-radius:26px 26px 0 0; padding:26px 24px calc(28px + env(safe-area-inset-bottom));\n  box-shadow:0 -10px 40px rgba(0,0,0,.25);\n}\n.login .lg-card h3{ font-size:18px; font-weight:700; margin:0 0 4px; }\n.login .lg-card p{ font-size:13px; color:var(--text-2); margin:0 0 20px; }\n.login .lg-hint{ font-size:11.5px; color:var(--text-3); text-align:center; margin-top:14px; }\n";
  document.head.appendChild(style);
  var extra = document.createElement("style");
  extra.textContent = ".offline-bar{ position:fixed; top:0; left:0; right:0; z-index:999; background:#C0392B; color:#fff; text-align:center; font-size:12.5px; font-weight:700; padding:8px 12px; letter-spacing:.01em; } .lang-toggle{ font-size:12px; font-weight:800; letter-spacing:.04em; color:var(--primary); } .lang-corner{ position:absolute; top:14px; right:16px; z-index:3; background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.3); color:#fff; font-size:12px; font-weight:800; border-radius:9px; padding:7px 12px; cursor:pointer; } .cmb-hint{ padding:9px 12px; font-size:12px; color:var(--text-3); font-weight:500; }"
    + ".topbar .brand-mark{ background:linear-gradient(150deg,#FF8A33,#E0322E)!important; box-shadow:0 2px 10px rgba(224,50,46,.35), inset 0 1px 0 rgba(255,255,255,.25)!important; }"
    + ".login .lg-logo{ background:linear-gradient(150deg,#FF8A33,#E0322E)!important; border-color:rgba(255,150,90,.5)!important; box-shadow:0 10px 30px rgba(224,50,46,.45)!important; }"
    + ".login{ background:linear-gradient(180deg, rgba(8,28,38,.58), rgba(8,40,52,.66) 50%, rgba(7,42,54,.82)), url('data:image/jpeg;base64,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') center/cover no-repeat fixed !important; }"
    + ".man-table{ display:flex; flex-direction:column; gap:12px; }"
    + ".man-group{ background:var(--surface); border:1px solid var(--border); border-radius:10px; overflow:hidden; }"
    + ".man-ghead{ display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--surface-2); border-bottom:1px solid var(--border); }"
    + ".man-gtag{ font-size:10.5px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:#fff; padding:3px 9px; border-radius:6px; }"
    + ".man-gtag.direct{ background:var(--accent); } .man-gtag.indirect{ background:var(--primary); } .man-gtag.support{ background:#6B7A90; }"
    + ".man-gsub{ font-size:15px; font-weight:800; color:var(--text-2); }"
    + ".man-row{ display:flex; align-items:center; gap:10px; padding:7px 12px; border-top:1px solid var(--border); }"
    + ".man-row:first-of-type{ border-top:none; }"
    + ".man-rl{ flex:1; font-size:14px; color:var(--text); }"
    + ".man-row.on{ background:var(--accent-soft); }"
    + ".man-row.on .man-rl{ font-weight:700; }"
    + ".man-inp{ width:66px; text-align:center; padding:9px 8px; border:1.5px solid var(--border-strong); border-radius:8px; font-size:15px; font-weight:600; outline:none; -webkit-appearance:none; appearance:none; background:var(--surface); }"
    + ".man-inp:focus{ border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-soft); }"
    + ".man-row.on .man-inp{ border-color:var(--accent); color:var(--accent); }"
    + ".man-grand{ display:flex; align-items:center; justify-content:space-between; padding:13px 16px; background:var(--accent); color:#fff; border-radius:10px; font-weight:700; }"
    + ".man-grand span:last-child{ font-size:24px; font-weight:800; }"
    + ".punch-no{ font-size:13px; font-weight:800; color:var(--accent); background:var(--accent-soft); border-radius:6px; padding:2px 8px; letter-spacing:.02em; }"
    + ".metric-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }"
    + ".metric-cell{ display:flex; flex-direction:column; }"
    + ".metric-lbl{ font-size:11px; font-weight:700; color:var(--text-2); margin-bottom:5px; }"
    + ".metric-unit{ font-size:9px; font-weight:800; color:#fff; background:var(--text-3); border-radius:4px; padding:1px 5px; letter-spacing:.04em; vertical-align:middle; }"
    + ".wk-head{ display:grid; grid-template-columns:1fr 70px 70px; gap:8px; padding:0 2px 8px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--text-3); }"
    + ".wk-head span:not(:first-child){ text-align:center; }"
    + ".wk-row{ display:grid; grid-template-columns:1fr 70px 70px; gap:8px; align-items:center; padding:5px 2px; border-top:1px solid var(--border); }"
    + ".wk-metric{ font-size:12.5px; color:var(--text); }"
    + ".wk-in{ min-height:40px; padding:8px 8px; text-align:center; font-size:14px; }"
    + ".wk-toggle{ display:flex; align-items:center; gap:10px; width:100%; border:none; background:none; padding:13px 14px; cursor:pointer; }";
  document.head.appendChild(extra);
})();


/* ═══════════════════ BACKEND (Google Sheets) ═══════════════════ */

/* ─────────── Keys & tab mapping (unchanged + 2 new) ─────────── */
const STORAGE_KEY  = "qg_reports_v8";
const ENG_KEY      = "qg_engineering_v8";
const USERS_KEY    = "qg_users_v8";
const CHAT_KEY     = "qg_chat_v8";
const TARGETS_KEY  = "qg_targets_v8";
const AREAS_KEY    = "qg_areas_v8";
const PUNCH_KEY    = "qg_punch_v8";
const WEEKLY_KEY   = "qg_weekly_v8";
const SETTINGS_KEY = "qg_settings_v8";

const ADMIN_USER = "Serkan";
const GUEST_USER = "Guest";

/* Fallback roster/passwords — used only if the Users sheet is empty */
const DEFAULT_PASSWORDS = {
  Arun:"arun01", Asim:"asim01", Botan:"botan01", Alkan:"alkan01",
  Serkan:"643844", Supervisor01:"sup0101", Supervisor02:"sup0201", Supervisor03:"sup0301",
  Guest:"guest01"
};
const DEFAULT_AREAS = [];   // no sample areas — each project loads its own (sheet / import)
const DEFAULT_PROJECT = { name:"QATAR TWJV EPC-04", kicker:"SECOSYS", company:"SECOSYS" };

/* ⚠️ Same web-app URL as your current app */
const GAS_URL = "https://script.google.com/macros/s/AKfycbxTc05zFKhpgZc5pvlqsUYEYgyFvQFSGzK2WZgIYupH_0vZYImRhWqIm5D_-cREXnL8/exec";

const TAB_MAP = {
  [STORAGE_KEY]:  "Reports",
  [ENG_KEY]:      "Engineering",
  [USERS_KEY]:    "Users",
  [CHAT_KEY]:     "Chat",
  [TARGETS_KEY]:  "Targets",
  [AREAS_KEY]:    "Areas",
  [PUNCH_KEY]:    "Punch",
  [WEEKLY_KEY]:   "WeeklyTargets",
  [SETTINGS_KEY]: "Settings",
};

/* ─────────── Helpers (unchanged) ─────────── */
function makeId(prefix="R"){
  const d = new Date();
  const date = d.toISOString().slice(0,10).replace(/-/g,"");
  const rand = Math.random().toString(36).slice(2,6).toUpperCase();
  return `${prefix}-${date}-${rand}`;
}
function fmtDT(iso){
  if(!iso) return "";
  try{ return new Date(iso).toLocaleString("en-GB",{ day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }); }
  catch{ return iso; }
}
function fmtForSheet(){
  const d = new Date(), pad = n => String(n).padStart(2,"0");
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const todayStr = () => new Date().toISOString().split("T")[0];

/* ─────────── Core GAS calls (unchanged) ─────────── */
async function gasCall(params){
  try{
    const qs = Object.entries(params).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join("&");
    const res = await fetch(`${GAS_URL}?${qs}`);
    return await res.json();
  }catch(e){ console.error("GAS error:", e); return null; }
}

async function sget(key){
  try{
    const data = await gasCall({ action:"get", tab: TAB_MAP[key] });
    if(key === USERS_KEY){
      /* If the Users sheet has rows, use them AS-IS (so removed supervisors
         stay removed). Fall back to defaults only when the sheet is empty. */
      if(Array.isArray(data) && data.length){
        const obj = {};
        data.forEach(r => { if(r.name) obj[r.name] = r.password; });
        return obj;
      }
      return { ...DEFAULT_PASSWORDS };
    }
    return Array.isArray(data) ? data : [];
  }catch{ return null; }
}

async function sappend(key, newRows){
  try{
    const rows = Array.isArray(newRows) ? newRows : [newRows];
    const clean = key === ENG_KEY ? rows.map(r => ({ ...r, photos: [] })) : rows;
    await gasCall({ action:"append", tab: TAB_MAP[key], data: JSON.stringify(clean) });
  }catch(e){ console.error("append error:", e); }
}

async function sset(key, data){
  try{
    let rows = data;
    if(key === USERS_KEY) rows = Object.entries(data).map(([name,password]) => ({ name, password }));
    await gasCall({ action:"set", tab: TAB_MAP[key], data: JSON.stringify(rows) });
  }catch(e){ console.error("sset error:", e); }
}

async function sdelete(key, id){
  try{ await gasCall({ action:"delete", tab: TAB_MAP[key], id }); }
  catch(e){ console.error("delete error:", e); }
}

async function supdateStatus(id, status, resolvedAt){
  try{ await gasCall({ action:"update_status", tab:"Engineering", id, status, resolvedAt: resolvedAt||"" }); }
  catch(e){ console.error("status error:", e); }
}

async function ppatchStatus(id, status, closedAt){
  try{ await gasCall({ action:"update_status", tab:"Punch", id, status, resolvedAt: closedAt||"" }); }
  catch(e){ console.error("punch status error:", e); }
}

async function gasUpdate(key, keyCol, keyVal, fields){
  try{ await gasCall({ action:"update", tab: TAB_MAP[key], keyCol, keyVal, data: JSON.stringify(fields) }); }
  catch(e){ console.error("update error:", e); }
}

/* ─────────── Image compression (unchanged) ─────────── */
function compressImage(file){
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX=600, w0=img.width, h0=img.height;
        const w=w0>MAX?MAX:w0, h=w0>MAX?Math.round(h0*MAX/w0):h0;
        const c=document.createElement("canvas"); c.width=w; c.height=h;
        c.getContext("2d").drawImage(img,0,0,w,h);
        res(c.toDataURL("image/jpeg",0.72));
      };
      img.src=e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ════════════════════════════════════════════════════════════
   AREAS + SUB-AREAS  (new "Areas" tab: columns area, subArea)
   Rows: one per (area, subArea). An area with no sub-areas is
   stored as a single row with subArea = "".
   ════════════════════════════════════════════════════════════ */
async function loadAreas(records){
  let rows = null;
  try{ rows = await gasCall({ action:"get", tab:"Areas" }); }catch{ rows = null; }

  const areas = [];
  const subAreas = {};
  const addArea = a => { if(a && !areas.includes(a)){ areas.push(a); subAreas[a] = subAreas[a]||[]; } };
  const addSub  = (a,s) => { if(!a) return; addArea(a); if(s && !subAreas[a].includes(s)) subAreas[a].push(s); };

  if(Array.isArray(rows) && rows.length){
    rows.forEach(r => addSub(r.area, r.subArea));
  } else {
    DEFAULT_AREAS.forEach(addArea);
  }
  /* Always merge in anything already present in real records, so the
     picker never misses an area/sub-area someone has used. */
  (records || []).forEach(r => { if(r.area) addSub(r.area, r.subArea && r.subArea !== "-" ? r.subArea : ""); });

  return { areas, subAreas };
}

async function saveAreas(areas, subAreas){
  const rows = [];
  areas.forEach(a => {
    const subs = subAreas[a] || [];
    if(subs.length) subs.forEach(s => rows.push({ area:a, subArea:s }));
    else rows.push({ area:a, subArea:"" });
  });
  try{ await gasCall({ action:"set", tab:"Areas", data: JSON.stringify(rows) }); }
  catch(e){ console.error("saveAreas error:", e); }
}

/* ════════════════════════════════════════════════════════════
   PROJECT IDENTITY  (new "Settings" tab: columns key, value)
   ════════════════════════════════════════════════════════════ */
async function loadProject(){
  let rows = null;
  try{ rows = await gasCall({ action:"get", tab:"Settings" }); }catch{ rows = null; }
  const p = { ...DEFAULT_PROJECT };
  if(Array.isArray(rows)) rows.forEach(r => { if(r.key && r.key in p) p[r.key] = r.value; });
  return p;
}
async function saveProject(project){
  const rows = Object.entries(project).map(([key,value]) => ({ key, value }));
  try{ await gasCall({ action:"set", tab:"Settings", data: JSON.stringify(rows) }); }
  catch(e){ console.error("saveProject error:", e); }
}

/* ─────────── Roles (new "Roles" tab: columns group, key, label, order) ─────────── */
async function loadRoles(){
  let rows = null;
  try{ rows = await gasCall({ action:"get", tab:"Roles" }); }catch{ rows = null; }
  if(!Array.isArray(rows) || !rows.length) return null;
  const groups = GROUP_META.map(g => ({ id:g.id, label:g.label, roles:[] }));
  const byId = Object.fromEntries(groups.map(g => [g.id, g]));
  rows.slice().sort((a,b) => (parseInt(a.order)||0) - (parseInt(b.order)||0))
    .forEach(r => {
      const gid = String(r.group||"").toLowerCase();
      if(byId[gid] && r.key && r.label) byId[gid].roles.push({ key:String(r.key), label:String(r.label) });
    });
  return groups;
}
async function saveRoles(groups){
  const rows = [];
  groups.forEach(g => g.roles.forEach((role, i) => rows.push({ group:g.id, key:role.key, label:role.label, order:i })));
  try{ await gasCall({ action:"set", tab:"Roles", data: JSON.stringify(rows) }); }
  catch(e){ console.error("saveRoles error:", e); }
}

/* ─────────── Avatar colors ─────────── */
const AVATAR_COLORS = {
  Arun:"#E0622E", Asim:"#1E8E5A", Botan:"#7A5AE0", Alkan:"#C9820B",
  Serkan:"#0E4D64", Supervisor01:"#2B6CB0", Supervisor02:"#C0397B", Supervisor03:"#0F8A8A", Guest:"#5C6B80"
};
const PALETTE = ["#E0622E","#1E8E5A","#7A5AE0","#C9820B","#0E4D64","#2B6CB0","#C0397B","#0F8A8A","#9B4DCA","#D14343","#3A7D44","#B5651D"];
function colorFor(name){
  if(!name) return "#5C6B80";
  if(AVATAR_COLORS[name]) return AVATAR_COLORS[name];
  let h = 0; for(const c of name) h = (h*31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/* ─────────── Manpower role model (3 fixed groups · editable roles) ─────────── */
const DEFAULT_ROLE_GROUPS = [
  { id:"direct", label:"Direct", roles:[
    { key:"welder",        label:"Welder" },
    { key:"pipeFitter",    label:"Pipe Fitter" },
    { key:"fitterHelper",  label:"Fitter Helper" },
    { key:"rigger",        label:"Rigger" },
    { key:"grinder",       label:"Grinder" },
    { key:"gasCutter",     label:"Gas Cutter" },
    { key:"hydrotestCrew", label:"Hydrotest Crew" },
    { key:"greLaminator",  label:"GRE Laminator" },
  ]},
  { id:"indirect", label:"Indirect", roles:[
    { key:"foreman",        label:"Foreman" },
    { key:"supervisorRole", label:"Supervisor" },
    { key:"fieldEngineer",  label:"Field Engineer" },
    { key:"qcInspector",    label:"QC Inspector" },
    { key:"hseOfficer",     label:"HSE Officer" },
  ]},
  { id:"support", label:"Support", roles:[
    { key:"scaffolder",    label:"Scaffolder" },
    { key:"craneOperator", label:"Crane Operator" },
    { key:"helperLabour",  label:"Helper / Labour" },
  ]},
];
const GROUP_META = [{ id:"direct", label:"Direct" }, { id:"indirect", label:"Indirect" }, { id:"support", label:"Support" }];
const roleSlug = (s) => (String(s).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")) || ("role_" + Math.random().toString(36).slice(2,6));
const allRoles = (groups) => (groups || DEFAULT_ROLE_GROUPS).flatMap(g => g.roles);

const roleVal = (r, key) => { const n = parseInt(r[key]); return isNaN(n) ? 0 : n; };
/* Works for new (per-role) and old (welder/pipeFitter only) rows. */
function manStats(r, groups){
  const G = groups || DEFAULT_ROLE_GROUPS;
  const g = {}; G.forEach(grp => g[grp.id] = 0);
  G.forEach(grp => grp.roles.forEach(role => { g[grp.id] += roleVal(r, role.key); }));
  let total = 0; Object.values(g).forEach(v => total += v);
  if(total === 0 && r.totalManpower){ total = parseInt(r.totalManpower) || 0; }
  const byRole = allRoles(G).map(role => ({ ...role, n:roleVal(r, role.key) })).filter(x => x.n > 0);
  return { direct:g.direct||0, indirect:g.indirect||0, support:g.support||0, total, byRole };
}
const blankMan = (groups) => Object.fromEntries(allRoles(groups).map(r => [r.key, ""]));

/* ─────────── Target metric model ─────────── */
const TARGET_METRICS = [
  { key:"fitUp",         label:"Fit-Up",           unit:"DI" },
  { key:"welding",       label:"Welding",          unit:"DI" },
  { key:"bolting",       label:"Bolting",          unit:"DI" },
  { key:"support",       label:"Support",          unit:"kg" },
  { key:"spoolErection", label:"Spool Erection",   unit:"QTY" },
  { key:"hydroTpQty",    label:"Hydrotest TP",     unit:"QTY" },
  { key:"hydroTpDi",     label:"Hydrotest TP",     unit:"DI" },
  { key:"reinstTpQty",   label:"Reinstatement TP", unit:"QTY" },
  { key:"reinstTpDi",    label:"Reinstatement TP", unit:"DI" },
];
const blankMetrics = () => Object.fromEntries(TARGET_METRICS.map(m => [m.key, ""]));
const metricNum = (r, key) => { const n = parseFloat(r[key]); return isNaN(n) ? 0 : n; };

/* ─────────── Empty form factories ─────────── */
const emptyForm   = (sup="", groups) => ({ date:todayStr(), supervisor:sup, area:"", subArea:"", man:blankMan(groups), jobDescription:"" });
const emptyTarget = (sup="") => ({ date:todayStr(), supervisor:sup, area:"", ...blankMetrics() });
const emptyWeekly = () => ({ week:"", area:"", plan:blankMetrics(), actual:blankMetrics() });
const emptyEng    = () => ({ date:todayStr(), area:"", subArea:"", description:"", photos:[] });
const emptyPunch  = (raisedBy="") => ({ date:todayStr(), punchType:"MPL", punchNo:"", area:"", subArea:"", remarks:"", raisedBy });

/* ─────────── CSV ─────────── */
function downloadCSV(rows, head, mapRow, name){
  const lines = [head.join(","), ...rows.map(r => mapRow(r).map(c=>`"${String(c??"").replace(/"/g,'""')}"`).join(","))];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type:"text/csv" }));
  a.download = `${name}_${todayStr()}.csv`; a.click();
}

/* ═══════════════════ i18n (TR / EN) ═══════════════════ */
let LANG = "tr";
try { const _l = localStorage.getItem("siteapp_lang"); if(_l === "tr" || _l === "en") LANG = _l; } catch(e){}
const STR_TR = {
  "Sign in":"Giriş", "Select your name and enter your password.":"Adınızı seçin ve şifrenizi girin.",
  "Name":"Ad", "Password":"Şifre", "Enter your password":"Şifrenizi girin", "Sign in →":"Giriş →",
  "— Select —":"— Seçin —",
  "Please select your name.":"Lütfen adınızı seçin.", "Incorrect password.":"Hatalı şifre.",
  "Loading site data…":"Saha verileri yükleniyor…",
  "Report":"Rapor", "Target":"Hedef", "Issues":"Konular", "Summary":"Özet", "Chat":"Sohbet",
  "Administrator":"Yönetici", "Guest · view only":"Misafir · sadece görüntüleme", "Site Supervisor":"Saha Şefi",
  "Records & exports":"Kayıtlar & dışa aktarma", "Sign out":"Çıkış yap",
  "Daily Report":"Günlük Rapor", "Log manpower per area for":"Şu tarih için alan bazında işçilik:",
  "Submit all":"Tümünü gönder", "＋ Add area entry":"＋ Alan kaydı ekle",
  "Date":"Tarih", "Supervisor":"Şef", "Area":"Alan", "Sub-Area":"Alt-Alan",
  "Type or pick a sub-area…":"Yazın veya alt-alan seçin…", "Select an area first":"Önce alan seçin",
  "Type or pick…":"Yazın veya seçin…", "Select area first":"Önce alan seçin",
  "Manpower":"İşçilik", "Total manpower":"Toplam işçilik", "Job Description":"İş Tanımı",
  "Describe work performed in this area / sub-area…":"Bu alanda/alt-alanda yapılan işi açıklayın…",
  "Add this entry":"Bu kaydı ekle",
  "Set Targets":"Hedef Belirle", "Welding, fit-up & TP targets per area.":"Alan bazında kaynak, fit-up & TP hedefleri.",
  "Daily Target":"Günlük Hedef", "Weekly Target":"Haftalık Hedef", "New weekly target":"Yeni haftalık hedef",
  "Week No":"Hafta No", "Plan vs Actual":"Plan / Gerçekleşen", "Plan":"Plan", "Actual":"Gerçek", "Metric":"Kalem",
  "Save weekly target":"Haftalık hedefi kaydet", "Weekly target saved":"Haftalık hedef kaydedildi",
  "Weeks":"Haftalar", "Week":"Hafta", "Enter a week number.":"Hafta numarası girin.",
  "Weekly targets are under the Weekly tab.":"Haftalık hedefler Haftalık sekmesinde.",
  "Updated":"Güncellendi", "updated":"güncellendi",
  "targets submitted":"hedef gönderildi", "Enter at least one target value.":"En az bir hedef değeri girin.",
  "Please fill Date, Supervisor and Area.":"Tarih, Şef ve Alan girin.", "Areas":"Alan",
  "Fit-Up":"Fit-Up", "Welding":"Kaynak", "Bolting":"Cıvatalama", "Support":"Destek",
  "Spool Erection":"Spool Montaj", "Hydrotest TP":"Hidrotest TP", "Reinstatement TP":"Reinstatement TP",
  "Area target":"Alan hedefi", "Targets for this area":"Bu alan için hedefler",
  "Welding ″":"Kaynak ″", "Fit-Up ″":"Fit-Up ″", "TP No.":"TP No.", "Add target":"Hedef ekle",
  "Engineering":"Mühendislik", "Log NCRs, RFIs, holds & site problems.":"NCR, RFI, hold ve saha sorunlarını kaydedin.",
  "Log a problem":"Sorun kaydet", "Problem Description":"Sorun Açıklaması",
  "Describe the engineering issue, NCR, design query, hold point…":"Mühendislik sorununu, NCR, tasarım sorgusunu, hold noktasını açıklayın…",
  "Photos":"Fotoğraflar", "Add photo(s)":"Fotoğraf ekle", "Add this issue":"Bu konuyu ekle",
  "All issues":"Tüm konular", "all":"tümü", "open":"açık", "resolved":"çözüldü",
  "Summary":"Özet", "Today":"Bugün", "👷 Manpower":"👷 İşçilik", "🎯 Area Targets":"🎯 Alan Hedefleri",
  "⚠️ Engineering":"⚠️ Mühendislik", "By trade":"Mesleğe göre", "Direct":"Direkt", "Indirect":"Endirekt",
  "Support":"Destek", "Total MP":"Toplam İŞ", "Total":"Toplam", "Open":"Açık", "Logged":"Kaydedilen",
  "No manpower data for this date.":"Bu tarih için işçilik verisi yok.",
  "No issues logged on this date.":"Bu tarihte kayıtlı konu yok.", "Reports":"Raporlar",
  "Records":"Kayıtlar", "Admin · all submitted data & exports.":"Yönetici · tüm gönderilen veriler & dışa aktarma.",
  "Filters":"Filtreler", "Clear filters":"Filtreleri temizle", "All":"Tümü",
  "⚙ Manage":"⚙ Yönetim", "Targets":"Hedefler",
  "Administration":"Yönetim", "Manage team, areas & roles":"Takım, alanlar & roller yönetimi",
  "Add":"Ekle", "Delete":"Sil", "Role name":"Rol adı",
  "already exists":"zaten var", "not found":"bulunamadı", "added":"eklendi", "removed":"silindi",
  "Enter an area":"Bir alan girin", "Enter a role name":"Bir rol adı girin",
  "Add or remove one Area + Sub-Area at a time. Full list lives in the Google Sheet.":"Tek tek Alan + Alt-Alan ekle/sil. Tam liste Google Sheet'te.",
  "Add or remove one role at a time. Pick a group, type the role.":"Tek tek rol ekle/sil. Grup seç, rol yaz.",
  "No internet — not saved":"İnternet yok — kaydedilemedi",
  "No internet — changes won\u2019t be saved":"İnternet yok — değişiklikler kaydedilmez",
  "Punch":"Punch", "Punch Closure":"Punch Takibi", "Raise & track punch items (MPL / CPL).":"Punch kaydet & takip et (MPL / CPL).",
  "Raise a punch":"Punch kaydet", "Punch Number":"Punch No", "Remarks":"Açıklama",
  "Description / note about this punch…":"Bu punch ile ilgili açıklama / not…",
  "Add punch":"Punch ekle", "punch saved":"punch kaydedildi", "All punches":"Tüm punchlar",
  "No punches":"Punch yok", "Closed":"Kapalı", "Mark closed":"Kapalı işaretle",
  "Raised by":"Kaydeden", "Enter date and punch number":"Tarih ve punch no girin",
  "Scan to open the app":"Uygulamayı açmak için tarat",
  "Punch list status & closure tracking.":"Punch listesi durumu & kapanış takibi.",
  "Category":"Kategori", "Subsystem":"Subsystem", "Discipline":"Disiplin", "Raised":"Açan",
  "Update":"Güncelle", "Field remarks…":"Saha açıklaması…",
  "No punch list yet. Admin pastes it into the Punch sheet.":"Henüz punch listesi yok. Admin Punch sayfasına yapıştırır.",
  "Search code, description, subsystem…":"Kod, açıklama, subsystem ara…",
  "Status":"Durum", "Add photo":"Fotoğraf ekle", "Change photo":"Fotoğrafı değiştir", "Save":"Kaydet", "Show more":"Daha fazla göster", "Cancel":"İptal",
  "Team chat":"Takım sohbeti", "members":"üye",
  "No messages yet. Say hello! 👋":"Henüz mesaj yok. Merhaba deyin! 👋", "Loading messages…":"Mesajlar yükleniyor…",
  "Type a message…":"Mesaj yazın…",
  "Manpower roles":"İşçilik rolleri", "Team · supervisors":"Takım · şefler",
  "Areas & sub-areas":"Alanlar & alt-alanlar", "Project identity":"Proje kimliği",
  "Resolved":"Çözüldü", "Reopen":"Yeniden aç", "Mark resolved":"Çözüldü işaretle",
};
function t(x){ return LANG === "tr" ? (STR_TR[x] != null ? STR_TR[x] : x) : x; }
const TPL = {
  submitToRecords: { en:"Submit {n} to records", tr:"{n} kaydı gönder" },
  submitTargets:   { en:"Submit {n} targets",    tr:"{n} hedef gönder" },
  submitIssues:    { en:"Submit {n} issues",     tr:"{n} konu gönder" },
  myEntriesToday:  { en:"My entries today ({n})", tr:"Bugünkü kayıtlarım ({n})" },
  openPending:     { en:"{n} open issue(s) pending resolution", tr:"{n} açık konu çözüm bekliyor" },
};
function tn(key, n){ const o = TPL[key]; return (LANG === "tr" ? o.tr : o.en).split("{n}").join(n); }
const natCmp = (a, b) => String(a).localeCompare(String(b), undefined, { numeric:true, sensitivity:"base" });
const sortSubs = (arr) => [...(arr || [])].sort(natCmp);
/* Normalize any date value (ISO string, Date, serial) to clean YYYY-MM-DD */
function dOnly(v){
  if(v === null || v === undefined || v === "") return "";
  if(typeof v === "string") return v.length >= 10 && v[4] === "-" ? v.slice(0,10) : v;
  try{ const d = new Date(v); if(!isNaN(d.getTime())) return d.toISOString().slice(0,10); }catch(e){}
  return String(v);
}


/* ═══════════════════ UI COMPONENTS ═══════════════════ */
/* ---- Inline SVG icon set (stroke, 24px) ---- */
const ICONS = {
  report:'<path d="M9 3h6a2 2 0 0 1 2 2v0H7v0a2 2 0 0 1 2-2Z"/><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 11h6M9 15h4"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  eng:'<path d="M10.3 3.3a2 2 0 0 1 3.4 0l7 12.1a2 2 0 0 1-1.7 3H5a2 2 0 0 1-1.7-3Z"/><path d="M12 9v4M12 17h.01"/>',
  summary:'<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z"/>',
  records:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5M15 12H3"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H7a1.6 1.6 0 0 0 1-1.5V1a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V7a1.6 1.6 0 0 0 1.5 1H23a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  camera:'<path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4Z"/><circle cx="12" cy="13" r="4"/>',
  trash:'<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  send:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/>',
  download:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  filter:'<path d="M3 5h18M6 12h12M10 19h4"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
  reopen:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.2-8.2M16 5l3 3M18 7l2-2"/>',
  flame:'<path d="M12 2s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s0 2 2 2c0-3 2-5 2-8Z"/>',
};

function Icon({ name, size=22, stroke=2, color="currentColor", style }){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={style} dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }} />
  );
}

function Avatar({ name, size=34 }){
  return (
    <div className="avatar" style={{ width:size, height:size, fontSize:size*0.42, background:colorFor(name) }}>
      {(name||"?")[0]}
    </div>
  );
}

function Stat({ label, value, tone }){
  return (
    <div className={"stat" + (tone ? " "+tone : "")}>
      <div className="sv tnum">{value}</div>
      <div className="sl">{label}</div>
    </div>
  );
}

function Lightbox({ src, onClose }){
  if(!src) return null;
  return (
    <div className="lightbox" onClick={onClose}>
      <img src={src} alt="" />
      <button className="lx-close" onClick={onClose}><Icon name="x" size={20} /></button>
    </div>
  );
}

function EngCard({ issue, onToggle, isAdmin }){
  const [lb, setLb] = useState(null);
  const res = issue.status === "resolved";
  return (
    <div className={"eng " + (res ? "resolved" : "open")}>
      <div className="eng-meta">
        <span className="eng-date">{issue.date}</span>
        <span className="chip area">{issue.area}</span>
        {issue.subArea && issue.subArea !== "-" &&
          <span style={{ fontSize:11, color:"var(--text-3)" }}>↳ {issue.subArea}</span>}
        <span className={"pill " + (res ? "resolved" : "open")}>
          {res ? "✓ Resolved" : "● Open"}
        </span>
        <span className="eng-id tnum">#{issue.id}</span>
      </div>
      <div className="eng-desc">{issue.description}</div>
      {res && issue.resolvedAt &&
        <div className="resolved-stamp">
          <Icon name="check" size={15} /> Resolved · {issue.resolvedAt}
        </div>}
      {Array.isArray(issue.photos) && issue.photos.length > 0 &&
        <div className="eng-photos">
          {issue.photos.map((ph,i) => <img key={i} src={ph} onClick={()=>setLb(ph)} alt="" />)}
        </div>}
      {onToggle && isAdmin &&
        <button className={"btn btn-sm " + (res ? "btn-ghost" : "btn-success")}
          style={{ marginTop:12 }} onClick={()=>onToggle(issue.id)}>
          {res ? <><Icon name="reopen" size={14} /> Reopen</> : <><Icon name="check" size={14} /> Mark resolved</>}
        </button>}
      <Lightbox src={lb} onClose={()=>setLb(null)} />
    </div>
  );
}

function TopBar({ session, project, openCount, onProfile, onRecords, onBell, onAbout, lang, onLang }){
  return (
    <div className="topbar">
      <button className="brand-mark" onClick={onAbout} title="SECOSYS" style={{ border:"none", cursor:"pointer", padding:0 }}><Icon name="flame" size={20} /></button>
      <div className="t-titles">
        <span className="t-title" style={{fontSize:21, fontWeight:900, letterSpacing:"-.02em"}}>{project.name}</span>
        <span className="t-kicker" style={{marginTop:1, fontSize:9}}>{project.kicker}</span>
      </div>
      <div className="t-actions">
        <button className="iconbtn lang-toggle" onClick={onLang} title="Language">{lang === "tr" ? "TR" : "EN"}</button>
        <button className="iconbtn" onClick={onBell}>
          <Icon name="bell" size={19} />
          {openCount > 0 && <span className="dot">{openCount}</span>}
        </button>
        {session.isAdmin &&
          <button className="iconbtn" onClick={onRecords}><Icon name="records" size={19} /></button>}
        <button className="iconbtn" style={{ padding:0, overflow:"hidden" }} onClick={onProfile}>
          <Avatar name={session.name} size={40} />
        </button>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab, items }){
  return (
    <nav className="bottomnav">
      {items.map(it => (
        <button key={it.id} className={"navitem" + (tab===it.id ? " active" : "")}
          onClick={()=>setTab(it.id)}>
          <span className="ni-ico"><Icon name={it.icon} size={23} stroke={tab===it.id?2.4:2} /></span>
          {it.label}
          {it.badge > 0 && <span className="ni-badge">{it.badge}</span>}
        </button>
      ))}
    </nav>
  );
}

function Sheet({ children, onClose }){
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="grip" />
        {children}
      </div>
    </div>
  );
}

function Flash({ msg }){
  if(!msg) return null;
  return <div className="flash"><Icon name="check" size={18} /> {msg}</div>;
}

/* Type-ahead combobox with free entry (sub-areas) */
function Combobox({ value, onChange, options=[], placeholder, disabled }){
  const [open, setOpen] = useState(false);
  const wrapRef = useRef();
  useEffect(() => {
    const h = e => { if(wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const q = (value || "").trim().toLowerCase();
  const exact = options.some(o => o.toLowerCase() === q && q);
  const matches = q ? options.filter(o => o.toLowerCase().includes(q) && o.toLowerCase() !== q) : options;
  const CAP = 200;
  const shown = matches.slice(0, CAP);

  // bold the matched fragment
  const hi = (text) => {
    const i = text.toLowerCase().indexOf(q);
    if(i < 0 || !q) return text;
    return (<>{text.slice(0,i)}<b style={{ color:"var(--primary)" }}>{text.slice(i,i+q.length)}</b>{text.slice(i+q.length)}</>);
  };

  const showList = open && !disabled && (q ? true : options.length > 0);
  return (
    <div className="cmb" ref={wrapRef}>
      <input className="input" value={value} disabled={disabled}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder} autoComplete="off" />
      {showList && (
        <div className="cmb-list">
          {!q && options.length > 0 && (
            <div className="cmb-hint">{options.length} {t("Sub-Area")} · {LANG==="tr"?"seçin veya yazıp filtreleyin":"pick or type to filter"}</div>
          )}
          {q && shown.length === 0 && !exact && (
            <div className="cmb-hint">No match — keep typing to add a new one</div>
          )}
          {shown.map(o => (
            <div key={o} className="cmb-item" onMouseDown={() => { onChange(o); setOpen(false); }}>{hi(o)}</div>
          ))}
          {matches.length > CAP && (
            <div className="cmb-hint">+{matches.length - CAP} more — type more to narrow</div>
          )}
          {q && !exact && (
            <div className="cmb-item cmb-new" onMouseDown={() => setOpen(false)}>
              <Icon name="plus" size={13} /> Use “{value}” &nbsp;<span style={{ color:"var(--text-3)", fontWeight:500 }}>· new, will be saved</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════ SCREENS ═══════════════════ */
/* ════════════════════ REPORT ════════════════════ */
function ReportScreen({ session, reports, supervisors, areas, subAreas, roleGroups, onAddSubArea, onSubmit, onDelete, showFlash }){
  const [form, setForm] = useState(emptyForm(session.name, roleGroups));
  const [staged, setStaged] = useState([]);
  const [err, setErr] = useState("");
  const grp = Object.fromEntries(roleGroups.map(g => [g.id, g.roles.reduce((s,r)=>s+(parseInt(form.man[r.key])||0),0)]));
  const total = roleGroups.reduce((s,g)=>s+grp[g.id],0);

  const sf = (k,v) => setForm(p => ({ ...p, [k]:v }));
  const sm = (key,v) => setForm(p => ({ ...p, man:{ ...p.man, [key]:v } }));
  const add = () => {
    const { date, supervisor, area, jobDescription } = form;
    if(!date || !supervisor || !area || !jobDescription){
      setErr("Please fill Date, Supervisor, Area and Job Description."); return;
    }
    if(total <= 0){ setErr("Enter at least one worker in the manpower table."); return; }
    setErr("");
    if(form.subArea && form.area && !(subAreas[form.area]||[]).includes(form.subArea)) onAddSubArea(form.area, form.subArea);
    const roleCounts = Object.fromEntries(allRoles(roleGroups).map(r => [r.key, parseInt(form.man[r.key])||0]));
    setStaged(p => [...p, {
      id:makeId("R"), date, supervisor, area, subArea:form.subArea||"-",
      ...roleCounts,
      directTotal:grp.direct, indirectTotal:grp.indirect, supportTotal:grp.support,
      totalManpower:total, jobDescription
    }]);
    setForm(p => ({ ...p, area:"", subArea:"", man:blankMan(roleGroups), jobDescription:"" }));
  };
  const submit = () => {
    if(!staged.length) return;
    if(typeof navigator !== "undefined" && !navigator.onLine){ showFlash("⚠ " + t("No internet — not saved")); return; }
    onSubmit(staged.map(e => ({ ...e, submittedAt:fmtForSheet() })));
    setStaged([]);
    showFlash(`${staged.length} ${staged.length===1?"entry":"entries"} submitted to records`);
  };

  const myToday = reports.filter(r => r.supervisor===session.name && r.date===todayStr());
  const sumOf = k => staged.reduce((s,e)=>s+(e[k]||0),0);

  return (
    <div>
      <h1 className="page-title">{t("Daily Report")}</h1>
      <p className="page-sub">{t("Log manpower per area for")} {form.date}.</p>

      {staged.length > 0 && (
        <div className="pending">
          <div className="ph">
            <span className="ph-label">⏳ Pending <span className="count-pill" style={{background:"var(--accent)"}}>{staged.length}</span></span>
            <button className="btn btn-success btn-sm" onClick={submit}><Icon name="check" size={14}/> {t("Submit all")}</button>
          </div>
          {staged.map(e => (
            <div className="staged-row" key={e.id}>
              <Avatar name={e.supervisor} size={30} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap" }}>
                  <span className="chip area">{e.area}</span>
                  {e.subArea!=="-" && <span style={{fontSize:11,color:"var(--text-3)"}}>{e.subArea}</span>}
                  <span style={{fontSize:12,color:"var(--text-2)"}}>D {e.directTotal} · I {e.indirectTotal} · S {e.supportTotal} · <strong style={{color:"var(--accent)"}}>{e.totalManpower}</strong></span>
                </div>
              </div>
              <button className="x" onClick={()=>setStaged(p=>p.filter(x=>x.id!==e.id))}><Icon name="x" size={13}/></button>
            </div>
          ))}
          <div style={{ display:"flex", gap:16, marginTop:12, paddingTop:11, borderTop:"1px solid var(--border)", fontSize:12, color:"var(--text-2)" }}>
            <span>Direct <strong className="tnum" style={{color:"var(--text)"}}>{sumOf("directTotal")}</strong></span>
            <span>Indirect <strong className="tnum" style={{color:"var(--text)"}}>{sumOf("indirectTotal")}</strong></span>
            <span>Support <strong className="tnum" style={{color:"var(--text)"}}>{sumOf("supportTotal")}</strong></span>
            <span>Total <strong className="tnum" style={{color:"var(--accent)"}}>{sumOf("totalManpower")}</strong></span>
          </div>
        </div>
      )}

      <div className="card pad">
        <div className="section-head"><span className="bar"/><span className="st">{t("＋ Add area entry")}</span></div>
        {err && <div className="alert">{err}</div>}

        <div className="field">
          <label className="label">{t("Date")} <span className="req">*</span></label>
          <input type="date" className="input" value={form.date} onChange={e=>sf("date",e.target.value)} />
        </div>

        <div className="grid-2">
          <div className="field">
            <label className="label">{t("Supervisor")} <span className="req">*</span></label>
            {session.isAdmin
              ? <select className="select" value={form.supervisor} onChange={e=>sf("supervisor",e.target.value)}>
                  <option value="">{t("— Select —")}</option>
                  {supervisors.map(s=><option key={s}>{s}</option>)}
                </select>
              : <div className="locked-field">
                  <Avatar name={session.name} size={24} />
                  <strong style={{fontSize:14}}>{session.name}</strong>
                  <span className="lk"><Icon name="lock" size={11}/> locked</span>
                </div>}
          </div>
          <div className="field">
            <label className="label">{t("Area")} <span className="req">*</span></label>
            <select className="select" value={form.area} onChange={e=>setForm(p=>({ ...p, area:e.target.value, subArea:"" }))}>
              <option value="">{t("— Select —")}</option>
              {areas.map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="label">{t("Sub-Area")}</label>
          <Combobox value={form.subArea} onChange={v=>sf("subArea",v)}
            options={sortSubs(subAreas[form.area])} disabled={!form.area}
            placeholder={form.area ? t("Type or pick a sub-area…") : t("Select an area first")} />
        </div>

        <div className="subpanel">
          <div className="sp-title"><Icon name="user" size={14}/> {t("Manpower")} <span className="req">*</span></div>
          <div className="man-table">
            {roleGroups.map(g => (
              <div className="man-group" key={g.id}>
                <div className="man-ghead">
                  <span className={"man-gtag " + g.id}>{g.label}</span>
                  <span className="man-gsub tnum">{grp[g.id]}</span>
                </div>
                {g.roles.map(role => {
                  const v = form.man[role.key];
                  const on = (parseInt(v)||0) > 0;
                  return (
                    <div className={"man-row" + (on ? " on" : "")} key={role.key}>
                      <span className="man-rl">{role.label}</span>
                      <input type="number" min="0" inputMode="numeric" className="man-inp tnum"
                        value={v} onChange={e=>sm(role.key, e.target.value)} placeholder="0" />
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="man-grand">
              <span>{t("Total manpower")}</span>
              <span className="tnum">{total}</span>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">{t("Job Description")} <span className="req">*</span></label>
          <textarea className="textarea" rows={4} value={form.jobDescription} onChange={e=>sf("jobDescription",e.target.value)} placeholder={t("Describe work performed in this area / sub-area…")} />
        </div>

        <button className="btn btn-outline btn-block" onClick={add}><Icon name="plus" size={16}/> {t("Add this entry")}</button>
        {staged.length > 0 &&
          <button className="btn btn-success btn-block" onClick={submit}><Icon name="check" size={16}/> {tn("submitToRecords", staged.length)}</button>}
      </div>

      {myToday.length > 0 && (
        <div className="card pad" style={{ marginTop:14 }}>
          <div className="section-head"><span className="bar"/><span className="st">{tn("myEntriesToday", myToday.length)}</span></div>
          {myToday.map(r => (
            <div className="staged-row" key={r.id}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap", marginBottom:3 }}>
                  <span className="chip area">{r.area}</span>
                  {r.subArea!=="-" && <span style={{fontSize:11,color:"var(--text-3)"}}>{r.subArea}</span>}
                  <span style={{fontSize:12,color:"var(--text-2)"}}>{manStats(r, roleGroups).total>0 && <>MP <strong style={{color:"var(--accent)"}}>{manStats(r, roleGroups).total}</strong></>}</span>
                </div>
                <div style={{ fontSize:12, color:"var(--text-3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.jobDescription}</div>
              </div>
              <button className="x" onClick={()=>onDelete(r.id)}><Icon name="trash" size={13}/></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════ TARGET ════════════════════ */
function MetricGrid({ values, onChange, color }){
  return (
    <div className="metric-grid">
      {TARGET_METRICS.map(m => (
        <div className="metric-cell" key={m.key}>
          <label className="metric-lbl">{t(m.label)} <span className="metric-unit">{m.unit}</span></label>
          <input type="number" min="0" step="0.1" inputMode="decimal" className="input"
            value={values[m.key]} onChange={e=>onChange(m.key, e.target.value)} placeholder="0" />
        </div>
      ))}
    </div>
  );
}

function TargetScreen({ session, reports, supervisors, areas, targets, weeklyTargets, roleGroups, onSubmit, onSubmitWeekly, showFlash }){
  const [mode, setMode] = useState("daily");

  /* ── Daily target ── */
  const [form, setForm] = useState(emptyTarget(session.name));
  const [staged, setStaged] = useState([]);
  const [err, setErr] = useState("");
  const st = (k,v) => setForm(p=>({ ...p, [k]:v }));
  const sm = (k,v) => setForm(p=>({ ...p, [k]:v }));

  const add = () => {
    if(!form.date || !form.supervisor || !form.area){ setErr(t("Please fill Date, Supervisor and Area.")); return; }
    if(TARGET_METRICS.every(m => !String(form[m.key]).trim())){ setErr(t("Enter at least one target value.")); return; }
    setErr("");
    setStaged(p => [...p, { id:makeId("T"), ...form }]);
    setForm(p => ({ ...p, area:"", ...blankMetrics() }));
  };
  const submit = () => {
    if(!staged.length) return;
    if(typeof navigator !== "undefined" && !navigator.onLine){ showFlash("⚠ " + t("No internet — not saved")); return; }
    onSubmit(staged.map(e=>({ ...e, submittedAt:fmtForSheet() })));
    setStaged([]);
    showFlash(`${staged.length} ${t("targets submitted")}`);
  };

  const areaReports = form.area ? reports.filter(r=>r.date===form.date && r.area===form.area) : [];
  const aDir = areaReports.reduce((s,r)=>s+manStats(r, roleGroups).direct,0);
  const aTot = areaReports.reduce((s,r)=>s+manStats(r, roleGroups).total,0);
  const aSup = [...new Set(areaReports.map(r=>r.supervisor))].join(", ") || "—";

  /* ── Weekly target ── */
  const [wform, setWform] = useState(emptyWeekly());
  const [werr, setWerr] = useState("");
  const [openWeek, setOpenWeek] = useState(null);
  const setWplan = (k,v) => setWform(p=>({ ...p, plan:{ ...p.plan, [k]:v } }));
  const setWactual = (k,v) => setWform(p=>({ ...p, actual:{ ...p.actual, [k]:v } }));

  const wsubmit = () => {
    if(!wform.week){ setWerr(t("Enter a week number.")); return; }
    if(typeof navigator !== "undefined" && !navigator.onLine){ showFlash("⚠ " + t("No internet — not saved")); return; }
    setWerr("");
    const row = { id:makeId("W"), week:String(wform.week), area:wform.area||"-" };
    TARGET_METRICS.forEach(m => { row[m.key+"_plan"] = wform.plan[m.key]||""; row[m.key+"_actual"] = wform.actual[m.key]||""; });
    row.submittedAt = fmtForSheet();
    onSubmitWeekly(row);
    setWform(emptyWeekly());
    showFlash(t("Weekly target saved"));
  };

  /* group weekly rows by week (newest first) */
  const weekMap = {};
  (weeklyTargets||[]).forEach(r => { const w = String(r.week); if(!weekMap[w]) weekMap[w] = []; weekMap[w].push(r); });
  const weekKeys = Object.keys(weekMap).sort((a,b)=>String(b).localeCompare(String(a), undefined, { numeric:true }));

  return (
    <div>
      <h1 className="page-title">{t("Targets")}</h1>

      <div className="segmented" style={{ display:"flex", width:"100%", marginBottom:16 }}>
        <button className={mode==="daily"?"on":""} style={{ flex:1 }} onClick={()=>setMode("daily")}>{t("Daily Target")}</button>
        <button className={mode==="weekly"?"on":""} style={{ flex:1 }} onClick={()=>setMode("weekly")}>{t("Weekly Target")}</button>
      </div>

      {mode==="daily" && session.isGuest && (
        <div className="empty"><div className="ee">📅</div>{t("Weekly targets are under the Weekly tab.")}</div>
      )}
      {mode==="daily" && !session.isGuest && <>
      {staged.length > 0 && (
        <div className="pending" style={{ borderColor:"var(--info)" }}>
          <div className="ph">
            <span className="ph-label" style={{ color:"var(--info)" }}>⏳ Pending <span className="count-pill" style={{background:"var(--info)"}}>{staged.length}</span></span>
            <button className="btn btn-success btn-sm" onClick={submit}><Icon name="check" size={14}/> {t("Submit all")}</button>
          </div>
          {staged.map(e => {
            const filled = TARGET_METRICS.filter(m => String(e[m.key]).trim() && parseFloat(e[m.key])>0);
            return (
              <div className="staged-row" key={e.id}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <span className="chip area">{e.area}</span>
                    <span style={{fontSize:11.5,color:"var(--text-2)"}}>{filled.map(m=>m.label+" "+e[m.key]+(m.unit==="DI"?"″":"")).join(" · ") || "—"}</span>
                  </div>
                </div>
                <button className="x" onClick={()=>setStaged(p=>p.filter(x=>x.id!==e.id))}><Icon name="x" size={13}/></button>
              </div>
            );
          })}
        </div>
      )}

      <div className="card pad">
        <div className="section-head"><span className="bar" style={{background:"var(--info)"}}/><span className="st" style={{color:"var(--info)"}}>{t("Area target")}</span></div>
        {err && <div className="alert">{err}</div>}

        <div className="field">
          <label className="label">{t("Date")} <span className="req">*</span></label>
          <input type="date" className="input" value={form.date} onChange={e=>st("date",e.target.value)} />
        </div>
        <div className="grid-2">
          <div className="field">
            <label className="label">{t("Supervisor")} <span className="req">*</span></label>
            {session.isAdmin
              ? <select className="select" value={form.supervisor} onChange={e=>st("supervisor",e.target.value)}>
                  <option value="">{t("— Select —")}</option>{supervisors.map(s=><option key={s}>{s}</option>)}
                </select>
              : <div className="locked-field"><Avatar name={session.name} size={24}/><strong style={{fontSize:14}}>{session.name}</strong><span className="lk"><Icon name="lock" size={11}/> locked</span></div>}
          </div>
          <div className="field">
            <label className="label">{t("Area")} <span className="req">*</span></label>
            <select className="select" value={form.area} onChange={e=>st("area",e.target.value)}>
              <option value="">{t("— Select —")}</option>{areas.map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {form.area && (
          <div className="subpanel" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, textAlign:"center" }}>
            <div><div className="sl" style={{fontSize:9.5,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:".06em"}}>Direct</div><div className="tnum" style={{fontSize:22,fontWeight:800,color:"var(--accent)"}}>{aDir||"—"}</div></div>
            <div><div className="sl" style={{fontSize:9.5,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:".06em"}}>Total MP</div><div className="tnum" style={{fontSize:22,fontWeight:800,color:"var(--accent)"}}>{aTot||"—"}</div></div>
            <div><div className="sl" style={{fontSize:9.5,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:".06em"}}>Supervisor</div><div style={{fontSize:13,fontWeight:700,marginTop:4}}>{aSup}</div></div>
          </div>
        )}

        <div className="subpanel">
          <div className="sp-title" style={{color:"var(--info)"}}><Icon name="target" size={14}/> {t("Targets for this area")}</div>
          <MetricGrid values={form} onChange={sm} />
        </div>

        <button className="btn btn-outline btn-block" style={{ color:"var(--info)", borderColor:"var(--info)" }} onClick={add}><Icon name="plus" size={16}/> {t("Add target")}</button>
        {staged.length > 0 && <button className="btn btn-success btn-block" onClick={submit}><Icon name="check" size={16}/> {tn("submitTargets", staged.length)}</button>}
      </div>
      </>}

      {mode==="weekly" && <>
      {!session.isGuest &&
      <div className="card pad">
        <div className="section-head"><span className="bar" style={{background:"var(--primary)"}}/><span className="st" style={{color:"var(--primary)"}}><Icon name="calendar" size={13} style={{verticalAlign:"-2px"}}/> {t("New weekly target")}</span></div>
        {werr && <div className="alert">{werr}</div>}
        <div className="grid-2">
          <div className="field">
            <label className="label">{t("Week No")} <span className="req">*</span></label>
            <input className="input" value={wform.week} onChange={e=>setWform(p=>({ ...p, week:e.target.value }))} placeholder="W-25" />
          </div>
          <div className="field">
            <label className="label">{t("Area")}</label>
            <select className="select" value={wform.area} onChange={e=>setWform(p=>({ ...p, area:e.target.value }))}>
              <option value="">{t("All")}</option>{areas.map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="subpanel" style={{ marginBottom:0 }}>
          <div className="sp-title" style={{color:"var(--primary)"}}>{t("Plan vs Actual")}</div>
          <div className="wk-head"><span>{t("Metric")}</span><span>{t("Plan")}</span><span>{t("Actual")}</span></div>
          {TARGET_METRICS.map(m => (
            <div className="wk-row" key={m.key}>
              <span className="wk-metric">{t(m.label)} <span className="metric-unit">{m.unit}</span></span>
              <input type="number" min="0" step="0.1" inputMode="decimal" className="input wk-in" value={wform.plan[m.key]} onChange={e=>setWplan(m.key, e.target.value)} placeholder="0" />
              <input type="number" min="0" step="0.1" inputMode="decimal" className="input wk-in" value={wform.actual[m.key]} onChange={e=>setWactual(m.key, e.target.value)} placeholder="0" />
            </div>
          ))}
        </div>
        <button className="btn btn-primary btn-block" style={{ marginTop:14 }} onClick={wsubmit}><Icon name="check" size={16}/> {t("Save weekly target")}</button>
      </div>
      }

      {weekKeys.length > 0 && (
        <div style={{ marginTop:18 }}>
          <div className="st" style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--text-2)", marginBottom:12 }}>{t("Weeks")}</div>
          {weekKeys.map(w => {
            const rows = weekMap[w];
            const isOpen = openWeek === w;
            return (
              <div className="card" key={w} style={{ marginBottom:10, overflow:"hidden" }}>
                <button className="wk-toggle" onClick={()=>setOpenWeek(isOpen?null:w)}>
                  <span className="chip" style={{ background:"var(--primary-soft)", color:"var(--primary)", borderColor:"transparent", fontWeight:700 }}>{t("Week")} {w}</span>
                  <span style={{ fontSize:12, color:"var(--text-3)" }}>{rows.length} {rows.length===1?t("Area"):t("Areas")}</span>
                  <Icon name="summary" size={16} style={{ marginLeft:"auto", transform:isOpen?"rotate(180deg)":"none", transition:".2s", opacity:.5 }} />
                </button>
                {isOpen && rows.map(r => (
                  <div key={r.id} style={{ padding:"0 14px 12px" }}>
                    {r.area && r.area !== "-" && <div style={{ fontSize:12, fontWeight:700, color:"var(--text-2)", margin:"6px 0 8px" }}>{r.area}</div>}
                    <div className="tbl-wrap">
                      <table className="tbl">
                        <thead><tr><th>{t("Metric")}</th><th className="num">{t("Plan")}</th><th className="num">{t("Actual")}</th><th className="num">%</th></tr></thead>
                        <tbody>
                          {TARGET_METRICS.map(m => {
                            const pl = metricNum(r, m.key+"_plan"), ac = metricNum(r, m.key+"_actual");
                            if(pl===0 && ac===0) return null;
                            const pct = pl>0 ? Math.round(ac/pl*100) : 0;
                            return (
                              <tr key={m.key}>
                                <td style={{ fontSize:12, whiteSpace:"normal" }}>{t(m.label)} <span className="metric-unit">{m.unit}</span></td>
                                <td className="num">{pl||"—"}</td>
                                <td className="num" style={{ fontWeight:700 }}>{ac||"—"}</td>
                                <td className="num" style={{ fontWeight:800, color: pct>=100?"var(--success)":pct>=70?"var(--warn)":"var(--danger)" }}>{pl>0?pct+"%":"—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
      </>}
    </div>
  );
}

/* ════════════════════ ENGINEERING ════════════════════ */
function EngScreen({ session, engIssues, areas, subAreas, onAddSubArea, onSubmit, onToggle, showFlash }){
  const [form, setForm] = useState(emptyEng());
  const [staged, setStaged] = useState([]);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("all");
  const fileRef = useRef();
  const se = (k,v) => setForm(p=>({ ...p, [k]:v }));

  const onPhoto = async e => {
    const files = Array.from(e.target.files);
    const dataUrls = await Promise.all(files.map(f => new Promise(res => {
      const r = new FileReader(); r.onload = ev => res(ev.target.result); r.readAsDataURL(f);
    })));
    setForm(p => ({ ...p, photos:[...(p.photos||[]), ...dataUrls] }));
    e.target.value = "";
  };
  const add = () => {
    if(!form.date || !form.area || !form.description){ setErr("Please fill in all required (*) fields."); return; }
    setErr("");
    if(form.subArea && form.area && !(subAreas[form.area]||[]).includes(form.subArea)) onAddSubArea(form.area, form.subArea);
    setStaged(p => [...p, { id:makeId("E"), date:form.date, area:form.area, subArea:form.subArea||"-",
      description:form.description, photos:form.photos||[], status:"open" }]);
    setForm(emptyEng());
  };
  const submit = () => {
    if(!staged.length) return;
    if(typeof navigator !== "undefined" && !navigator.onLine){ showFlash("⚠ " + t("No internet — not saved")); return; }
    onSubmit(staged.map(e=>({ ...e, submittedAt:fmtForSheet() })));
    setStaged([]);
    showFlash(`${staged.length} ${staged.length===1?"issue":"issues"} submitted`);
  };

  const openCount = engIssues.filter(e=>(e.status||"open")==="open").length;
  const list = engIssues.filter(e=>filter==="all"||(e.status||"open")===filter).slice().sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));

  return (
    <div>
      <h1 className="page-title">{t("Engineering")}</h1>
      <p className="page-sub">{t("Log NCRs, RFIs, holds & site problems.")}</p>

      {openCount > 0 && <div className="banner danger"><Icon name="eng" size={17}/> {tn("openPending", openCount)}</div>}

      {!session.isGuest && <>
      {staged.length > 0 && (
        <div className="pending" style={{ borderColor:"var(--info)" }}>
          <div className="ph">
            <span className="ph-label" style={{color:"var(--info)"}}>⏳ Pending <span className="count-pill" style={{background:"var(--info)"}}>{staged.length}</span></span>
            <button className="btn btn-success btn-sm" onClick={submit}><Icon name="check" size={14}/> {t("Submit all")}</button>
          </div>
          {staged.map(e => <EngCard key={e.id} issue={e} />)}
        </div>
      )}

      <div className="card pad">
        <div className="section-head"><span className="bar" style={{background:"var(--danger)"}}/><span className="st" style={{color:"var(--danger)"}}>{t("Log a problem")}</span></div>
        {err && <div className="alert">{err}</div>}

        <div className="field">
          <label className="label">{t("Date")} <span className="req">*</span></label>
          <input type="date" className="input" value={form.date} onChange={e=>se("date",e.target.value)} />
        </div>
        <div className="grid-2">
          <div className="field">
            <label className="label">{t("Area")} <span className="req">*</span></label>
            <select className="select" value={form.area} onChange={e=>setForm(p=>({ ...p, area:e.target.value, subArea:"" }))}>
              <option value="">{t("— Select —")}</option>{areas.map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">{t("Sub-Area")}</label>
            <Combobox value={form.subArea} onChange={v=>se("subArea",v)}
              options={sortSubs(subAreas[form.area])} disabled={!form.area}
              placeholder={form.area ? t("Type or pick…") : t("Select area first")} />
          </div>
        </div>
        <div className="field">
          <label className="label">{t("Problem Description")} <span className="req">*</span></label>
          <textarea className="textarea" rows={4} value={form.description} onChange={e=>se("description",e.target.value)} placeholder={t("Describe the engineering issue, NCR, design query, hold point…")} />
        </div>
        <div className="field">
          <label className="label">{t("Photos")}</label>
          <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" onChange={onPhoto} style={{ display:"none" }} />
          <button className="btn btn-ghost" onClick={()=>fileRef.current.click()}><Icon name="camera" size={16}/> {t("Add photo(s)")}</button>
          {form.photos && form.photos.length>0 &&
            <div className="eng-photos" style={{ marginTop:11 }}>
              {form.photos.map((ph,i) => (
                <div key={i} style={{ position:"relative" }}>
                  <img src={ph} style={{ width:64, height:64, objectFit:"cover", borderRadius:8, border:"1px solid var(--border)" }} alt="" />
                  <button onClick={()=>se("photos", form.photos.filter((_,j)=>j!==i))}
                    style={{ position:"absolute", top:-6, right:-6, width:20, height:20, borderRadius:"50%", background:"var(--danger)", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="x" size={11}/></button>
                </div>
              ))}
            </div>}
        </div>
        <button className="btn btn-outline btn-block" style={{ color:"var(--danger)", borderColor:"var(--danger)" }} onClick={add}><Icon name="plus" size={16}/> {t("Add this issue")}</button>
        {staged.length>0 && <button className="btn btn-success btn-block" onClick={submit}><Icon name="check" size={16}/> {tn("submitIssues", staged.length)}</button>}
      </div>
      </>}

      {engIssues.length > 0 && (
        <div style={{ marginTop:18 }}>
          <div style={{ display:"flex", alignItems:"center", marginBottom:12 }}>
            <span className="st" style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--text-2)" }}>All issues</span>
            <div className="segmented" style={{ marginLeft:"auto" }}>
              {["all","open","resolved"].map(f => (
                <button key={f} className={filter===f?"on":""} onClick={()=>setFilter(f)} style={{ textTransform:"capitalize" }}>{f}</button>
              ))}
            </div>
          </div>
          {list.length===0
            ? <div className="empty"><div className="ee">📭</div>No {filter} issues.</div>
            : list.map(e => <EngCard key={e.id} issue={e} onToggle={onToggle} isAdmin={session.isAdmin} />)}
        </div>
      )}
    </div>
  );
}



/* ════════════════════ PUNCH CLOSURE ════════════════════ */
/* Master list is pasted into the "Punch" sheet by admin (columns:
   Code, AREA, SUBSYSTEM, SS_DESCRIPTION, ELEMENT, DESCRIPTION, CATEGORY,
   DISCIPLINE, RAISED). The app adds two editable columns: Remarks, Status.
   Field supervisors fill Remarks + set Open/Closed; guests view only. */

const PF = (r, keys) => { for(const k of keys){ if(r[k] !== undefined && r[k] !== null && r[k] !== "") return String(r[k]); } return ""; };
function normPunch(r){
  return {
    code:       PF(r, ["Code","code","CODE"]),
    area:       PF(r, ["AREA","area","Area"]),
    subsystem:  PF(r, ["SUBSYSTEM","subsystem","Subsystem"]),
    ssDesc:     PF(r, ["SS_DESCRIPTION","ssDescription","SS Description","ss_description"]),
    element:    PF(r, ["ELEMENT","element","Element"]),
    description:PF(r, ["DESCRIPTION","description","Description"]),
    category:   PF(r, ["CATEGORY","category","Category"]) || "—",
    discipline: PF(r, ["DISCIPLINE","discipline","Discipline"]),
    raised:     PF(r, ["RAISED","raised","Raised"]),
    remarks:    PF(r, ["Remarks","remarks","REMARKS"]),
    closedAt:   PF(r, ["ClosedAt","closedAt","Closed At","CLOSEDAT"]),
    closedBy:   PF(r, ["ClosedBy","closedBy","Closed By","CLOSEDBY"]),
    closePhoto: PF(r, ["ClosePhoto","closePhoto","Photo","CLOSEPHOTO"]),
    status:    (PF(r, ["Status","status","STATUS"]) || "Open").toLowerCase().indexOf("clos") === 0 ? "Closed" : "Open",
  };
}

/* Small JPEG for a sheet cell (~360px, q0.5) so base64 stays under the limit */
function compressPunchPhoto(file){
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const MAX = 360, w0 = img.width, h0 = img.height;
        const w = w0 > MAX ? MAX : w0, h = w0 > MAX ? Math.round(h0 * MAX / w0) : h0;
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        res(c.toDataURL("image/jpeg", 0.5));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function PunchRow({ p, canEdit, onUpdate }){
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState(p.remarks);
  const [status, setStatus] = useState(p.status);
  const [photo, setPhoto] = useState(p.closePhoto || "");
  const [lb, setLb] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();
  const closed = p.status === "Closed";
  const dirty = remarks !== p.remarks || status !== p.status || photo !== (p.closePhoto || "");

  const pickPhoto = async e => {
    const f = e.target.files[0]; if(!f) return;
    setBusy(true);
    const data = await compressPunchPhoto(f);
    setPhoto(data); setBusy(false); e.target.value = "";
  };
  const save = () => { onUpdate(p.code, { Remarks:remarks, Status:status, ClosePhoto:photo }); setOpen(false); };

  return (
    <div className={"eng " + (closed ? "resolved" : "open")} style={{ padding:"12px 14px" }}>
      <div className="eng-meta">
        <span className="punch-no tnum">{p.code}</span>
        {p.area && <span className="chip area">{p.area}</span>}
        {p.category && <span className="chip" style={{ background:"var(--info-soft)", color:"var(--info)", borderColor:"transparent" }}>Cat {p.category}</span>}
        <span className={"pill " + (closed ? "resolved" : "open")}>{closed ? "✓ "+t("Closed") : "● "+t("Open")}</span>
      </div>
      {p.ssDesc && <div style={{ fontSize:13.5, fontWeight:600, marginTop:4 }}>{p.ssDesc}</div>}
      {p.subsystem && <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2 }}>{p.subsystem}{p.element ? " · "+p.element : ""}</div>}
      {p.description && <div className="eng-desc" style={{ marginTop:7 }}>{p.description}</div>}
      {closed && p.closedAt && <div className="resolved-stamp" style={{ marginTop:8 }}><Icon name="check" size={14}/> {t("Closed")} · {p.closedAt}{p.closedBy ? " · " + p.closedBy : ""}</div>}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:7, fontSize:11, color:"var(--text-3)" }}>
        {p.discipline && <span>{t("Discipline")}: <strong style={{color:"var(--text-2)"}}>{p.discipline}</strong></span>}
        {p.raised && <span>{t("Raised")}: <strong style={{color:"var(--text-2)"}}>{p.raised}</strong></span>}
      </div>

      {canEdit ? (
        <div style={{ marginTop:10, paddingTop:10, borderTop:"1px solid var(--border)" }}>
          {!open && (
            <button className="btn btn-ghost btn-sm" onClick={()=>setOpen(true)}><Icon name="settings" size={13}/> {t("Update")}</button>
          )}
          {open && <>
            <label className="label">{t("Remarks")}</label>
            <textarea className="textarea" rows={2} value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder={t("Field remarks…")} />
            <label className="label" style={{ marginTop:10 }}>{t("Status")}</label>
            <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="Open">{t("Open")}</option>
              <option value="Closed">{t("Closed")}</option>
            </select>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={pickPhoto} style={{ display:"none" }} />
            <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:10 }}>
              <button className="btn btn-ghost" style={{ width:"auto" }} onClick={()=>fileRef.current.click()} disabled={busy}><Icon name="camera" size={16}/> {busy ? "…" : (photo ? t("Change photo") : t("Add photo"))}</button>
              {photo && <div style={{ position:"relative" }}>
                <img src={photo} onClick={()=>setLb(photo)} style={{ width:46, height:46, objectFit:"cover", borderRadius:8, border:"1px solid var(--border)", cursor:"zoom-in" }} alt="" />
                <button onClick={()=>setPhoto("")} style={{ position:"absolute", top:-6, right:-6, width:20, height:20, borderRadius:"50%", background:"var(--danger)", border:"none", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="x" size={11}/></button>
              </div>}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button className="btn btn-ghost" style={{ flex:"0 0 38%" }} onClick={()=>{ setRemarks(p.remarks); setStatus(p.status); setPhoto(p.closePhoto||""); setOpen(false); }}><Icon name="x" size={15}/> {t("Cancel")}</button>
              <button className="btn btn-success" style={{ flex:1 }} disabled={!dirty} onClick={save}><Icon name="check" size={15}/> {t("Save")}</button>
            </div>
          </>}
          {!open && p.remarks && <div style={{ fontSize:12.5, color:"var(--text-2)", marginTop:7, fontStyle:"italic" }}>“{p.remarks}”</div>}
          {!open && p.closePhoto && <img src={p.closePhoto} onClick={()=>setLb(p.closePhoto)} style={{ width:54, height:54, objectFit:"cover", borderRadius:8, border:"1px solid var(--border)", marginTop:8, cursor:"zoom-in" }} alt="" />}
        </div>
      ) : (
        <>
          {p.remarks && <div style={{ fontSize:12.5, color:"var(--text-2)", marginTop:9, paddingTop:9, borderTop:"1px solid var(--border)", fontStyle:"italic" }}>“{p.remarks}”</div>}
          {p.closePhoto && <img src={p.closePhoto} onClick={()=>setLb(p.closePhoto)} style={{ width:54, height:54, objectFit:"cover", borderRadius:8, border:"1px solid var(--border)", marginTop:8, cursor:"zoom-in" }} alt="" />}
        </>
      )}
      <Lightbox src={lb} onClose={()=>setLb(null)} />
    </div>
  );
}

function PunchScreen({ session, punches, onUpdate }){
  const [filter, setFilter] = useState("all");
  const [cat, setCat] = useState("all");
  const [area, setArea] = useState("all");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(100);
  useEffect(() => { setShown(100); }, [filter, cat, area, q]);
  const [groupBy, setGroupBy] = useState("category");
  const canEdit = !session.isGuest;

  const items = punches.map(normPunch).filter(p => p.code);
  const punchAreas = [...new Set(items.map(p => p.area).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b), undefined, { numeric:true }));

  /* Area filter scopes EVERYTHING (stats + summary + list) */
  const scoped = items.filter(p => area === "all" || p.area === area);
  const open = scoped.filter(p => p.status === "Open").length;
  const closed = scoped.filter(p => p.status === "Closed").length;

  const cats = [...new Set(scoped.map(p => p.category))].sort();
  const groupKey = groupBy === "category" ? "category" : "subsystem";
  const groups = {};
  scoped.forEach(p => {
    const k = p[groupKey] || "—";
    if(!groups[k]) groups[k] = { open:0, closed:0, total:0 };
    groups[k].total++; groups[k][p.status === "Closed" ? "closed" : "open"]++;
  });
  const groupRows = Object.entries(groups).sort((a,b)=>b[1].total-a[1].total);

  const ql = q.trim().toLowerCase();
  const list = scoped.filter(p =>
    (filter === "all" || p.status.toLowerCase() === filter) &&
    (cat === "all" || p.category === cat) &&
    (!ql || (p.code+" "+p.ssDesc+" "+p.description+" "+p.subsystem+" "+p.area).toLowerCase().includes(ql))
  );

  return (
    <div>
      <h1 className="page-title">{t("Punch Closure")}</h1>
      <p className="page-sub">{t("Punch list status & closure tracking.")}</p>

      {punchAreas.length > 1 && (
        <select className="select" style={{ marginBottom:14 }} value={area} onChange={e=>setArea(e.target.value)}>
          <option value="all">{t("All")} — {t("Area")} ({items.length})</option>
          {punchAreas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      )}

      <div className="stat-row" style={{ gridTemplateColumns:"repeat(3,1fr)", marginBottom:14 }}>
        <Stat label={t("Open")} value={open} tone="danger" />
        <Stat label={t("Closed")} value={closed} tone="primary" />
        <Stat label={t("Total")} value={scoped.length} tone="accent" />
      </div>

      {scoped.length > 0 && (
        <div className="card pad" style={{ marginBottom:14 }}>
          <div className="section-head">
            <span className="bar"/><span className="st">{t("Summary")}{area!=="all" ? " · "+area : ""}</span>
            <div className="segmented right">
              <button className={groupBy==="category"?"on":""} onClick={()=>setGroupBy("category")}>{t("Category")}</button>
              <button className={groupBy==="subsystem"?"on":""} onClick={()=>setGroupBy("subsystem")}>{t("Subsystem")}</button>
            </div>
          </div>
          <div className="tbl-wrap" style={{ maxHeight:230, overflowY:"auto" }}>
            <table className="tbl">
              <thead><tr><th>{groupBy==="category"?t("Category"):t("Subsystem")}</th><th className="num">{t("Open")}</th><th className="num">{t("Closed")}</th><th className="num">{t("Total")}</th></tr></thead>
              <tbody>
                {groupRows.map(([k,v]) => (
                  <tr key={k}>
                    <td style={{ fontWeight:600, fontSize:12, whiteSpace:"normal" }}>{k}</td>
                    <td className="num" style={{ color:"var(--danger)", fontWeight:700 }}>{v.open}</td>
                    <td className="num" style={{ color:"var(--success)", fontWeight:700 }}>{v.closed}</td>
                    <td className="num" style={{ fontWeight:800 }}>{v.total}</td>
                  </tr>
                ))}
                <tr className="tot-row">
                  <td style={{ fontSize:10, textTransform:"uppercase", letterSpacing:".06em", color:"var(--text-2)" }}>{t("Total")}</td>
                  <td className="num" style={{ color:"var(--danger)" }}>{open}</td>
                  <td className="num" style={{ color:"var(--success)" }}>{closed}</td>
                  <td className="num" style={{ color:"var(--accent)" }}>{scoped.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty"><div className="ee">📋</div>{t("No punch list yet. Admin pastes it into the Punch sheet.")}</div>
      ) : (
        <>
          <input className="input" style={{ marginBottom:10 }} value={q} onChange={e=>setQ(e.target.value)} placeholder={t("Search code, description, subsystem…")} />
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            <div className="segmented">
              {["all","open","closed"].map(f => <button key={f} className={filter===f?"on":""} onClick={()=>setFilter(f)}>{t(f.charAt(0).toUpperCase()+f.slice(1))}</button>)}
            </div>
            {cats.length > 1 && (
              <select className="select" style={{ width:"auto", minHeight:38, padding:"6px 30px 6px 12px", fontSize:13 }} value={cat} onChange={e=>setCat(e.target.value)}>
                <option value="all">{t("All")} ({t("Category")})</option>
                {cats.map(c => <option key={c} value={c}>Cat {c}</option>)}
              </select>
            )}
          </div>
          <div style={{ fontSize:11, color:"var(--text-3)", marginBottom:10 }}>{list.length} / {items.length}</div>
          {list.slice(0, shown).map(p => <PunchRow key={p.code} p={p} canEdit={canEdit} onUpdate={onUpdate} />)}
          {list.length > shown && (
            <button className="btn btn-ghost btn-block" style={{ marginTop:8 }} onClick={()=>setShown(shown+100)}>
              {t("Show more")} ({list.length - shown})
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ════════════════════ SUMMARY ════════════════════ */
function SummaryScreen({ session, reports, targets, engIssues, roleGroups, onToggle }){
  const [sumDate, setSumDate] = useState(todayStr());
  const isToday = sumDate === todayStr();

  const sumReports = reports.filter(r=>r.date===sumDate);
  const dayTargets = targets.filter(t=>t.date===sumDate);
  const sumEng = engIssues.filter(r=>r.date===sumDate);

  const areaMap = {};
  sumReports.forEach(r => {
    if(!areaMap[r.area]) areaMap[r.area] = { direct:0, indirect:0, support:0, total:0, entries:[] };
    const a = areaMap[r.area]; const m = manStats(r, roleGroups);
    a.direct += m.direct; a.indirect += m.indirect; a.support += m.support; a.total += m.total; a.entries.push(r);
  });
  const sumMan = k => sumReports.reduce((s,r)=>s+manStats(r, roleGroups)[k],0);
  const tradeTotals = allRoles(roleGroups).map(role => ({ ...role, n:sumReports.reduce((s,r)=>s+roleVal(r,role.key),0) })).filter(x=>x.n>0);
  const openOnDate = engIssues.filter(e=>{
    const sub = (e.submittedAt||e.date).slice(0,10);
    if((e.status||"open")==="open") return e.date <= sumDate;
    return e.resolvedAt && e.resolvedAt.slice(0,10) > sumDate;
  }).length;

  return (
    <div>
      <h1 className="page-title">{t("Summary")}</h1>
      <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
        <input type="date" className="input" style={{ flex:1 }} value={sumDate} onChange={e=>setSumDate(e.target.value)} />
        <button className={"btn btn-sm " + (isToday ? "btn-primary" : "btn-ghost")} onClick={()=>setSumDate(todayStr())} style={{ whiteSpace:"nowrap" }}>{t("Today")}</button>
      </div>

      <div className="card pad">
        <div className="section-head"><span className="bar"/><span className="st">{t("👷 Manpower")}</span></div>
        <div className="stat-row" style={{ gridTemplateColumns:"repeat(2,1fr)", marginBottom:16 }}>
          <Stat label="Direct" value={sumMan("direct")} tone="accent" />
          <Stat label="Indirect" value={sumMan("indirect")} tone="primary" />
          <Stat label="Support" value={sumMan("support")} />
          <Stat label="Total MP" value={sumMan("total")} tone="accent" />
        </div>
        {Object.keys(areaMap).length===0
          ? <div className="empty"><div className="ee">📊</div>No manpower data for this date.</div>
          : <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>{["Area","Sup.","Dir","Ind","Sup","Total"].map(h=><th key={h} className={h==="Area"||h==="Sup."?"":"num"}>{h}</th>)}</tr></thead>
                <tbody>
                  {Object.entries(areaMap).map(([area,d]) => {
                    const sups = [...new Set(d.entries.map(e=>e.supervisor))].join(", ");
                    return (
                      <tr key={area}>
                        <td><span className="chip area">{area}</span></td>
                        <td style={{ fontSize:12, color:"var(--text-2)", whiteSpace:"normal" }}>{sups}</td>
                        <td className="num">{d.direct}</td>
                        <td className="num">{d.indirect}</td>
                        <td className="num">{d.support}</td>
                        <td className="num" style={{ fontWeight:800, color:"var(--accent)" }}>{d.total}</td>
                      </tr>
                    );
                  })}
                  <tr className="tot-row">
                    <td colSpan={2} style={{ fontSize:10, letterSpacing:".06em", textTransform:"uppercase", color:"var(--text-2)" }}>Total</td>
                    <td className="num">{sumMan("direct")}</td>
                    <td className="num">{sumMan("indirect")}</td>
                    <td className="num">{sumMan("support")}</td>
                    <td className="num" style={{ fontSize:16, color:"var(--accent)" }}>{sumMan("total")}</td>
                  </tr>
                </tbody>
              </table>
            </div>}
        {tradeTotals.length > 0 && (
          <div style={{ marginTop:14 }}>
            <div className="sl" style={{ fontSize:9.5, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:".07em", fontWeight:700, marginBottom:8 }}>By trade</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {tradeTotals.map(t => (
                <span key={t.key} className="chip" style={{ gap:6 }}>{t.label} <strong className="tnum" style={{ color:"var(--accent)" }}>{t.n}</strong></span>
              ))}
            </div>
          </div>
        )}
      </div>

      {dayTargets.length > 0 && (
        <div className="card pad" style={{ marginTop:14 }}>
          <div className="section-head"><span className="bar" style={{background:"var(--info)"}}/><span className="st" style={{color:"var(--info)"}}>{t("🎯 Area Targets")}</span></div>
          {(() => {
            const cols = TARGET_METRICS.filter(m => dayTargets.some(t => parseFloat(t[m.key])>0));
            if(cols.length===0) return <div style={{ fontSize:12, color:"var(--text-3)" }}>—</div>;
            return (
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>{t("Area")}</th><th>{t("Supervisor")}</th>{cols.map(m=><th key={m.key} className="num">{t(m.label)}<br/><span className="metric-unit">{m.unit}</span></th>)}</tr></thead>
                  <tbody>
                    {dayTargets.map(tg => (
                      <tr key={tg.id}>
                        <td><span className="chip area">{tg.area}</span></td>
                        <td style={{ fontSize:12, color:"var(--text-2)" }}>{tg.supervisor}</td>
                        {cols.map(m => <td key={m.key} className="num" style={{ color:"var(--info)", fontWeight:700 }}>{parseFloat(tg[m.key])>0?tg[m.key]:"—"}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      <div className="card pad" style={{ marginTop:14 }}>
        <div className="section-head">
          <span className="bar" style={{background:"var(--danger)"}}/>
          <span className="st" style={{color:"var(--danger)"}}>{t("⚠️ Engineering")}</span>
          <span className="right" style={{ display:"flex", gap:12, fontSize:12 }}>
            <span style={{ color:"var(--danger)" }}>Open <strong>{openOnDate}</strong></span>
            <span style={{ color:"var(--text-2)" }}>Logged <strong>{sumEng.length}</strong></span>
          </span>
        </div>
        {sumEng.length===0
          ? <div className="empty"><div className="ee">✅</div>No issues logged on this date.</div>
          : sumEng.map(e => <EngCard key={e.id} issue={e} onToggle={onToggle} isAdmin={session.isAdmin} />)}
      </div>
    </div>
  );
}

/* ════════════════════ RECORDS (admin) ════════════════════ */
function RecordsScreen({ session, reports, targets, engIssues, supervisors, areas, subAreas, users, project, roleGroups, adminOnly,
  onToggle, onDeleteReport, onAddSup, onRemoveSup, onRenameSup, onEditSup, onSetPw,
  onAddArea, onRemoveArea, onRenameArea, onAddSubArea, onRemoveSubArea, onImportAreaMap, onUpdateProject,
  onAddRole, onRemoveRole, onRenameRole, showFlash }){
  const [fSup, setFSup] = useState("All");
  const [fArea, setFArea] = useState("All");
  const [fDate, setFDate] = useState("");
  const [engFilter, setEngFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [sub, setSub] = useState(adminOnly ? "manage" : "manpower");
  /* management local state */
  const [newSup, setNewSup] = useState("");
  const [newSupPw, setNewSupPw] = useState("");
  const [pwEdit, setPwEdit] = useState({});
  const [nameEdit, setNameEdit] = useState({});
  const [rnPw, setRnPw] = useState({});
  const [newArea, setNewArea] = useState("");
  const [areaEdit, setAreaEdit] = useState({});
  const [newSA, setNewSA] = useState({});
  const [bulkText, setBulkText] = useState("");
  const [proj, setProj] = useState(project);
  const [confirmDel, setConfirmDel] = useState(null);
  const [aSub, setASub] = useState("");
  const [rGroup, setRGroup] = useState("direct");
  const [rName, setRName] = useState("");
  const addPair = () => {
    const a = newArea.trim(), sa = aSub.trim();
    if(!a){ showFlash(t("Enter an area")); return; }
    const exists = (subAreas[a]||[]).some(x=>x.toLowerCase()===sa.toLowerCase());
    if(sa && exists){ showFlash(a + " / " + sa + " " + t("already exists")); return; }
    if(!sa && areas.includes(a)){ showFlash(a + " " + t("already exists")); return; }
    if(sa) onAddSubArea(a, sa); else onAddArea(a);
    showFlash(a + (sa ? " / " + sa : "") + " " + t("added")); setNewArea(""); setASub("");
  };
  const delPair = () => {
    const a = newArea.trim(), sa = aSub.trim();
    if(!a){ showFlash(t("Enter an area")); return; }
    if(!areas.includes(a)){ showFlash(a + " " + t("not found")); return; }
    if(sa){
      const real = (subAreas[a]||[]).find(x=>x.toLowerCase()===sa.toLowerCase());
      if(!real){ showFlash(a + " / " + sa + " " + t("not found")); return; }
      onRemoveSubArea(a, real); showFlash(a + " / " + real + " " + t("removed"));
    } else { onRemoveArea(a); showFlash(a + " " + t("removed")); }
    setNewArea(""); setASub("");
  };
  const findRoleByName = (gid, name) => { const g = roleGroups.find(x=>x.id===gid); return g ? (g.roles.find(r=>r.label.toLowerCase()===name.toLowerCase()) || null) : null; };
  const addRolePair = () => {
    const n = rName.trim(); if(!n){ showFlash(t("Enter a role name")); return; }
    if(findRoleByName(rGroup, n)){ showFlash(n + " " + t("already exists")); return; }
    onAddRole(rGroup, n); showFlash(n + " " + t("added")); setRName("");
  };
  const delRolePair = () => {
    const n = rName.trim(); if(!n){ showFlash(t("Enter a role name")); return; }
    const role = findRoleByName(rGroup, n);
    if(!role){ showFlash(n + " " + t("not found")); return; }
    onRemoveRole(rGroup, role.key); showFlash(role.label + " " + t("removed")); setRName("");
  };
  const [newRole, setNewRole] = useState({});
  const [roleEdit, setRoleEdit] = useState({});

  const fReports = reports.filter(r=>(fSup==="All"||r.supervisor===fSup)&&(fArea==="All"||r.area===fArea)&&(!fDate||r.date===fDate)).slice().sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
  const fEng = engIssues.filter(r=>(fArea==="All"||r.area===fArea)&&(!fDate||r.date===fDate)&&(engFilter==="all"||(r.status||"open")===engFilter)).slice().sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
  const fTargets = targets.filter(t=>(fSup==="All"||t.supervisor===fSup)&&(!fDate||t.date===fDate)).slice().sort((a,b)=>String(b.date||"").localeCompare(String(a.date||"")));
  const sum = k => fReports.reduce((s,r)=>s+r[k],0);
  const sumMan = k => fReports.reduce((s,r)=>s+manStats(r, roleGroups)[k],0);

  const csv = (rows, head, mapRow, name) => {
    const lines = [head.join(","), ...rows.map(r => mapRow(r).map(c=>`"${String(c??"").replace(/"/g,'""')}"`).join(","))];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type:"text/csv" }));
    a.download = `${name}_${todayStr()}.csv`; a.click();
    showFlash(`${name} CSV exported`);
  };

  const savePw = (name) => {
    const p = (pwEdit[name]||"").trim();
    if(!p) return;
    onSetPw(name, p); setPwEdit(s=>({ ...s, [name]:"" })); showFlash(`${name} password updated`);
  };
  const saveRename = (name) => {
    const nn = (nameEdit[name]||"").trim();
    const np = (rnPw[name] !== undefined ? rnPw[name] : (users[name]||"")).trim();
    const nameChanged = nn && nn !== name;
    if(nameChanged && supervisors.includes(nn)) { showFlash(`"${nn}" already exists`); return; }
    onEditSup(name, nameChanged ? nn : name, np);
    setNameEdit(s=>{ const c={...s}; delete c[name]; return c; });
    setRnPw(s=>{ const c={...s}; delete c[name]; return c; });
    showFlash(nameChanged ? `${t("Updated")}: ${nn}` : `${name} ${t("updated")}`);
  };
  const addSup = () => {
    const n = newSup.trim();
    if(!n) return;
    if(supervisors.includes(n) || n===GUEST_USER) { showFlash(`"${n}" already exists`); return; }
    onAddSup(n, (newSupPw.trim()||"1234")); setNewSup(""); setNewSupPw(""); showFlash(`${n} added`);
  };
  const removeSup = (name) => { onRemoveSup(name); setConfirmDel(null); showFlash(`${name} removed · records kept`); };
  const saveArea = (a) => {
    const nn = (areaEdit[a]||"").trim();
    if(!nn || nn===a) { setAreaEdit(s=>{ const c={...s}; delete c[a]; return c; }); return; }
    if(areas.includes(nn)) { showFlash(`"${nn}" already exists`); return; }
    onRenameArea(a, nn); setAreaEdit(s=>{ const c={...s}; delete c[a]; return c; }); showFlash(`Area renamed to ${nn}`);
  };
  const addArea = () => {
    const n = newArea.trim();
    if(!n) return;
    if(areas.includes(n)) { showFlash(`"${n}" already exists`); return; }
    onAddArea(n); setNewArea(""); showFlash(`Area ${n} added`);
  };
  const addSubArea = (area) => {
    const n = (newSA[area]||"").trim();
    if(!n) return;
    if((subAreas[area]||[]).includes(n)) { showFlash(`"${n}" already exists`); return; }
    onAddSubArea(area, n); setNewSA(s=>({ ...s, [area]:"" })); showFlash(`${n} added to ${area}`);
  };
  const runImport = () => {
    const pairs = bulkText.split(/\r?\n/)
      .map(l => {
        const m = l.match(/^\s*([^\t,]+?)\s*[\t,]\s*([\s\S]*?)\s*$/);
        return m ? [m[1].trim(), m[2].trim()] : [l.trim(), ""];
      })
      .filter(r => r[0] && !/^area$/i.test(r[0]));
    if(!pairs.length) { showFlash("Nothing to import"); return; }
    onImportAreaMap(pairs);
    const nAreas = new Set(pairs.map(p=>p[0])).size;
    const nSubs = pairs.filter(p=>p[1]).length;
    setBulkText(""); showFlash(`Imported ${nAreas} areas · ${nSubs} sub-areas`);
  };

  const subs = [
    { id:"manpower", label:t("Manpower"), n:fReports.length },
    { id:"eng", label:t("Issues"), n:fEng.length },
    { id:"targets", label:t("Targets"), n:fTargets.length },
    { id:"manage", label:t("⚙ Manage"), n:supervisors.length },
  ];

  return (
    <div>
      <h1 className="page-title">{adminOnly ? t("Administration") : t("Records")}</h1>
      <p className="page-sub">{adminOnly ? t("Manage team, areas & roles") : t("Admin · all submitted data & exports.")}</p>

      {!adminOnly && <>
      <div className="card pad">
        <div className="section-head"><span className="bar"/><span className="st"><Icon name="filter" size={13} style={{verticalAlign:"-2px"}}/> Filters</span></div>
        <div className="grid-2">
          <div className="field" style={{ marginBottom:10 }}>
            <label className="label">Supervisor</label>
            <select className="select" value={fSup} onChange={e=>setFSup(e.target.value)}><option>All</option>{[...supervisors].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true,sensitivity:"base"})).map(s=><option key={s}>{s}</option>)}</select>
          </div>
          <div className="field" style={{ marginBottom:10 }}>
            <label className="label">Area</label>
            <select className="select" value={fArea} onChange={e=>setFArea(e.target.value)}><option>All</option>{[...areas].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true,sensitivity:"base"})).map(a=><option key={a}>{a}</option>)}</select>
          </div>
        </div>
        <div className="field" style={{ marginBottom:0 }}>
          <label className="label">Date</label>
          <input type="date" className="input" value={fDate} onChange={e=>setFDate(e.target.value)} />
        </div>
        {(fSup!=="All"||fArea!=="All"||fDate) &&
          <button className="btn btn-ghost btn-sm" style={{ marginTop:10 }} onClick={()=>{setFSup("All");setFArea("All");setFDate("");}}><Icon name="x" size={13}/> Clear filters</button>}
      </div>

      <div className="stat-row" style={{ gridTemplateColumns:"repeat(4,1fr)", margin:"14px 0" }}>
        <Stat label="Reports" value={fReports.length} tone="primary" />
        <Stat label="Direct" value={sumMan("direct")} tone="accent" />
        <Stat label="Indirect" value={sumMan("indirect")} />
        <Stat label="Issues" value={fEng.length} tone="danger" />
      </div>

      <div className="segmented" style={{ display:"flex", width:"100%", marginBottom:14 }}>
        {subs.map(s => (
          <button key={s.id} className={sub===s.id?"on":""} style={{ flex:1 }} onClick={()=>setSub(s.id)}>
            {s.label} <span style={{ opacity:.6 }}>{s.n}</span>
          </button>
        ))}
      </div>
      </>}

      {sub==="manpower" && (
        <div className="card pad">
          <div className="section-head">
            <span className="bar"/><span className="st">Manpower records</span>
            <button className="btn btn-ghost btn-sm right" onClick={()=>csv(fReports,["Date","Supervisor","Area","Sub-Area",...allRoles(roleGroups).map(r=>r.label),"Direct","Indirect","Support","Total","Job Description"],r=>{ const m=manStats(r, roleGroups); return [r.date,r.supervisor,r.area,r.subArea,...allRoles(roleGroups).map(role=>roleVal(r,role.key)),m.direct,m.indirect,m.support,m.total,r.jobDescription]; },"Manpower")}><Icon name="download" size={14}/> CSV</button>
          </div>
          {fReports.length===0 ? <div className="empty"><div className="ee">🔍</div>No records found.</div> :
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>{["Date","Sup.","Area","Dir","Ind","Sup","Tot"].map(h=><th key={h} className={["Dir","Ind","Sup","Tot"].includes(h)?"num":""}>{h}</th>)}</tr></thead>
                <tbody>
                  {fReports.map(r => {
                    const m = manStats(r, roleGroups);
                    return (
                    <React.Fragment key={r.id}>
                      <tr onClick={()=>setExpanded(expanded===r.id?null:r.id)} style={{ cursor:"pointer" }}>
                        <td style={{ color:"var(--text-2)", fontSize:12 }}>{String(r.date||"").slice(5)}</td>
                        <td style={{ fontWeight:600 }}>{r.supervisor}</td>
                        <td><span className="chip area">{r.area}</span></td>
                        <td className="num">{m.direct}</td>
                        <td className="num">{m.indirect}</td>
                        <td className="num">{m.support}</td>
                        <td className="num" style={{ fontWeight:800, color:"var(--accent)" }}>{m.total}</td>
                      </tr>
                      {expanded===r.id &&
                        <tr><td colSpan={7} style={{ background:"var(--surface-2)", whiteSpace:"normal" }}>
                          {m.byRole.length>0 && <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                            {m.byRole.map(x => <span key={x.key} className="chip" style={{ gap:5 }}>{x.label} <strong className="tnum" style={{color:"var(--accent)"}}>{x.n}</strong></span>)}
                          </div>}
                          <div style={{ fontSize:9.5, color:"var(--primary)", fontWeight:700, textTransform:"uppercase", letterSpacing:".06em", marginBottom:5 }}>{r.subArea!=="-"?r.subArea+" · ":""}Job description</div>
                          <div style={{ fontSize:13, lineHeight:1.6, color:"var(--text)" }}>{r.jobDescription}</div>
                          <button className="btn btn-sm" style={{ marginTop:10, color:"var(--danger)", border:"1px solid var(--danger)", background:"var(--danger-soft)" }} onClick={(e)=>{ e.stopPropagation(); onDeleteReport(r.id); }}><Icon name="trash" size={13}/> Delete</button>
                        </td></tr>}
                    </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>}
        </div>
      )}

      {sub==="eng" && (
        <div>
          <div style={{ display:"flex", alignItems:"center", marginBottom:12 }}>
            <div className="segmented">
              {["all","open","resolved"].map(f=><button key={f} className={engFilter===f?"on":""} onClick={()=>setEngFilter(f)} style={{textTransform:"capitalize"}}>{f}</button>)}
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft:"auto" }} onClick={()=>csv(fEng,["Date","Area","Sub-Area","Status","Description"],r=>[r.date,r.area,r.subArea,r.status||"open",r.description],"Engineering")}><Icon name="download" size={14}/> CSV</button>
          </div>
          {fEng.length===0 ? <div className="empty"><div className="ee">🔍</div>No issues found.</div> :
            fEng.map(e => <EngCard key={e.id} issue={e} onToggle={onToggle} isAdmin={true} />)}
        </div>
      )}

      {sub==="targets" && (
        <div className="card pad">
          <div className="section-head">
            <span className="bar" style={{background:"var(--info)"}}/><span className="st" style={{color:"var(--info)"}}>Targets</span>
            <button className="btn btn-ghost btn-sm right" onClick={()=>csv(fTargets,["Date","Supervisor","Area",...TARGET_METRICS.map(m=>m.label+" ("+m.unit+")")],r=>[r.date,r.supervisor,r.area,...TARGET_METRICS.map(m=>r[m.key]||"")],"Targets")}><Icon name="download" size={14}/> CSV</button>
          </div>
          {fTargets.length===0 ? <div className="empty"><div className="ee">🔍</div>No targets found.</div> :
            (() => {
              const cols = TARGET_METRICS.filter(m => fTargets.some(t => parseFloat(t[m.key])>0));
              return (
                <div className="tbl-wrap">
                  <table className="tbl">
                    <thead><tr><th>Date</th><th>Sup.</th><th>Area</th>{cols.map(m=><th key={m.key} className="num">{t(m.label)}<br/><span className="metric-unit">{m.unit}</span></th>)}</tr></thead>
                    <tbody>{fTargets.map(tg=>(
                      <tr key={tg.id}>
                        <td style={{ color:"var(--text-2)", fontSize:12 }}>{String(tg.date||"").slice(5)}</td>
                        <td style={{ fontWeight:600 }}>{tg.supervisor}</td>
                        <td><span className="chip area">{tg.area}</span></td>
                        {cols.map(m=><td key={m.key} className="num" style={{ color:"var(--info)", fontWeight:700 }}>{parseFloat(tg[m.key])>0?tg[m.key]:"—"}</td>)}
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              );
            })()}
        </div>
      )}

      {(adminOnly || sub==="manage") && (
        <div>
          {/* ── TEAM ── */}
          <div className="card pad">
            <div className="section-head"><span className="bar"/><span className="st"><Icon name="user" size={13} style={{verticalAlign:"-2px"}}/> Team · supervisors</span>
              <span className="right count-pill">{supervisors.length}</span></div>

            {supervisors.map(name => {
              const isAdmin = name===ADMIN_USER;
              const renaming = nameEdit[name] !== undefined;
              return (
                <div key={name} className="mgmt-row">
                  <Avatar name={name} size={38} />
                  <div style={{ flex:1, minWidth:0 }}>
                    {renaming
                      ? <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                          <input className="input" style={{ minHeight:40, fontSize:14 }} autoFocus value={nameEdit[name]}
                            onChange={e=>setNameEdit(s=>({ ...s, [name]:e.target.value }))}
                            onKeyDown={e=>e.key==="Enter"&&saveRename(name)} placeholder="Name" />
                          <input className="input" style={{ minHeight:40, fontSize:14 }}
                            value={rnPw[name] !== undefined ? rnPw[name] : (users[name]||"")}
                            onChange={e=>setRnPw(s=>({ ...s, [name]:e.target.value }))}
                            onKeyDown={e=>e.key==="Enter"&&saveRename(name)} placeholder="Password" />
                        </div>
                      : <div style={{ fontSize:15, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                          {name} {isAdmin && <span className="pill" style={{ background:"var(--accent-soft)", color:"var(--accent)" }}>Admin</span>}
                        </div>}
                    {!renaming && <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2 }}>Password: <code>{users[name]||"—"}</code></div>}
                  </div>
                  {renaming
                    ? <div style={{ display:"flex", gap:6 }}>
                        <button className="sq ok" onClick={()=>saveRename(name)}><Icon name="check" size={15}/></button>
                        <button className="sq" onClick={()=>setNameEdit(s=>{ const c={...s}; delete c[name]; return c; })}><Icon name="x" size={14}/></button>
                      </div>
                    : <div style={{ display:"flex", gap:6 }}>
                        <button className="sq" title="Rename" onClick={()=>setNameEdit(s=>({ ...s, [name]:name }))}><Icon name="settings" size={15}/></button>
                        {!isAdmin && <button className="sq danger" title="Remove" onClick={()=>setConfirmDel(name)}><Icon name="trash" size={14}/></button>}
                      </div>}
                </div>
              );
            })}

            {/* add supervisor */}
            <div className="subpanel" style={{ marginTop:12, marginBottom:0, borderStyle:"dashed", borderColor:"var(--primary-soft)" }}>
              <div className="sp-title"><Icon name="plus" size={14}/> Add supervisor</div>
              <div style={{ display:"flex", gap:9 }}>
                <input className="input" style={{ flex:1.4 }} value={newSup} onChange={e=>setNewSup(e.target.value)} placeholder="Name" onKeyDown={e=>e.key==="Enter"&&addSup()} />
                <input className="input" style={{ flex:1 }} value={newSupPw} onChange={e=>setNewSupPw(e.target.value)} placeholder="Password" onKeyDown={e=>e.key==="Enter"&&addSup()} />
              </div>
              <button className="btn btn-primary btn-block" style={{ marginTop:11 }} onClick={addSup}><Icon name="plus" size={16}/> Add supervisor</button>
            </div>
          </div>

          {/* ── AREAS & SUB-AREAS (compact) ── */}
          <div className="card pad" style={{ marginTop:14 }}>
            <div className="section-head"><span className="bar"/><span className="st"><Icon name="target" size={13} style={{verticalAlign:"-2px"}}/> Areas &amp; sub-areas</span>
              <span className="right count-pill">{areas.length}</span></div>
            <p style={{ fontSize:12, color:"var(--text-2)", margin:"-6px 0 12px" }}>{t("Add or remove one Area + Sub-Area at a time. Full list lives in the Google Sheet.")}</p>
            <div className="grid-2" style={{ gap:9 }}>
              <input className="input" value={newArea} onChange={e=>setNewArea(e.target.value)} placeholder={t("Area")} />
              <input className="input" value={aSub} onChange={e=>setASub(e.target.value)} placeholder={t("Sub-Area")} />
            </div>
            <div style={{ display:"flex", gap:9, marginTop:9 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={addPair}><Icon name="plus" size={16}/> {t("Add")}</button>
              <button className="btn" style={{ flex:1, background:"var(--danger-soft)", color:"var(--danger)", border:"1px solid var(--danger)" }} onClick={delPair}><Icon name="trash" size={15}/> {t("Delete")}</button>
            </div>
          </div>

          {/* ── MANPOWER ROLES (compact) ── */}
          <div className="card pad" style={{ marginTop:14 }}>
            <div className="section-head"><span className="bar"/><span className="st"><Icon name="user" size={13} style={{verticalAlign:"-2px"}}/> Manpower roles</span>
              <span className="right count-pill">{roleGroups.reduce((s,g)=>s+g.roles.length,0)}</span></div>
            <p style={{ fontSize:12, color:"var(--text-2)", margin:"-6px 0 12px" }}>{t("Add or remove one role at a time. Pick a group, type the role.")}</p>
            <div style={{ display:"flex", gap:9 }}>
              <select className="select" style={{ flex:"0 0 40%" }} value={rGroup} onChange={e=>setRGroup(e.target.value)}>
                {roleGroups.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
              <input className="input" style={{ flex:1 }} value={rName} onChange={e=>setRName(e.target.value)} placeholder={t("Role name")} />
            </div>
            <div style={{ display:"flex", gap:9, marginTop:9 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={addRolePair}><Icon name="plus" size={16}/> {t("Add")}</button>
              <button className="btn" style={{ flex:1, background:"var(--danger-soft)", color:"var(--danger)", border:"1px solid var(--danger)" }} onClick={delRolePair}><Icon name="trash" size={15}/> {t("Delete")}</button>
            </div>
          </div>

          {/* ── PROJECT SETTINGS ── */}
          <div className="card pad" style={{ marginTop:14 }}>
            <div className="section-head"><span className="bar"/><span className="st"><Icon name="settings" size={13} style={{verticalAlign:"-2px"}}/> Project identity</span></div>
            <p style={{ fontSize:12, color:"var(--text-2)", margin:"-6px 0 14px" }}>Adapt this app to any project — shown on the header &amp; login.</p>
            <div className="field">
              <label className="label">Project name</label>
              <input className="input" value={proj.name} onChange={e=>setProj(p=>({ ...p, name:e.target.value }))} placeholder="Site Follow-Up" />
            </div>
            <div className="field">
              <label className="label">Header line (project / discipline)</label>
              <input className="input" value={proj.kicker} onChange={e=>setProj(p=>({ ...p, kicker:e.target.value }))} placeholder="TR Qatar · EPC_04 Piping" />
            </div>
            <div className="field">
              <label className="label">Team / company label</label>
              <input className="input" value={proj.company} onChange={e=>setProj(p=>({ ...p, company:e.target.value }))} placeholder="EPC_04 Piping" />
            </div>
            <button className="btn btn-primary btn-block" onClick={()=>{ onUpdateProject(proj); showFlash("Project identity saved"); }}><Icon name="check" size={16}/> Save project identity</button>
          </div>

          <div style={{ fontSize:11, color:"var(--text-3)", textAlign:"center", padding:"16px 8px 0", lineHeight:1.6 }}>
            ⓘ Removing a supervisor or area only takes them off the active lists.<br/>All historical records are kept for audit.
          </div>
        </div>
      )}

      {confirmDel && (
        <div className="sheet-scrim" onClick={()=>setConfirmDel(null)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="grip" />
            <div style={{ padding:"4px 6px 10px" }}>
              <div style={{ fontSize:17, fontWeight:700, marginBottom:6 }}>Remove {confirmDel}?</div>
              <div style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.6 }}>
                {confirmDel} will be removed from the active supervisor list and can no longer sign in.
                Their submitted records, issues and targets are <strong>kept</strong> for audit.
              </div>
            </div>
            <div style={{ display:"flex", gap:10, paddingTop:6 }}>
              <button className="btn btn-ghost" onClick={()=>setConfirmDel(null)}>Cancel</button>
              <button className="btn" style={{ background:"var(--danger)", color:"#fff" }} onClick={()=>removeSup(confirmDel)}><Icon name="trash" size={15}/> Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ════════════════════ CHAT (live polling) ════════════════════ */
function ChatScreen({ session, supervisors, project }){
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();
  const pollRef = useRef();

  const fetchMessages = async () => {
    const data = await sget(CHAT_KEY);
    if(Array.isArray(data)) setMessages(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, []);
  useEffect(() => { if(bottomRef.current) bottomRef.current.parentNode.scrollTop = bottomRef.current.offsetTop + 999; }, [messages.length]);

  const send = async () => {
    const t = text.trim(); if(!t) return;
    const msg = { id:makeId("C"), author:session.name, text:t, ts:new Date().toISOString() };
    setMessages(p=>[...p, msg]); setText("");
    await sappend(CHAT_KEY, [msg]);
  };

  const grouped = messages.map((m,i) => {
    const prev = messages[i-1];
    const same = prev && prev.author===m.author && (new Date(m.ts)-new Date(prev.ts) < 5*60*1000);
    return { ...m, head:!same };
  });

  return (
    <div className="chat-wrap">
      <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:12, borderBottom:"1px solid var(--border)", marginBottom:10 }}>
        <div>
          <div style={{ fontWeight:700, fontSize:16 }}>Team Chat</div>
          <div style={{ fontSize:11, color:"var(--text-3)" }}>{supervisors.length} members · {project.company}</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex" }}>
          {supervisors.slice(0,5).map((s,i)=>(
            <div key={s} style={{ marginLeft:i?-9:0, border:"2px solid var(--bg)", borderRadius:"50%" }}><Avatar name={s} size={26} /></div>
          ))}
        </div>
      </div>

      <div className="chat-scroll">
        {loading && messages.length===0 && <div className="empty">Loading messages…</div>}
        {!loading && messages.length===0 && <div className="empty"><div className="ee">💬</div>No messages yet. Say hello! 👋</div>}
        {grouped.map(m => {
          const me = m.author === session.name;
          return (
            <div key={m.id} className={"msg-group" + (me?" me":"")}>
              {m.head && (
                <div className={"msg-head" + (me?" me":"")}>
                  <Avatar name={m.author} size={26} />
                  <span className="nm" style={{ color:colorFor(m.author) }}>{m.author}</span>
                  <span className="tm">{fmtDT(m.ts)}</span>
                </div>
              )}
              <div className={"bubble " + (me?"me":"them")}>{m.text}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <textarea className="ci-box" rows={1} value={text} onChange={e=>setText(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }}
          placeholder={t("Type a message…")} />
        <button className="send" onClick={send} disabled={!text.trim()}><Icon name="send" size={19} /></button>
      </div>
    </div>
  );
}


/* ═══════════════════ APP ═══════════════════ */
/* Local cache so an admin's area/identity edits survive reloads even
   before the Sheets "Areas"/"Settings" tabs exist. */
const AREAS_CACHE = "siteapp_areas_v2";
const PROJ_CACHE  = "siteapp_project_v2";
const ROLES_CACHE = "siteapp_roles_v2";
const readCache = (k) => { try{ return JSON.parse(localStorage.getItem(k)); }catch{ return null; } };
const writeCache = (k,v) => { try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} };

class ScreenGuard extends React.Component {
  constructor(props){ super(props); this.state = { err:null }; }
  static getDerivedStateFromError(err){ return { err }; }
  componentDidUpdate(prev){ if(prev.tab !== this.props.tab && this.state.err) this.setState({ err:null }); }
  render(){
    if(this.state.err){
      const tr = this.props.lang === "tr";
      return (
        <div className="empty" style={{ padding:"40px 20px" }}>
          <div className="ee">⚠️</div>
          <div style={{ fontWeight:700, color:"var(--text)", marginBottom:6 }}>{tr ? "Bu ekran yüklenemedi" : "This screen failed to load"}</div>
          <div style={{ fontSize:12.5, marginBottom:14 }}>{tr ? "Başka bir sekmeye geçip tekrar deneyin." : "Switch to another tab and try again."}</div>
          <div style={{ fontSize:10.5, color:"var(--text-3)", wordBreak:"break-word", maxWidth:340, margin:"0 auto" }}>{String(this.state.err && this.state.err.message || this.state.err)}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App(){
  const APP_VERSION = "v2026.06.21 · build 34";
  const [lang, setLangState] = useState(LANG);
  LANG = lang;
  const toggleLang = () => { const nx = lang === "tr" ? "en" : "tr"; LANG = nx; setLangState(nx); try{ localStorage.setItem("siteapp_lang", nx); }catch(e){} };
  const [booting, setBooting]   = useState(true);
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  const [session, setSession]   = useState(null);

  const [users, setUsers]         = useState(DEFAULT_PASSWORDS);
  const [supervisors, setSupervisors] = useState([]);
  const [areas, setAreas]         = useState([]);
  const [subAreas, setSubAreas]   = useState({});
  const [project, setProject]     = useState(DEFAULT_PROJECT);
  const [roleGroups, setRoleGroups] = useState(DEFAULT_ROLE_GROUPS);

  const [reports, setReports]     = useState([]);
  const [engIssues, setEngIssues] = useState([]);
  const [punches, setPunches]     = useState([]);
  const [targets, setTargets]     = useState([]);
  const [weeklyTargets, setWeeklyTargets] = useState([]);

  const [tab, setTab]     = useState("report");
  const [flash, setFlash] = useState("");
  const [sheet, setSheet] = useState(null);

  /* Login form */
  const [loginName, setLoginName] = useState("");
  const [loginPw, setLoginPw]     = useState("");
  const [loginErr, setLoginErr]   = useState("");

  /* ── Initial load from Sheets ── */
  useEffect(() => {
    (async () => {
      const [r, e, u, t] = await Promise.all([
        sget(STORAGE_KEY), sget(ENG_KEY), sget(USERS_KEY), sget(TARGETS_KEY),
      ]);
      const rep = (r || []).map(x => ({ ...x, date: dOnly(x.date) }));
      const eng = (e || []).map(x => ({ ...x, date: dOnly(x.date), photos: Array.isArray(x.photos) ? x.photos : [] }));
      const tar = (t || []).map(x => ({ ...x, date: dOnly(x.date) }));
      const usr = u || DEFAULT_PASSWORDS;
      if(!u) await sset(USERS_KEY, DEFAULT_PASSWORDS);
      setReports(rep); setEngIssues(eng); setTargets(tar); setUsers(usr);
      sget(PUNCH_KEY).then(pl => setPunches(pl || []));
      sget(WEEKLY_KEY).then(wl => setWeeklyTargets(wl || []));
      setSupervisors(Object.keys(usr).filter(n => n !== GUEST_USER));

      /* Areas + sub-areas: sheet/records, then merge local cache */
      const loaded = await loadAreas(rep);
      const cache = readCache(AREAS_CACHE);
      let ar = loaded.areas, sa = loaded.subAreas;
      if(cache && Array.isArray(cache.areas)){
        cache.areas.forEach(a => { if(!ar.includes(a)){ ar.push(a); sa[a] = sa[a] || []; } });
        Object.entries(cache.subAreas || {}).forEach(([a, subs]) => {
          sa[a] = sa[a] || []; subs.forEach(s => { if(s && !sa[a].includes(s)) sa[a].push(s); });
        });
      }
      setAreas(ar); setSubAreas(sa);

      /* Project identity: prefer local cache, else sheet */
      const sheetProj = await loadProject();
      setProject(readCache(PROJ_CACHE) || sheetProj);

      /* Manpower roles: sheet, then local cache, else defaults */
      const sheetRoles = await loadRoles();
      const cachedRoles = readCache(ROLES_CACHE);
      setRoleGroups(cachedRoles || sheetRoles || DEFAULT_ROLE_GROUPS);

      setBooting(false);
    })();
  }, []);

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(""), 2600); };
  const openCount = engIssues.filter(e => (e.status || "open") === "open").length;

  /* ── Login ── */
  const handleLogin = () => {
    if(!loginName){ setLoginErr("Please select your name."); return; }
    if(String(users[loginName]).trim() === String(loginPw).trim()){
      const s = { name:loginName, isAdmin:loginName.toLowerCase()===ADMIN_USER.toLowerCase(), isGuest:loginName.toLowerCase()===GUEST_USER.toLowerCase() };
      setSession(s); setLoginErr(""); setTab(s.isGuest ? "summary" : "report");
    } else { setLoginErr("Incorrect password."); setLoginPw(""); }
  };
  const signOut = () => { setSession(null); setLoginName(""); setLoginPw(""); setTab("report"); setSheet(null); };

  /* ── Data writes (Sheets) ── */
  const submitReports = async (entries) => { setReports(p => [...entries, ...p]); await sappend(STORAGE_KEY, entries); };
  const deleteReport  = async (id) => { setReports(p => p.filter(r => r.id !== id)); await sdelete(STORAGE_KEY, id); };
  const submitTargets = async (entries) => { setTargets(p => [...entries, ...p]); await sappend(TARGETS_KEY, entries); };
  const submitWeekly = async (row) => { setWeeklyTargets(p => [row, ...p]); await sappend(WEEKLY_KEY, [row]); };
  const submitEng     = async (entries) => { setEngIssues(p => [...entries, ...p]); await sappend(ENG_KEY, entries); };
  const toggleEng     = async (id) => {
    const issue = engIssues.find(e => e.id === id); if(!issue) return;
    const status = (issue.status || "open") === "resolved" ? "open" : "resolved";
    const resolvedAt = status === "resolved" ? fmtForSheet() : "";
    setEngIssues(p => p.map(e => e.id === id ? { ...e, status, resolvedAt } : e));
    await supdateStatus(id, status, resolvedAt);
  };
  const updatePunch = async (code, fields) => {
    const out = { ...fields };
    if(fields.Status === "Closed"){ out.ClosedAt = fmtForSheet(); out.ClosedBy = session.name; }
    if(fields.Status === "Open"){ out.ClosedAt = ""; out.ClosedBy = ""; }
    setPunches(p => p.map(x => String(PF(x, ["Code","code","CODE"])) === String(code) ? { ...x, ...out } : x));
    await gasUpdate(PUNCH_KEY, "Code", code, out);
  };

  /* ── Team management → Users sheet ── */
  const persistUsers = (next) => { setUsers(next); sset(USERS_KEY, next); };
  const addSup = (name, pw) => {
    setSupervisors(p => p.includes(name) ? p : [...p, name]);
    persistUsers({ ...users, [name]: pw });
  };
  const removeSup = (name) => {
    if(name === ADMIN_USER) return;
    setSupervisors(p => p.filter(s => s !== name));
    const c = { ...users }; delete c[name]; persistUsers(c);
  };
  const renameSup = (oldN, newN) => {
    setSupervisors(p => p.map(s => s === oldN ? newN : s));
    const c = { ...users }; c[newN] = c[oldN]; delete c[oldN]; persistUsers(c);
  };
  const editSup = (oldN, newN, newPw) => {
    const finalN = (newN && newN.trim()) ? newN.trim() : oldN;
    setSupervisors(p => p.map(s => s === oldN ? finalN : s));
    const c = { ...users };
    const pw = (newPw !== undefined && String(newPw).trim() !== "") ? newPw : (c[oldN] || "");
    if(finalN !== oldN) delete c[oldN];
    c[finalN] = pw;
    persistUsers(c);
  };
  const setPassword = (name, pw) => persistUsers({ ...users, [name]: pw });

  /* ── Area / sub-area management → Areas sheet + cache ── */
  const applyAreas = (nextAreas, nextSubs) => {
    setAreas(nextAreas); setSubAreas(nextSubs);
    writeCache(AREAS_CACHE, { areas:nextAreas, subAreas:nextSubs });
    saveAreas(nextAreas, nextSubs);
  };
  const addArea = (a) => { if(areas.includes(a)) return; applyAreas([...areas, a], { ...subAreas, [a]: subAreas[a] || [] }); };
  const removeArea = (a) => { const s = { ...subAreas }; delete s[a]; applyAreas(areas.filter(x => x !== a), s); };
  const renameArea = (oldA, newA) => {
    const s = { ...subAreas }; if(s[oldA]){ s[newA] = s[oldA]; delete s[oldA]; }
    applyAreas(areas.map(x => x === oldA ? newA : x), s);
  };
  const addSubArea = (area, sa) => {
    const nextA = areas.includes(area) ? areas : [...areas, area];
    applyAreas(nextA, { ...subAreas, [area]: [...(subAreas[area] || []), sa] });
  };
  const removeSubArea = (area, sa) => applyAreas(areas, { ...subAreas, [area]: (subAreas[area] || []).filter(x => x !== sa) });
  const importAreaMap = (pairs) => {
    const a = [...areas], s = { ...subAreas };
    pairs.forEach(([ar, sa]) => {
      if(!ar) return;
      if(!a.includes(ar)) a.push(ar);
      s[ar] = [...(s[ar] || [])];
      if(sa && !s[ar].includes(sa)) s[ar].push(sa);
    });
    applyAreas(a, s);
  };

  /* ── Project identity → Settings sheet + cache ── */
  const updateProject = (obj) => { setProject(obj); writeCache(PROJ_CACHE, obj); saveProject(obj); };

  /* ── Manpower roles → Roles sheet + cache ── */
  const applyRoles = (next) => { setRoleGroups(next); writeCache(ROLES_CACHE, next); saveRoles(next); };
  const addRole = (groupId, label) => {
    const lab = label.trim(); if(!lab) return;
    const existing = new Set(allRoles(roleGroups).map(r => r.key));
    let key = roleSlug(lab); while(existing.has(key)) key += "_" + Math.random().toString(36).slice(2,4);
    applyRoles(roleGroups.map(g => g.id === groupId ? { ...g, roles:[...g.roles, { key, label:lab }] } : g));
  };
  const removeRole = (groupId, key) =>
    applyRoles(roleGroups.map(g => g.id === groupId ? { ...g, roles:g.roles.filter(r => r.key !== key) } : g));
  const renameRole = (groupId, key, label) => {
    const lab = label.trim(); if(!lab) return;
    applyRoles(roleGroups.map(g => g.id === groupId ? { ...g, roles:g.roles.map(r => r.key === key ? { ...r, label:lab } : r) } : g));
  };

  /* ── Boot splash ── */
  if(booting){
    return <div className="boot"><div className="spin" /><div>{t("Loading site data…")}</div></div>;
  }

  /* ── Login ── */
  if(!session){
    const loginUsers = [GUEST_USER, ...supervisors.slice().sort((a, b) => a.localeCompare(b))];
    return (
      <div className="login">
        {!online && <div className="offline-bar">{t("No internet — changes won\u2019t be saved")}</div>}
        <button className="lang-corner" onClick={toggleLang}>{lang === "tr" ? "TR" : "EN"}</button>
        <div className="lg-top">
          <div className="lg-logo"><Icon name="flame" size={36} color="#fff" /></div>
          <div className="lg-title" style={{marginBottom:4, fontSize:40, fontWeight:900, letterSpacing:"-.03em"}}>{project.name}</div>
          <div className="lg-kicker" style={{letterSpacing:".2em", fontSize:10.5}}>{project.kicker}</div>
          <div className="lg-tag" style={{fontSize:11.5}}>{t("Daily Manpower, Targets, Site Follow Up & Engineering Issues")}</div>
        </div>
        <div className="lg-card">
          <h3>{t("Sign in")}</h3>
          <p>{t("Select your name and enter your password.")}</p>
          {loginErr && <div className="alert">{loginErr}</div>}
          <div className="field">
            <label className="label">{t("Name")}</label>
            <select className="select" value={loginName} autoComplete="off" onChange={e => { setLoginName(e.target.value); setLoginErr(""); }}>
              <option value="">{t("— Select —")}</option>
              {loginUsers.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">{t("Password")}</label>
            <input type="password" className="input" value={loginPw} autoComplete="new-password"
              onChange={e => { setLoginPw(e.target.value); setLoginErr(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder={t("Enter your password")} />
          </div>
          <button className="btn btn-primary btn-block" onClick={handleLogin}>{t("Sign in →")}</button>
        </div>
      </div>
    );
  }

  /* ── Nav items by role ── */
  const navItems = session.isGuest
    ? [
        { id:"target",      label:t("Target"),  icon:"target" },
        { id:"engineering", label:t("Issues"),  icon:"eng", badge:openCount },
        { id:"summary",     label:t("Summary"), icon:"summary" },
        { id:"punch",       label:t("Punch"),   icon:"check" },
      ]
    : [
        { id:"report",      label:t("Report"),  icon:"report" },
        { id:"target",      label:t("Target"),  icon:"target" },
        { id:"engineering", label:t("Issues"),  icon:"eng", badge:openCount },
        { id:"punch",       label:t("Punch"),   icon:"check" },
        { id:"summary",     label:t("Summary"), icon:"summary" },
        { id:"chat",        label:t("Chat"),    icon:"chat" },
      ];
  if(session.isAdmin) navItems.push({ id:"admin", label:t("Administration"), icon:"settings" });

  return (
    <div className="app">
      <TopBar session={session} project={project} openCount={openCount} lang={lang} onLang={toggleLang} onAbout={()=>setSheet("about")}
        onProfile={() => setSheet("profile")}
        onRecords={() => setTab("records")}
        onBell={() => setTab("engineering")} />

      <Flash msg={flash} />
      {!online && <div className="offline-bar">{t("No internet — changes won\u2019t be saved")}</div>}

      <div className="screen" key={tab}>
        <ScreenGuard tab={tab} lang={lang}>
        {tab === "report" && (
          <ReportScreen session={session} reports={reports} supervisors={supervisors}
            areas={areas} subAreas={subAreas} roleGroups={roleGroups} onAddSubArea={addSubArea}
            onSubmit={submitReports} onDelete={deleteReport} showFlash={showFlash} />
        )}
        {tab === "target" && (
          <TargetScreen session={session} reports={reports} supervisors={supervisors}
            areas={areas} targets={targets} weeklyTargets={weeklyTargets} roleGroups={roleGroups}
            onSubmit={submitTargets} onSubmitWeekly={submitWeekly} showFlash={showFlash} />
        )}
        {tab === "engineering" && (
          <EngScreen session={session} engIssues={engIssues}
            areas={areas} subAreas={subAreas} onAddSubArea={addSubArea}
            onSubmit={submitEng} onToggle={toggleEng} showFlash={showFlash} />
        )}
        {tab === "punch" && (
          <PunchScreen session={session} punches={punches} onUpdate={updatePunch} />
        )}
        {tab === "summary" && (
          <SummaryScreen session={session} reports={reports} targets={targets}
            engIssues={engIssues} roleGroups={roleGroups} onToggle={toggleEng} />
        )}
        {tab === "chat" && (
          <ChatScreen session={session} supervisors={supervisors} project={project} />
        )}
        {tab === "records" && session.isAdmin && (
          <RecordsScreen session={session} reports={reports} targets={targets} engIssues={engIssues}
            supervisors={supervisors} areas={areas} subAreas={subAreas} users={users} project={project} roleGroups={roleGroups}
            onToggle={toggleEng} onDeleteReport={deleteReport}
            onAddSup={addSup} onRemoveSup={removeSup} onRenameSup={renameSup} onEditSup={editSup} onSetPw={setPassword}
            onAddArea={addArea} onRemoveArea={removeArea} onRenameArea={renameArea}
            onAddSubArea={addSubArea} onRemoveSubArea={removeSubArea} onImportAreaMap={importAreaMap}
            onUpdateProject={updateProject}
            onAddRole={addRole} onRemoveRole={removeRole} onRenameRole={renameRole} showFlash={showFlash} />
        )}
        {tab === "admin" && session.isAdmin && (
          <RecordsScreen session={session} reports={reports} targets={targets} engIssues={engIssues}
            supervisors={supervisors} areas={areas} subAreas={subAreas} users={users} project={project} roleGroups={roleGroups}
            adminOnly={true}
            onToggle={toggleEng} onDeleteReport={deleteReport}
            onAddSup={addSup} onRemoveSup={removeSup} onRenameSup={renameSup} onEditSup={editSup} onSetPw={setPassword}
            onAddArea={addArea} onRemoveArea={removeArea} onRenameArea={renameArea}
            onAddSubArea={addSubArea} onRemoveSubArea={removeSubArea} onImportAreaMap={importAreaMap}
            onUpdateProject={updateProject}
            onAddRole={addRole} onRemoveRole={removeRole} onRenameRole={renameRole} showFlash={showFlash} />
        )}
        </ScreenGuard>
      </div>

      <BottomNav tab={tab} setTab={setTab} items={navItems} />

      {sheet === "about" && (
        <Sheet onClose={() => setSheet(null)}>
          <div style={{ textAlign:"center", padding:"6px 6px 14px" }}>
            <div style={{ width:66, height:66, margin:"2px auto 16px", borderRadius:19, background:"linear-gradient(150deg,#FF8A33,#E0322E)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 24px rgba(224,50,46,.42)" }}>
              <Icon name="flame" size={34} color="#fff" />
            </div>
            <div style={{ fontSize:26, fontWeight:800, letterSpacing:"-.02em" }}>SECOSYS</div>
            <div style={{ fontSize:12.5, color:"var(--accent)", fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", marginTop:5 }}>Create an Ecosystem</div>
            <div style={{ fontSize:14, color:"var(--text-2)", marginTop:16 }}>Created by <strong style={{ color:"var(--text)" }}>Serkan Dölen</strong></div>
            <div style={{ marginTop:18, padding:"16px 0 4px", borderTop:"1px solid var(--border)" }}>
              <img alt="QR" width="150" height="150" style={{ borderRadius:12, border:"1px solid var(--border)" }}
                src={"https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=" + encodeURIComponent(window.location.origin + window.location.pathname)} />
              <div style={{ fontSize:12, color:"var(--text-3)", marginTop:10 }}>{t("Scan to open the app")}</div>
            </div>
            <div style={{ fontSize:11, color:"var(--text-3)", marginTop:8 }}>{APP_VERSION}</div>
          </div>
        </Sheet>
      )}

      {sheet === "profile" && (
        <Sheet onClose={() => setSheet(null)}>
          <div style={{ display:"flex", alignItems:"center", gap:13, padding:"6px 6px 16px" }}>
            <Avatar name={session.name} size={52} />
            <div>
              <div style={{ fontSize:18, fontWeight:700 }}>{session.name}</div>
              <div style={{ fontSize:12, color:"var(--text-2)" }}>
                {session.isAdmin ? t("Administrator") : session.isGuest ? t("Guest · view only") : t("Site Supervisor")}
              </div>
            </div>
          </div>
          {session.isAdmin && (
            <div className="s-row" onClick={() => { setTab("records"); setSheet(null); }}>
              <div className="s-ico"><Icon name="records" size={19} /></div> {t("Records & exports")}
            </div>
          )}
          <div className="s-row danger" onClick={signOut}>
            <div className="s-ico"><Icon name="logout" size={19} /></div> {t("Sign out")}
          </div>
        </Sheet>
      )}
    </div>
  );
}


/* ---- Mount ---- */
window.addEventListener("error", function(e){
  try{
    var root = document.getElementById("root");
    if(root && (!root.firstChild || root.innerHTML.length < 40)){
      root.innerHTML = "<div style='padding:30px 22px;font-family:sans-serif;color:#16202E'>"
        + "<div style='font-size:30px'>⚠️</div>"
        + "<div style='font-weight:700;margin:8px 0'>Bir hata oluştu / An error occurred</div>"
        + "<div style='font-size:12px;color:#777;word-break:break-word'>" + String(e.message||e.error||e) + "</div>"
        + "<div style='font-size:11px;color:#aaa;margin-top:10px'>" + String((e.error&&e.error.stack||"")).slice(0,400) + "</div>"
        + "<button onclick='location.reload()' style='margin-top:16px;padding:10px 18px;border:none;border-radius:8px;background:#E0322E;color:#fff;font-weight:700'>Yeniden yükle</button></div>";
    }
  }catch(_){}
});
window.addEventListener("unhandledrejection", function(e){ console.error("unhandled:", e.reason); });
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
setTimeout(function(){
  var bs = document.getElementById("boot-splash");
  if(bs){ bs.style.opacity = "0"; setTimeout(function(){ bs.remove(); }, 400); }
}, 300);