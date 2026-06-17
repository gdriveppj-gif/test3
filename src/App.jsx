import { useState, useEffect } from "react";

const T = {
  navy: "#0D1F35", navyMid: "#152D4A", navyLight: "#1E4068", steel: "#2C5282",
  amber: "#F6A623", amberPale: "#FFF4DC", green: "#1DB97A", greenPale: "#E6F9F1",
  blue: "#2B7CE9", bluePale: "#E8F1FD", red: "#E53E3E",
  gray0: "#F4F6F9", gray1: "#E8ECF2", gray2: "#C8D0DC", gray3: "#8896A9", gray4: "#4A5568",
  white: "#FFFFFF", text: "#0D1F35",
};

const NOW = new Date();
const mkTime = (m) => new Date(NOW - m * 60000);
const fmtTime = (d) => d?.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) ?? "--:--";
const fmtDate = (d) => d?.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const durasi = (s, e) => { const m = Math.round(((e || new Date()) - s) / 60000); return m < 60 ? `${m} mnt` : `${Math.floor(m / 60)}j ${m % 60}m`; };

const MANIFESTS = [
  {
    id: "SJ-240617-001", noPol: "B 9821 TKL", driver: "Hendra Kusuma", asal: "DC Jakarta Utara", pic: "Andi W.",
    items: [
      { id: "a1", nama: "Beras Premium 5kg", qty: 200, sat: "Krg", ok: false },
      { id: "a2", nama: "Minyak Goreng 2L", qty: 150, sat: "Ktn", ok: false },
      { id: "a3", nama: "Gula Pasir 1kg", qty: 300, sat: "Sak", ok: false },
    ],
    status: "menunggu", tStart: null, tEnd: null, photos: [], note: "",
  },
  {
    id: "SJ-240617-002", noPol: "D 3312 BDG", driver: "Suwito Prayogo", asal: "DC Bandung", pic: "Rahmat H.",
    items: [
      { id: "b1", nama: "Tepung Terigu 25kg", qty: 80, sat: "Sak", ok: true },
      { id: "b2", nama: "Kopi Robusta 500gr", qty: 500, sat: "Pck", ok: false },
      { id: "b3", nama: "Teh Celup Kotak", qty: 200, sat: "Ktn", ok: false },
    ],
    status: "proses", tStart: mkTime(52), tEnd: null, photos: [], note: "",
  },
  {
    id: "SJ-240617-003", noPol: "L 7700 SBY", driver: "Pak Harto", asal: "DC Surabaya", pic: "Andi W.",
    items: [
      { id: "c1", nama: "Sabun Mandi 100gr", qty: 1000, sat: "Pcs", ok: true },
      { id: "c2", nama: "Sampo Sachet 10ml", qty: 2000, sat: "Pcs", ok: true },
      { id: "c3", nama: "Deterjen Bubuk 1kg", qty: 400, sat: "Pck", ok: true },
    ],
    status: "selesai", tStart: mkTime(180), tEnd: mkTime(75), photos: [
      { id: "p1", dataUrl: null, timestamp: mkTime(160), label: "Foto 1" },
      { id: "p2", dataUrl: null, timestamp: mkTime(100), label: "Foto 2" },
    ], note: "Semua barang kondisi baik.",
  },
  {
    id: "SJ-240617-004", noPol: "H 5543 SMG", driver: "Bambang S.", asal: "DC Semarang", pic: "Rahmat H.",
    items: [
      { id: "d1", nama: "Susu UHT Full Cream", qty: 600, sat: "Ktn", ok: false },
      { id: "d2", nama: "Yogurt Stroberi 200ml", qty: 300, sat: "Pcs", ok: false },
    ],
    status: "menunggu", tStart: null, tEnd: null, photos: [], note: "",
  },
];

const ME = { nama: "Siti Rahayu", role: "Supervisor Gudang", avatar: "SR" };

const STATUS_CFG = {
  menunggu: { label: "Menunggu",       dot: T.amber, bg: T.amberPale, col: "#A16000" },
  proses:   { label: "Sedang Bongkar", dot: T.blue,  bg: T.bluePale,  col: T.blue   },
  selesai:  { label: "Selesai",        dot: T.green, bg: T.greenPale, col: "#0E7A4F" },
};

