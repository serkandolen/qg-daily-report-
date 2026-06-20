# Kurulum — SECOSYS (yeni tasarım)

Bütün uygulama **tek dosyada**: `main.jsx`.
Bu dosya, repo'ndaki **eski `main.jsx`'in yerine geçer.** Başka hiçbir şeye
dokunmana gerek yok — CSS, font, ekranlar, backend bağlantısı hepsi içinde.

Repo: `serkandolen/qg-daily-report-`  ·  Canlı: `qg-daily-report.vercel.app`

---

## ADIM 1 — `main.jsx`'i GitHub'a yükle (eskisinin üstüne)

1. GitHub'da repo'na gir: **github.com/serkandolen/qg-daily-report-**
2. Sağ üstte yeşil **`Add file`** → **`Upload files`** tıkla.
3. Bu klasördeki **`main.jsx`** dosyasını sürükle-bırak.
   (Aynı isimde olduğu için eskisinin üstüne yazılacak — doğru olan bu.)
4. Aşağıda **`Commit changes`** (yeşil buton) tıkla.
5. Bitti. **Vercel otomatik olarak** 1-2 dakika içinde yeni sürümü yayınlar.
   `qg-daily-report.vercel.app` adresini açıp yeni tasarımı göreceksin.

> Not: Sadece `main.jsx`'i yükle. `index.html`, `package.json`, `vite.config.js`
> dosyalarına **dokunma**, oldukları gibi kalsınlar.

---

## ADIM 2 — Google Sheet'ine yeni sekmeleri ekle

Uygulamanın bağlı olduğu Google E-Tablo'yu aç ve alt taraftan **3 yeni sayfa
(sekme)** ekle. İsimler **birebir** böyle olmalı (büyük/küçük harf önemli):

**Sekme adı: `Areas`** — 1. satıra başlıkları yaz:

| area | subArea |
|------|---------|
| North-A | PR-01 |
| North-A | PR-02 |
| SLC | PR-04 |
| South | Unit-2 |

**Sekme adı: `Settings`** — 1. satıra başlıkları yaz:

| key | value |
|-----|-------|
| name | SECOSYS |
| kicker | SECO System |
| company | SECO System |

**Sekme adı: `Roles`** — 1. satıra başlıkları yaz (manpower rolleri):

| group | key | label | order |
|-------|-----|-------|-------|
| direct | welder | Welder | 0 |
| direct | pipeFitter | Pipe Fitter | 1 |
| indirect | foreman | Foreman | 0 |
| support | scaffolder | Scaffolder | 0 |

> `group` sadece şu üçünden biri olabilir: **direct · indirect · support**.
> `key` boşluksuz benzersiz bir kimliktir (uygulama yeni rol eklerken otomatik
> üretir). Bu sekmeyi boş bırakırsan uygulama varsayılan rol listesini kullanır.

### `Reports` sekmesine eklenecek kolonlar (manpower rolleri)

Mevcut `Reports` sekmesindeki başlıkların **sağına** şu kolonları ekle (sıra
önemli değil, Apps Script isimle eşler). Eski `welder`, `pipeFitter`,
`totalManpower` kolonları **kalsın** — eski kayıtlar bozulmaz.

```
fitterHelper · rigger · grinder · gasCutter · hydrotestCrew · greLaminator ·
foreman · supervisorRole · fieldEngineer · qcInspector · hseOfficer ·
scaffolder · craneOperator · helperLabour ·
directTotal · indirectTotal · supportTotal
```

> Projeye özel yeni roller eklersen (Manage → Manpower roles), uygulama o rolün
> `key`'ini de Reports'a yazmaya çalışır; Apps Script başlık satırına otomatik
> kolon ekliyorsa bir şey yapmana gerek yok, eklemiyorsa o `key`'i başlık olarak
> elle ekle.

> Elle doldurmak zorunda değilsin: uygulama açıldıktan sonra **admin (Serkan)**
> olarak girip **Records → ⚙ Manage** ekranından alanları, alt-alanları, **rolleri**
> ve proje adını yönetebilirsin; uygulama bu sekmelere kendi yazar. Sadece **boş
> sekmeleri başlık satırıyla açman yeterli.**

---

## ADIM 3 — Apps Script kontrolü (muhtemelen gerek yok)

Uygulama, yeni sekmelere de **şu an kullandığın aynı komutlarla** (`get`,
`append`, `set`, `delete`, `update_status`) bağlanır — sadece `tab=Areas`,
`tab=Settings` ve `tab=Roles` ekler.

Apps Script kodun sekmeyi `getSheetByName(e.parameter.tab)` ile genel olarak
buluyorsa **hiçbir şey değiştirmen gerekmez** — 2 sekmeyi açtığın an çalışır.

Emin değilsen: Apps Script kodunu (script editöründeki `doGet` fonksiyonu)
bana gönder, kontrol edeyim.

---

## Giriş bilgileri

- **Serkan** / `643844` → Yönetici (tüm yetkiler + Records)
- Diğer supervisor'lar → kendi şifreleriyle (Users sekmesindeki)
- **Guest** / `guest01` → sadece görüntüleme

## Yeni neler var

- Temiz kurumsal açık tema, mobil öncelikli, alt sekme menüsü, büyük dokunma alanları
- Supervisor ekle/sil/yeniden adlandır/şifre → **Records → Manage** (Users sekmesine yazar)
- Area → Sub-Area bağlantısı (alan seçince alt-alan filtreli; yazarak yeni de eklenir)
- Excel'den toplu Area/Sub-Area içe aktarma
- Manpower artık **Direct / Indirect / Support** gruplarında, her rol için ayrı
  sayı (tablo gibi: rol alt alta, yanında sayı kutusu)
- **Roller projeye göre düzenlenebilir** → Records → Manage → Manpower roles
  (ekle/sil/yeniden adlandır, `Roles` sekmesine yazar)
- Proje kimliği düzenlenebilir (her projeye uyarlanır) — marka: **SECOSYS**
- Silinen kişi/alan/rolün eski kayıtları korunur

## Notlar (eskisiyle aynı)

- Mühendislik fotoğrafları sadece oturum içinde tutulur (mevcut `append`'in
  fotoğrafı sheet'e yazmadan çıkarıyor — değiştirmedim).
- Chat 5 saniyede bir yenilenir.
- Şifreler Users sekmesinde düz metin (iç ekip aracı için uygun).
