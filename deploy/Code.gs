/* ============================================================
   SECOSYS — Google Apps Script backend (Code.gs)
   QG_EPC04_DailyReport · SECO System
   ------------------------------------------------------------
   Bu kod, bağlı olduğu Google Sheet'i okur/yazar.
   main.jsx şu komutları GET ile çağırır:
     action=get          → bir sekmenin tüm satırlarını döndürür
     action=append       → satır(lar) ekler
     action=set          → sekmeyi temizleyip yeniden yazar
     action=delete       → id ile satır siler
     action=update_status→ Engineering durumunu günceller
   Eksik sekmeyi otomatik oluşturur.
   ============================================================ */

function doGet(e) {
  return handle(e);
}
function doPost(e) {
  return handle(e);
}

function handle(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  var action = p.action || "";
  var tab = p.tab || "";
  var result;

  try {
    if (action === "get") {
      result = readRows(getSheet(tab));
    } else if (action === "append") {
      appendRows(getSheet(tab), JSON.parse(p.data || "[]"));
      result = { ok: true };
    } else if (action === "set") {
      setRows(getSheet(tab), JSON.parse(p.data || "[]"));
      result = { ok: true };
    } else if (action === "delete") {
      deleteById(getSheet(tab), p.id);
      result = { ok: true };
    } else if (action === "update_status") {
      updateStatus(getSheet(tab), p.id, p.status, p.resolvedAt || "");
      result = { ok: true };
    } else {
      result = { error: "unknown action: " + action };
    }
  } catch (err) {
    result = { error: String(err) };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---- helpers ---- */
function ss() {
  return SpreadsheetApp.getActiveSpreadsheet();
}
function getSheet(name) {
  var s = ss().getSheetByName(name);
  if (!s) s = ss().insertSheet(name);
  return s;
}

function readRows(sh) {
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var head = values[0];
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    // skip fully empty rows
    var empty = true;
    for (var c = 0; c < row.length; c++) { if (row[c] !== "" && row[c] !== null) { empty = false; break; } }
    if (empty) continue;
    var obj = {};
    for (var j = 0; j < head.length; j++) {
      if (head[j] === "" || head[j] === null) continue;
      obj[head[j]] = row[j];
    }
    out.push(obj);
  }
  return out;
}

function ensureHeaders(sh, keys) {
  if (sh.getLastRow() === 0) {
    sh.appendRow(keys);
  }
}

function appendRows(sh, rows) {
  if (!rows || !rows.length) return;
  var keys = Object.keys(rows[0]);
  ensureHeaders(sh, keys);
  var head = sh.getDataRange().getValues()[0];
  // add any missing header columns at the end
  for (var k = 0; k < keys.length; k++) {
    if (head.indexOf(keys[k]) === -1) {
      head.push(keys[k]);
      sh.getRange(1, head.length).setValue(keys[k]);
    }
  }
  for (var i = 0; i < rows.length; i++) {
    var o = rows[i];
    var line = [];
    for (var j = 0; j < head.length; j++) {
      var key = head[j];
      line.push(o[key] !== undefined && o[key] !== null ? o[key] : "");
    }
    sh.appendRow(line);
  }
}

function setRows(sh, rows) {
  sh.clearContents();
  if (!rows || !rows.length) return;
  var keys = Object.keys(rows[0]);
  sh.appendRow(keys);
  for (var i = 0; i < rows.length; i++) {
    var o = rows[i];
    var line = [];
    for (var j = 0; j < keys.length; j++) {
      line.push(o[keys[j]] !== undefined && o[keys[j]] !== null ? o[keys[j]] : "");
    }
    sh.appendRow(line);
  }
}

function deleteById(sh, id) {
  if (!id) return;
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return;
  var idIdx = values[0].indexOf("id");
  if (idIdx < 0) return;
  for (var i = values.length - 1; i >= 1; i--) {
    if (String(values[i][idIdx]) === String(id)) sh.deleteRow(i + 1);
  }
}

function updateStatus(sh, id, status, resolvedAt) {
  if (!id) return;
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return;
  var head = values[0];
  var idIdx = head.indexOf("id");
  var stIdx = head.indexOf("status");
  var raIdx = head.indexOf("resolvedAt");
  if (idIdx < 0) return;
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][idIdx]) === String(id)) {
      if (stIdx >= 0) sh.getRange(i + 1, stIdx + 1).setValue(status);
      if (raIdx >= 0) sh.getRange(i + 1, raIdx + 1).setValue(resolvedAt);
      return;
    }
  }
}