const Ava = ({ label, size = 36, bg = T.navyLight }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontWeight: 800, fontSize: size * 0.33, flexShrink: 0 }}>{label}</div>
);

const Chip = ({ status }) => {
  const s = STATUS_CFG[status];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: s.bg, color: s.col, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />{s.label}</span>;
};

const Bar = ({ done, total, status }) => {
  const pct = total ? Math.round(done / total * 100) : 0;
  const col = status === "selesai" ? T.green : status === "proses" ? T.blue : T.gray2;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.gray3, marginBottom: 4 }}><span>{done} / {total} item diterima</span><b style={{ color: col }}>{pct}%</b></div>
      <div style={{ height: 6, borderRadius: 99, background: T.gray1 }}><div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: col, transition: "width .4s" }} /></div>
    </div>
  );
};

const Toast = ({ msg, type }) => (
  <div style={{ position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)", background: type === "warn" ? T.amber : type === "err" ? T.red : T.navy, color: type === "warn" ? T.navy : T.white, padding: "11px 22px", borderRadius: 99, fontSize: 13, fontWeight: 700, boxShadow: "0 6px 24px rgba(0,0,0,.28)", zIndex: 9999, whiteSpace: "nowrap" }}>{msg}</div>
);

const Modal = ({ children, onClose }) => (
  <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 800, display: "flex", alignItems: "flex-end" }}>
    <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: T.white, borderRadius: "22px 22px 0 0", padding: "24px 20px 32px", boxShadow: "0 -8px 40px rgba(0,0,0,.2)" }}>{children}</div>
  </div>
);

// ── Ambil foto via input file (fallback web + native via Capacitor)
async function ambilFoto() {
  // Coba pakai Capacitor Camera jika tersedia (saat jalan sebagai APK)
  try {
    const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");
    const image = await Camera.getPhoto({ quality: 85, allowEditing: false, resultType: CameraResultType.DataUrl, source: CameraSource.Camera });
    return image.dataUrl;
  } catch {
    // Fallback: pakai input file (saat jalan di browser biasa)
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.capture = "environment";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }
}

