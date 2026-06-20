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
    + ".login{ background:linear-gradient(180deg,#0b1f29 0%,#0E4D64 44%,#0d5570 100%)!important; }"
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
    + ".punch-no{ font-size:13px; font-weight:800; color:var(--accent); background:var(--accent-soft); border-radius:6px; padding:2px 8px; letter-spacing:.02em; }";
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
      const merged = { ...DEFAULT_PASSWORDS };
      if(Array.isArray(data) && data.length) data.forEach(r => { if(r.name) merged[r.name] = r.password; });
      return merged;
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

/* ─────────── Empty form factories ─────────── */
const emptyForm   = (sup="", groups) => ({ date:todayStr(), supervisor:sup, area:"", subArea:"", man:blankMan(groups), jobDescription:"" });
const emptyTarget = (sup="") => ({ date:todayStr(), supervisor:sup, area:"", weldTarget:"", fitUpTarget:"", tpCompletion:"" });
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
  "Status":"Durum", "Add photo":"Fotoğraf ekle", "Change photo":"Fotoğrafı değiştir", "Save":"Kaydet", "Show more":"Daha fazla göster",
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
function TargetScreen({ session, reports, supervisors, areas, roleGroups, onSubmit, showFlash }){
  const [form, setForm] = useState(emptyTarget(session.name));
  const [staged, setStaged] = useState([]);
  const [err, setErr] = useState("");
  const st = (k,v) => setForm(p=>({ ...p, [k]:v }));

  const add = () => {
    if(!form.date || !form.supervisor || !form.area){ setErr("Please fill Date, Supervisor and Area."); return; }
    setErr("");
    setStaged(p => [...p, { id:makeId("T"), ...form,
      weldTarget:form.weldTarget||"-", fitUpTarget:form.fitUpTarget||"-", tpCompletion:form.tpCompletion||"-" }]);
    setForm(p => ({ ...p, area:"", weldTarget:"", fitUpTarget:"", tpCompletion:"" }));
  };
  const submit = () => {
    if(!staged.length) return;
    if(typeof navigator !== "undefined" && !navigator.onLine){ showFlash("⚠ " + t("No internet — not saved")); return; }
    onSubmit(staged.map(e=>({ ...e, submittedAt:fmtForSheet() })));
    setStaged([]);
    showFlash(`${staged.length} ${staged.length===1?"target":"targets"} submitted`);
  };

  const areaReports = form.area ? reports.filter(r=>r.date===form.date && r.area===form.area) : [];
  const aDir = areaReports.reduce((s,r)=>s+manStats(r, roleGroups).direct,0);
  const aTot = areaReports.reduce((s,r)=>s+manStats(r, roleGroups).total,0);
  const aSup = [...new Set(areaReports.map(r=>r.supervisor))].join(", ") || "—";

  return (
    <div>
      <h1 className="page-title">{t("Set Targets")}</h1>
      <p className="page-sub">{t("Welding, fit-up & TP targets per area.")}</p>

      {staged.length > 0 && (
        <div className="pending" style={{ borderColor:"var(--info)" }}>
          <div className="ph">
            <span className="ph-label" style={{ color:"var(--info)" }}>⏳ Pending <span className="count-pill" style={{background:"var(--info)"}}>{staged.length}</span></span>
            <button className="btn btn-success btn-sm" onClick={submit}><Icon name="check" size={14}/> {t("Submit all")}</button>
          </div>
          {staged.map(e => (
            <div className="staged-row" key={e.id}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <span className="chip area">{e.area}</span>
                  <span style={{fontSize:12,color:"var(--info)",fontWeight:600}}>Weld {e.weldTarget}″ · Fit {e.fitUpTarget}″ · {e.tpCompletion} TP</span>
                </div>
              </div>
              <button className="x" onClick={()=>setStaged(p=>p.filter(x=>x.id!==e.id))}><Icon name="x" size={13}/></button>
            </div>
          ))}
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
            {areaReports.length===0 && <div style={{gridColumn:"1/-1",fontSize:11.5,color:"var(--text-3)"}}>No manpower submitted for {form.area} yet.</div>}
          </div>
        )}

        <div className="subpanel">
          <div className="sp-title" style={{color:"var(--info)"}}><Icon name="target" size={14}/> {t("Targets for this area")}</div>
          <div className="grid-3">
            <div><label className="label">{t("Welding ″")}</label><input type="number" min="0" step="0.1" inputMode="decimal" className="input" value={form.weldTarget} onChange={e=>st("weldTarget",e.target.value)} placeholder="24" /></div>
            <div><label className="label">{t("Fit-Up ″")}</label><input type="number" min="0" step="0.1" inputMode="decimal" className="input" value={form.fitUpTarget} onChange={e=>st("fitUpTarget",e.target.value)} placeholder="36" /></div>
            <div><label className="label">{t("TP No.")}</label><input type="number" min="0" step="1" inputMode="numeric" className="input" value={form.tpCompletion} onChange={e=>st("tpCompletion",e.target.value)} placeholder="5" /></div>
          </div>
        </div>

        <button className="btn btn-outline btn-block" style={{ color:"var(--info)", borderColor:"var(--info)" }} onClick={add}><Icon name="plus" size={16}/> {t("Add target")}</button>
        {staged.length > 0 && <button className="btn btn-success btn-block" onClick={submit}><Icon name="check" size={16}/> {tn("submitTargets", staged.length)}</button>}
      </div>
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
            <button className="btn btn-success btn-block" style={{ marginTop:12 }} disabled={!dirty} onClick={save}><Icon name="check" size={15}/> {t("Save")}</button>
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
  const open = items.filter(p => p.status === "Open").length;
  const closed = items.filter(p => p.status === "Closed").length;

  const cats = [...new Set(items.map(p => p.category))].sort();
  const punchAreas = [...new Set(items.map(p => p.area).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b), undefined, { numeric:true }));
  const groupKey = groupBy === "category" ? "category" : "subsystem";
  const groups = {};
  items.forEach(p => {
    const k = p[groupKey] || "—";
    if(!groups[k]) groups[k] = { open:0, closed:0, total:0 };
    groups[k].total++; groups[k][p.status === "Closed" ? "closed" : "open"]++;
  });
  const groupRows = Object.entries(groups).sort((a,b)=>b[1].total-a[1].total);

  const ql = q.trim().toLowerCase();
  const list = items.filter(p =>
    (filter === "all" || p.status.toLowerCase() === filter) &&
    (cat === "all" || p.category === cat) &&
    (area === "all" || p.area === area) &&
    (!ql || (p.code+" "+p.ssDesc+" "+p.description+" "+p.subsystem+" "+p.area).toLowerCase().includes(ql))
  );

  return (
    <div>
      <h1 className="page-title">{t("Punch Closure")}</h1>
      <p className="page-sub">{t("Punch list status & closure tracking.")}</p>

      <div className="stat-row" style={{ gridTemplateColumns:"repeat(3,1fr)", marginBottom:14 }}>
        <Stat label={t("Open")} value={open} tone="danger" />
        <Stat label={t("Closed")} value={closed} tone="primary" />
        <Stat label={t("Total")} value={items.length} tone="accent" />
      </div>

      {items.length > 0 && (
        <div className="card pad" style={{ marginBottom:14 }}>
          <div className="section-head">
            <span className="bar"/><span className="st">{t("Summary")}</span>
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
                  <td className="num" style={{ color:"var(--accent)" }}>{items.length}</td>
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
            {punchAreas.length > 1 && (
              <select className="select" style={{ width:"auto", minHeight:38, padding:"6px 30px 6px 12px", fontSize:13 }} value={area} onChange={e=>setArea(e.target.value)}>
                <option value="all">{t("All")} ({t("Area")})</option>
                {punchAreas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}
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
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>{["Area","Sup.","Weld","Fit","TP"].map(h=><th key={h} className={h==="Area"||h==="Sup."?"":"num"}>{h}</th>)}</tr></thead>
              <tbody>
                {dayTargets.map(t => (
                  <tr key={t.id}>
                    <td><span className="chip area">{t.area}</span></td>
                    <td style={{ fontSize:12, color:"var(--text-2)" }}>{t.supervisor}</td>
                    <td className="num" style={{ color:"var(--info)", fontWeight:700 }}>{t.weldTarget!=="-"?t.weldTarget+"″":"—"}</td>
                    <td className="num" style={{ color:"var(--info)", fontWeight:700 }}>{t.fitUpTarget!=="-"?t.fitUpTarget+"″":"—"}</td>
                    <td className="num" style={{ color:"var(--info)", fontWeight:700 }}>{t.tpCompletion!=="-"?t.tpCompletion:"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
  onToggle, onDeleteReport, onAddSup, onRemoveSup, onRenameSup, onSetPw,
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
    if(!nn || nn===name) { setNameEdit(s=>({ ...s, [name]:undefined })); return; }
    if(supervisors.includes(nn)) { showFlash(`"${nn}" already exists`); return; }
    onRenameSup(name, nn); setNameEdit(s=>{ const c={...s}; delete c[name]; return c; }); showFlash(`Renamed to ${nn}`);
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
            <select className="select" value={fSup} onChange={e=>setFSup(e.target.value)}><option>All</option>{supervisors.map(s=><option key={s}>{s}</option>)}</select>
          </div>
          <div className="field" style={{ marginBottom:10 }}>
            <label className="label">Area</label>
            <select className="select" value={fArea} onChange={e=>setFArea(e.target.value)}><option>All</option>{areas.map(a=><option key={a}>{a}</option>)}</select>
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
            <button className="btn btn-ghost btn-sm right" onClick={()=>csv(fTargets,["Date","Supervisor","Area","Welding","Fit-Up","TP"],r=>[r.date,r.supervisor,r.area,r.weldTarget,r.fitUpTarget,r.tpCompletion],"Targets")}><Icon name="download" size={14}/> CSV</button>
          </div>
          {fTargets.length===0 ? <div className="empty"><div className="ee">🔍</div>No targets found.</div> :
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr>{["Date","Sup.","Area","Weld","Fit","TP"].map(h=><th key={h} className={["Weld","Fit","TP"].includes(h)?"num":""}>{h}</th>)}</tr></thead>
                <tbody>{fTargets.map(t=>(
                  <tr key={t.id}>
                    <td style={{ color:"var(--text-2)", fontSize:12 }}>{String(t.date||"").slice(5)}</td>
                    <td style={{ fontWeight:600 }}>{t.supervisor}</td>
                    <td><span className="chip area">{t.area}</span></td>
                    <td className="num" style={{ color:"var(--info)", fontWeight:700 }}>{t.weldTarget!=="-"?t.weldTarget+"″":"—"}</td>
                    <td className="num" style={{ color:"var(--info)", fontWeight:700 }}>{t.fitUpTarget!=="-"?t.fitUpTarget+"″":"—"}</td>
                    <td className="num" style={{ color:"var(--info)", fontWeight:700 }}>{t.tpCompletion!=="-"?t.tpCompletion:"—"}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>}
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
                      ? <input className="input" style={{ minHeight:40, fontSize:14 }} autoFocus value={nameEdit[name]}
                          onChange={e=>setNameEdit(s=>({ ...s, [name]:e.target.value }))}
                          onKeyDown={e=>e.key==="Enter"&&saveRename(name)} />
                      : <div style={{ fontSize:15, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                          {name} {isAdmin && <span className="pill" style={{ background:"var(--accent-soft)", color:"var(--accent)" }}>Admin</span>}
                        </div>}
                    <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2 }}>Password: <code>{users[name]||"—"}</code></div>
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
  const APP_VERSION = "v2026.06.20 · build 22";
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
    ? [{ id:"summary", label:t("Summary"), icon:"summary" }, { id:"punch", label:t("Punch"), icon:"check" }]
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
            areas={areas} roleGroups={roleGroups} onSubmit={submitTargets} showFlash={showFlash} />
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
            onAddSup={addSup} onRemoveSup={removeSup} onRenameSup={renameSup} onSetPw={setPassword}
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
            onAddSup={addSup} onRemoveSup={removeSup} onRenameSup={renameSup} onSetPw={setPassword}
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