// ── Detail View ──────────────────────────────────────────────────────────────
function Detail({ mf, onBack, onUpdate, showToast }) {
  const [noteModal, setNoteModal] = useState(false);
  const [noteVal, setNoteVal] = useState(mf.note);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const doneCount = mf.items.filter(i => i.ok).length;
  const allDone = doneCount === mf.items.length;

  const toggleItem = (iid) => {
    if (mf.status === "menunggu") return;
    onUpdate({ items: mf.items.map(i => i.id === iid ? { ...i, ok: !i.ok } : i) });
  };

  const startBongkar = () => { onUpdate({ status: "proses", tStart: new Date() }); showToast("⏱  Waktu mulai dicatat", "ok"); };

  const takePhoto = async () => {
    const dataUrl = await ambilFoto();
    if (!dataUrl) return;
    const ts = new Date();
    onUpdate({ photos: [...mf.photos, { id: `ph_${Date.now()}`, dataUrl, timestamp: ts }] });
    showToast(`📷  Foto ${mf.photos.length + 1} disimpan · ${fmtTime(ts)}`, "ok");
  };

  const saveNote = () => { onUpdate({ note: noteVal }); setNoteModal(false); showToast("📝  Catatan disimpan", "ok"); };

  const finish = () => {
    if (!allDone) { showToast("⚠️  Checklist belum lengkap", "warn"); return; }
    if (mf.photos.length < 1) { showToast("⚠️  Minimal 1 foto wajib", "warn"); return; }
    onUpdate({ status: "selesai", tEnd: new Date() });
    showToast("✅  Bongkar muat selesai!", "ok");
    setTimeout(onBack, 900);
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: T.gray0, minHeight: "100vh", paddingBottom: 110 }}>
      <div style={{ background: `linear-gradient(160deg, ${T.navy} 0%, ${T.navyMid} 100%)`, padding: "18px 16px 28px", color: T.white }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.12)", border: "none", color: T.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, opacity: .55, letterSpacing: 1 }}>DETAIL MANIFEST</div>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{mf.id}</div>
          </div>
          <Chip status={mf.status} />
        </div>
        <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div><div style={{ fontSize: 10, opacity: .5, letterSpacing: 1 }}>NO POL</div><div style={{ fontSize: 18, fontWeight: 900, color: T.amber }}>{mf.noPol}</div></div>
            <div><div style={{ fontSize: 10, opacity: .5, letterSpacing: 1 }}>ASAL</div><div style={{ fontSize: 13, fontWeight: 700 }}>{mf.asal}</div></div>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 14 }}>
            <div style={{ fontSize: 12, opacity: .7 }}>🚛 {mf.driver}</div>
            <div style={{ fontSize: 12, opacity: .7 }}>👤 {mf.pic}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 14px 0" }}>
        {/* Timestamp */}
        <div style={{ background: T.white, borderRadius: 16, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.gray3, letterSpacing: 1.2, marginBottom: 10 }}>WAKTU BONGKAR MUAT</div>
          <div style={{ display: "flex" }}>
            {[{ label: "Mulai", val: mf.tStart, color: T.blue, icon: "▶" }, { label: "Selesai", val: mf.tEnd, color: T.green, icon: "✓" }].map((col, ci) => (
              <div key={ci} style={{ flex: 1, paddingRight: ci === 0 ? 12 : 0, paddingLeft: ci === 1 ? 12 : 0, borderLeft: ci === 1 ? `1px solid ${T.gray1}` : "none" }}>
                <div style={{ fontSize: 10, color: T.gray3, marginBottom: 4 }}>{col.icon} {col.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: col.val ? col.color : T.gray2 }}>{fmtTime(col.val)}</div>
                {ci === 1 && mf.tStart && !mf.tEnd && <div style={{ fontSize: 11, color: T.amber, fontWeight: 700, marginTop: 2 }}>⏱ {durasi(mf.tStart, new Date())} berjalan</div>}
                {ci === 1 && mf.tEnd && <div style={{ fontSize: 11, color: T.green, fontWeight: 700, marginTop: 2 }}>Durasi: {durasi(mf.tStart, mf.tEnd)}</div>}
              </div>
            ))}
          </div>
        </div>

        {mf.status === "menunggu" && (
          <button onClick={startBongkar} style={{ width: "100%", padding: 15, borderRadius: 14, border: "none", background: T.amber, color: T.navy, fontFamily: "inherit", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 12, boxShadow: `0 4px 18px ${T.amber}55` }}>▶ Mulai Bongkar Muat</button>
        )}

        {/* Checklist */}
        <div style={{ background: T.white, borderRadius: 16, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.gray3, letterSpacing: 1.2 }}>CHECKLIST BARANG</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: allDone ? T.green : T.amber }}>{doneCount}/{mf.items.length}</div>
          </div>
          <Bar done={doneCount} total={mf.items.length} status={mf.status} />
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {mf.items.map(item => (
              <div key={item.id} onClick={() => toggleItem(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", borderRadius: 12, background: item.ok ? T.greenPale : T.gray0, border: `1.5px solid ${item.ok ? "#A8EAC8" : T.gray1}`, cursor: mf.status !== "menunggu" ? "pointer" : "default", transition: "all .2s" }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, border: `2.5px solid ${item.ok ? T.green : T.gray2}`, background: item.ok ? T.green : T.white, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontSize: 13, fontWeight: 800 }}>{item.ok ? "✓" : ""}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{item.nama}</div>
                  <div style={{ fontSize: 11, color: T.gray3 }}>{item.qty} {item.sat}</div>
                </div>
                {item.ok && <div style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>Diterima</div>}
              </div>
            ))}
          </div>
          {mf.status === "menunggu" && <div style={{ textAlign: "center", fontSize: 11, color: T.gray3, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.gray1}` }}>Tekan tombol Mulai Bongkar untuk mengaktifkan checklist</div>}
        </div>

        {/* Foto */}
        <div style={{ background: T.white, borderRadius: 16, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.gray3, letterSpacing: 1.2 }}>FOTO DOKUMENTASI {mf.photos.length > 0 && <span style={{ color: T.green }}>({mf.photos.length})</span>}</div>
            {mf.status === "proses" && mf.photos.length === 0 && <span style={{ fontSize: 10, color: T.red, fontWeight: 700 }}>WAJIB MIN. 1</span>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {mf.photos.map((p, i) => (
              <div key={p.id} style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", position: "relative", flexShrink: 0, background: T.navyMid }}>
                {p.dataUrl
                  ? <img src={p.dataUrl} alt={`foto ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 24 }}>📷</span><span style={{ fontSize: 9, color: "rgba(255,255,255,.5)", marginTop: 2 }}>Foto {i + 1}</span></div>
                }
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.55)", padding: "3px 5px" }}>
                  <div style={{ fontSize: 8, color: T.white, fontWeight: 700 }}>{fmtTime(p.timestamp)}</div>
                </div>
              </div>
            ))}
            {mf.status === "proses" && (
              <div onClick={takePhoto} style={{ width: 80, height: 80, borderRadius: 12, border: `2px dashed ${T.gray2}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.gray3, gap: 4, background: T.gray0 }}>
                <span style={{ fontSize: 26 }}>📷</span>
                <span style={{ fontSize: 9, fontWeight: 600 }}>Ambil Foto</span>
              </div>
            )}
            {mf.photos.length === 0 && mf.status !== "proses" && <span style={{ fontSize: 12, color: T.gray3 }}>Belum ada foto</span>}
          </div>
          {mf.status === "proses" && <div style={{ fontSize: 11, color: T.gray3, marginTop: 8 }}>📍 Timestamp otomatis ditambahkan ke setiap foto</div>}
        </div>

        {/* Catatan */}
        <div style={{ background: T.white, borderRadius: 16, padding: "14px 16px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: T.gray3, letterSpacing: 1.2 }}>CATATAN</div>
            {mf.status !== "selesai" && <button onClick={() => { setNoteVal(mf.note); setNoteModal(true); }} style={{ background: "none", border: "none", color: T.blue, fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>✏ Edit</button>}
          </div>
          <div style={{ fontSize: 13, color: mf.note ? T.text : T.gray3, lineHeight: 1.5, minHeight: 32 }}>{mf.note || "Belum ada catatan..."}</div>
        </div>

        {mf.status === "proses" && (
          <button onClick={finish} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: allDone && mf.photos.length >= 1 ? T.green : T.gray2, color: T.white, fontFamily: "inherit", fontSize: 15, fontWeight: 900, cursor: allDone && mf.photos.length >= 1 ? "pointer" : "not-allowed", transition: "background .3s", boxShadow: allDone && mf.photos.length >= 1 ? `0 4px 18px ${T.green}44` : "none" }}>✓ Selesai Bongkar Muat</button>
        )}
      </div>

      {noteModal && (
        <Modal onClose={() => setNoteModal(false)}>
          <div style={{ fontSize: 16, fontWeight: 900, color: T.text, marginBottom: 14 }}>Tambah Catatan</div>
          <textarea value={noteVal} onChange={e => setNoteVal(e.target.value)} placeholder="Contoh: 2 karton rusak, nomor seri tidak sesuai..." style={{ width: "100%", height: 110, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${T.gray1}`, fontSize: 14, resize: "none", color: T.text, fontFamily: "inherit", background: T.gray0, boxSizing: "border-box", outline: "none" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button onClick={() => setNoteModal(false)} style={{ flex: 1, padding: 14, borderRadius: 12, border: `1.5px solid ${T.gray1}`, background: T.white, fontFamily: "inherit", fontSize: 14, cursor: "pointer", fontWeight: 700, color: T.gray4 }}>Batal</button>
            <button onClick={saveNote} style={{ flex: 2, padding: 14, borderRadius: 12, border: "none", background: T.navy, color: T.white, fontFamily: "inherit", fontSize: 14, fontWeight: 900, cursor: "pointer" }}>Simpan</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(MANIFESTS);
  const [tab, setTab] = useState("manifest");
  const [selectedId, setSelect] = useState(null);
  const [filter, setFilter] = useState("semua");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const updateMf = (id, patch) => setData(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m));

  const counts = {
    menunggu: data.filter(m => m.status === "menunggu").length,
    proses:   data.filter(m => m.status === "proses").length,
    selesai:  data.filter(m => m.status === "selesai").length,
  };

  const selected = data.find(m => m.id === selectedId);

  if (selectedId && selected) return (
    <>
      <Detail mf={selected} onBack={() => setSelect(null)} onUpdate={p => updateMf(selectedId, p)} showToast={showToast} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );

  const filtered = filter === "semua" ? data : data.filter(m => m.status === filter);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: T.gray0, minHeight: "100vh" }}>
      <style>{`* { box-sizing: border-box; } ::-webkit-scrollbar { display: none; }`}</style>

      <div style={{ background: `linear-gradient(160deg, ${T.navy} 0%, ${T.navyMid} 100%)`, padding: "22px 16px 28px", color: T.white }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, opacity: .5, letterSpacing: 1.2 }}>SELAMAT DATANG</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{ME.nama}</div>
            <div style={{ fontSize: 12, opacity: .55, marginTop: 2 }}>{ME.role}</div>
          </div>
          <Ava label={ME.avatar} size={44} bg={T.steel} />
        </div>
        <div style={{ fontSize: 12, opacity: .45, marginBottom: 16 }}>{fmtDate(NOW)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { key: "menunggu", label: "Menunggu", color: T.amber },
            { key: "proses",   label: "Berjalan", color: T.blue  },
            { key: "selesai",  label: "Selesai",  color: T.green },
          ].map(s => (
            <div key={s.key} onClick={() => setFilter(filter === s.key ? "semua" : s.key)}
              style={{ background: filter === s.key ? s.color : "rgba(255,255,255,.08)", borderRadius: 14, padding: "10px 12px", cursor: "pointer", transition: "all .2s", border: `1.5px solid ${filter === s.key ? s.color : "transparent"}` }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: filter === s.key ? T.navy : s.color }}>{counts[s.key]}</div>
              <div style={{ fontSize: 10, fontWeight: 700, marginTop: 2, color: filter === s.key ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.55)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 14, paddingBottom: 90 }}>
        {filter !== "semua" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: T.gray3 }}>Filter: <b style={{ color: T.text }}>{STATUS_CFG[filter].label}</b></div>
            <button onClick={() => setFilter("semua")} style={{ background: "none", border: "none", color: T.blue, fontSize: 12, cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>Lihat Semua ✕</button>
          </div>
        )}
        {filtered.map(m => {
          const doneCount = m.items.filter(i => i.ok).length;
          return (
            <div key={m.id} onClick={() => setSelect(m.id)} style={{ background: T.white, borderRadius: 18, padding: "14px 16px", marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,.07)", cursor: "pointer", border: `1.5px solid ${m.status === "proses" ? T.blue + "44" : "transparent"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: T.navy }}>{m.noPol}</div>
                  <div style={{ fontSize: 11, color: T.gray3, marginTop: 2 }}>{m.id} · {m.asal}</div>
                </div>
                <Chip status={m.status} />
              </div>
              <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: T.gray3 }}>🚛 {m.driver}</span>
                <span style={{ fontSize: 11, color: T.gray3 }}>👤 {m.pic}</span>
              </div>
              <Bar done={doneCount} total={m.items.length} status={m.status} />
              {m.tStart && (
                <div style={{ display: "flex", gap: 14, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.gray1}` }}>
                  <span style={{ fontSize: 11, color: T.gray3 }}>▶ <b style={{ color: T.blue }}>{fmtTime(m.tStart)}</b></span>
                  {m.tEnd
                    ? <span style={{ fontSize: 11, color: T.gray3 }}>✓ <b style={{ color: T.green }}>{fmtTime(m.tEnd)}</b></span>
                    : <span style={{ fontSize: 11, color: T.amber, fontWeight: 700 }}>⏱ {durasi(m.tStart, new Date())}</span>
                  }
                  <span style={{ fontSize: 11, color: T.gray3, marginLeft: "auto" }}>📷 {m.photos.length}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.white, borderTop: `1px solid ${T.gray1}`, display: "flex", padding: "8px 0 16px", zIndex: 100 }}>
        {[{ id: "manifest", label: "Manifest", icon: "📋" }, { id: "riwayat", label: "Riwayat", icon: "🕐" }, { id: "profil", label: "Profil", icon: "👤" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "inherit", padding: "6px 0" }}>
            <span style={{ fontSize: 24 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: tab === t.id ? T.navy : T.gray3 }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 22, height: 3, background: T.amber, borderRadius: 99 }} />}
          </button>
        ))}
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
