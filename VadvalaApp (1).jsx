import React, { useState, useEffect, useCallback } from 'react';

// ===== DESIGN TOKENS =====
const COLORS = {
  ivory: '#F7F3EC',
  ivoryDeep: '#F0EAE0',
  forest: '#1F3D2B',
  forestDeep: '#16291D',
  terracotta: '#B5651D',
  gold: '#C9A24B',
  charcoal: '#2B2B2B',
  line: 'rgba(31,61,43,0.14)',
};

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

const CATEGORIES = [
  { id: 'sale', label: 'For Sale' },
  { id: 'lease', label: 'Lease / Rent' },
  { id: 'commercial', label: 'Commercial' },
];

const SEED_LISTINGS = [
  {
    id: 'seed-1',
    category: 'sale',
    title: '2 BHK Duplex',
    location: 'Navrangpura, Ahmedabad',
    price: '₹70.0 Lakh',
    specs: [
      ['Carpet Area', '891 sqft'],
      ['Built-up', '900 sqft'],
      ['Floor', '2 of 2'],
      ['Bedrooms', '2'],
      ['Bathrooms', '2'],
      ['Maintenance', '₹500/mo'],
    ],
    description: "A spacious, well-located duplex offering a premium lifestyle in one of Navrangpura's most sought-after addresses. Posted by owner — no brokerage involved. Walking distance from HCG Hospitals, Sterling Hospitals Gurukul, and BAPS Yogiji Maharaj Hospital. Regular water supply available.",
    image: null,
    createdAt: Date.now() - 300000,
  },
  {
    id: 'seed-2',
    category: 'commercial',
    title: 'Office Space',
    location: 'Ahmedabad',
    price: '₹39,000/mo',
    specs: [
      ['Area Range', '600–960 sqft'],
      ['Negotiable', 'Yes'],
      ['Possession', 'On discussion'],
    ],
    description: 'Flexible commercial space suitable for a range of business uses. Area can be configured between 600 to 960 sqft depending on requirement. Rent is negotiable — contact for site visit and further details.',
    image: null,
    createdAt: Date.now() - 200000,
  },
  {
    id: 'seed-3',
    category: 'sale',
    title: '1 BHK Apartment',
    location: 'Ahmedabad',
    price: '₹30.0 Lakh (Negotiable)',
    specs: [
      ['Type', '1 BHK'],
      ['Negotiable', 'Yes'],
      ['Status', 'Available'],
    ],
    description: 'Compact 1 BHK unit, ideal for a small family or working professional. Price is negotiable. Contact for exact location, floor details and possession timeline.',
    image: null,
    createdAt: Date.now() - 100000,
  },
];

const ADMIN_PASSWORD = 'vadvala2026';

// ===== STORAGE HELPERS =====
async function loadListings() {
  try {
    const res = await window.storage.get('listings', true);
    return res ? JSON.parse(res.value) : SEED_LISTINGS;
  } catch {
    return SEED_LISTINGS;
  }
}
async function saveListings(listings) {
  try {
    await window.storage.set('listings', JSON.stringify(listings), true);
  } catch (e) {
    console.error('Save failed', e);
  }
}
async function loadLogo() {
  try {
    const res = await window.storage.get('logo', true);
    return res ? res.value : null;
  } catch {
    return null;
  }
}
async function saveLogo(dataUrl) {
  try {
    await window.storage.set('logo', dataUrl, true);
  } catch (e) {
    console.error('Logo save failed', e);
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ===== LOGO COMPONENT =====
function Logo({ src, size = 42 }) {
  if (src) {
    return (
      <img
        src={src}
        alt="Vadvala Real Estates"
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: COLORS.forest, color: COLORS.ivory,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: size * 0.4,
      }}
    >
      V
    </div>
  );
}

// ===== TOAST =====
function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: COLORS.forestDeep, color: COLORS.ivory, padding: '14px 26px',
      borderRadius: 30, fontSize: 14, fontFamily: FONT_BODY, fontWeight: 500,
      zIndex: 1000, boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
    }}>
      {message}
    </div>
  );
}

// ===== PUBLIC SITE VIEW =====
function PublicSite({ listings, logo, goAdmin }) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'all' ? listings : listings.filter(l => l.category === filter);
  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;

  return (
    <div style={{ fontFamily: FONT_BODY, background: COLORS.ivory, color: COLORS.charcoal, minHeight: '100vh' }}>
      {/* NAV */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 5vw', background: 'rgba(247,243,236,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${COLORS.line}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo src={logo} />
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 17, color: COLORS.forestDeep }}>
            Vadvala Real Estates
          </span>
        </div>
        <button onClick={goAdmin} style={{
          background: 'transparent', border: `1.5px solid ${COLORS.charcoal}`, color: COLORS.charcoal,
          padding: '9px 20px', borderRadius: 30, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          fontFamily: FONT_BODY,
        }}>
          Admin
        </button>
      </div>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '90px 6vw 60px', position: 'relative', overflow: 'hidden' }}>
        {logo && (
          <img src={logo} alt="" style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 600, opacity: 0.05, pointerEvents: 'none',
          }} />
        )}
        <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.terracotta, fontWeight: 600, marginBottom: 18, position: 'relative' }}>
          Ahmedabad · Rooted in Trust
        </div>
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 'clamp(2.2rem,5.5vw,3.6rem)',
          color: COLORS.forestDeep, lineHeight: 1.1, margin: '0 auto', maxWidth: 700, position: 'relative',
        }}>
          Property decisions, <em style={{ color: COLORS.terracotta, fontStyle: 'italic', fontWeight: 500 }}>grounded</em> in trust.
        </h1>
        <p style={{ marginTop: 20, color: '#5b5b54', maxWidth: 480, margin: '20px auto 0', lineHeight: 1.6, position: 'relative' }}>
          Verified listings across Ahmedabad — handled personally, every step of the way.
        </p>
      </div>

      {/* FILTER TABS */}
      <div style={{ padding: '0 6vw', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
          {['all', ...CATEGORIES.map(c => c.id)].map(id => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              style={{
                padding: '10px 20px', borderRadius: 30, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: `1.5px solid ${filter === id ? COLORS.forest : COLORS.line}`,
                background: filter === id ? COLORS.forest : 'transparent',
                color: filter === id ? COLORS.ivory : COLORS.charcoal,
                fontFamily: FONT_BODY, transition: 'all .2s ease',
              }}
            >
              {id === 'all' ? 'All' : catLabel(id)}
            </button>
          ))}
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px', color: '#8a8a80',
            border: `1px dashed ${COLORS.line}`, borderRadius: 18, marginBottom: 60,
          }}>
            No listings in this category yet.
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 26, marginBottom: 80,
          }}>
            {filtered.map(l => (
              <div
                key={l.id}
                onClick={() => setSelected(l)}
                style={{
                  background: '#fff', borderRadius: 18, overflow: 'hidden',
                  border: `1px solid ${COLORS.line}`, cursor: 'pointer',
                  transition: 'transform .25s ease, box-shadow .25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(31,61,43,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  height: 200, position: 'relative',
                  background: l.image ? `url(${l.image}) center/cover` : 'linear-gradient(135deg,#dfe7d8,#c7d4bf)',
                }}>
                  <span style={{
                    position: 'absolute', top: 14, left: 14, background: COLORS.forest, color: COLORS.ivory,
                    fontSize: 11, fontWeight: 600, padding: '5px 13px', borderRadius: 20, letterSpacing: '0.03em',
                  }}>
                    {catLabel(l.category)}
                  </span>
                  <span style={{
                    position: 'absolute', bottom: 14, right: 14, background: 'rgba(247,243,236,0.95)',
                    color: COLORS.forestDeep, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 16,
                    padding: '7px 14px', borderRadius: 10,
                  }}>
                    {l.price}
                  </span>
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: COLORS.forestDeep, margin: '0 0 4px' }}>{l.title}</h3>
                  <div style={{ fontSize: 13, color: '#8a8a80' }}>{l.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: COLORS.forestDeep, color: 'rgba(247,243,236,0.7)', padding: '40px 6vw', textAlign: 'center', fontSize: 13 }}>
        © 2026 Vadvala Real Estates, Ahmedabad — Rooted in trust.
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(20,24,18,0.55)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background: COLORS.ivory, borderRadius: 20, maxWidth: 640, width: '100%',
            maxHeight: '86vh', overflowY: 'auto', position: 'relative',
          }}>
            <div style={{
              height: 240, position: 'relative',
              background: selected.image ? `url(${selected.image}) center/cover` : 'linear-gradient(135deg,#dfe7d8,#c7d4bf)',
            }}>
              <button onClick={() => setSelected(null)} style={{
                position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: 16,
              }}>✕</button>
            </div>
            <div style={{ padding: '30px 34px 38px' }}>
              <span style={{
                display: 'inline-block', background: COLORS.forest, color: COLORS.ivory, fontSize: 11,
                padding: '5px 14px', borderRadius: 20, fontWeight: 600, marginBottom: 14,
              }}>
                {catLabel(selected.category)}
              </span>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: COLORS.forestDeep, fontSize: 26, margin: '0 0 4px' }}>{selected.title}</h2>
              <div style={{ color: '#8a8a80', fontSize: 14, marginBottom: 20 }}>{selected.location}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: COLORS.terracotta, fontWeight: 600, marginBottom: 24 }}>
                {selected.price}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 14, marginBottom: 24 }}>
                {selected.specs.map(([k, v], i) => (
                  <div key={i} style={{ background: '#fff', border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8a8a80', marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.forestDeep }}>{v}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5b5b54', marginBottom: 26 }}>{selected.description}</p>
              <a
                href={`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent('Hi, I am interested in: ' + selected.title + ' - ' + selected.location)}`}
                target="_blank" rel="noreferrer"
                style={{
                  display: 'inline-block', background: COLORS.forest, color: COLORS.ivory,
                  padding: '13px 28px', borderRadius: 30, fontWeight: 600, fontSize: 14, textDecoration: 'none',
                }}
              >
                WhatsApp enquiry
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== ADMIN LOGIN =====
function AdminLogin({ onSuccess, goSite }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.forestDeep, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: FONT_BODY, padding: 20,
    }}>
      <form onSubmit={submit} style={{
        background: COLORS.ivory, borderRadius: 20, padding: '44px 40px', maxWidth: 360, width: '100%',
      }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: COLORS.forestDeep, marginBottom: 6, fontWeight: 600 }}>
          Admin Access
        </div>
        <p style={{ fontSize: 13, color: '#6b6b62', marginBottom: 24 }}>Enter the admin password to manage listings.</p>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(''); }}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%', padding: '13px 16px', borderRadius: 10, border: `1.5px solid ${COLORS.line}`,
            fontSize: 14, marginBottom: error ? 8 : 18, fontFamily: FONT_BODY, boxSizing: 'border-box',
          }}
        />
        {error && <div style={{ color: COLORS.terracotta, fontSize: 12, marginBottom: 14 }}>{error}</div>}
        <button type="submit" style={{
          width: '100%', background: COLORS.forest, color: COLORS.ivory, padding: 14, borderRadius: 10,
          border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 12,
        }}>
          Log in
        </button>
        <button type="button" onClick={goSite} style={{
          width: '100%', background: 'transparent', color: COLORS.charcoal, padding: 10, border: 'none',
          fontSize: 13, cursor: 'pointer', textDecoration: 'underline',
        }}>
          ← Back to site
        </button>
      </form>
    </div>
  );
}

// ===== ADMIN DASHBOARD =====
function AdminDashboard({ listings, setListings, logo, setLogo, goSite, notify }) {
  const [editing, setEditing] = useState(null); // listing object or 'new' or null
  const blankForm = { category: 'sale', title: '', location: '', price: '', description: '', image: null, specs: [['', '']] };
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    if (editing && editing !== 'new') {
      setForm({ ...editing, specs: editing.specs.length ? editing.specs : [['', '']] });
    } else if (editing === 'new') {
      setForm(blankForm);
    }
  }, [editing]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm(f => ({ ...f, image: dataUrl }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setLogo(dataUrl);
    await saveLogo(dataUrl);
    notify('Logo updated');
  };

  const updateSpec = (i, idx, val) => {
    const specs = [...form.specs];
    specs[i][idx] = val;
    setForm(f => ({ ...f, specs }));
  };
  const addSpec = () => setForm(f => ({ ...f, specs: [...f.specs, ['', '']] }));
  const removeSpec = (i) => setForm(f => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }));

  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) {
      notify('Title, location and price are required');
      return;
    }
    const cleanSpecs = form.specs.filter(s => s[0] && s[1]);
    let next;
    if (editing === 'new') {
      next = [...listings, { ...form, specs: cleanSpecs, id: uid(), createdAt: Date.now() }];
    } else {
      next = listings.map(l => l.id === editing.id ? { ...form, specs: cleanSpecs, id: l.id, createdAt: l.createdAt } : l);
    }
    setListings(next);
    await saveListings(next);
    notify(editing === 'new' ? 'Listing published' : 'Listing updated');
    setEditing(null);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    const next = listings.filter(l => l.id !== id);
    setListings(next);
    await saveListings(next);
    notify('Listing deleted');
  };

  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;

  if (editing) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.ivory, fontFamily: FONT_BODY, padding: '40px 5vw' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <button onClick={() => setEditing(null)} style={{
            background: 'none', border: 'none', color: COLORS.forest, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', marginBottom: 20, padding: 0,
          }}>
            ← Back to dashboard
          </button>
          <h2 style={{ fontFamily: FONT_DISPLAY, color: COLORS.forestDeep, fontSize: 26, marginBottom: 28 }}>
            {editing === 'new' ? 'Add new listing' : 'Edit listing'}
          </h2>
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={lbl}>Poster image</label>
              <input type="file" accept="image/*" onChange={handleImage} style={inp} />
              {form.image && <img src={form.image} alt="" style={{ marginTop: 10, width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 10 }} />}
            </div>
            <div>
              <label style={lbl}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inp}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 2 BHK Duplex" style={inp} />
            </div>
            <div>
              <label style={lbl}>Location</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Navrangpura, Ahmedabad" style={inp} />
            </div>
            <div>
              <label style={lbl}>Price</label>
              <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. ₹70.0 Lakh" style={inp} />
            </div>
            <div>
              <label style={lbl}>Specs (key / value)</label>
              {form.specs.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={s[0]} onChange={e => updateSpec(i, 0, e.target.value)} placeholder="e.g. Carpet Area" style={{ ...inp, flex: 1 }} />
                  <input value={s[1]} onChange={e => updateSpec(i, 1, e.target.value)} placeholder="e.g. 891 sqft" style={{ ...inp, flex: 1 }} />
                  <button type="button" onClick={() => removeSpec(i)} style={{ ...ghostBtn, padding: '0 14px' }}>✕</button>
                </div>
              ))}
              <button type="button" onClick={addSpec} style={{ ...ghostBtn, fontSize: 12, padding: '8px 16px' }}>+ Add spec</button>
            </div>
            <div>
              <label style={lbl}>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} style={{ ...inp, resize: 'vertical' }} />
            </div>
            <button type="submit" style={{
              background: COLORS.forest, color: COLORS.ivory, padding: 15, borderRadius: 10, border: 'none',
              fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 10,
            }}>
              {editing === 'new' ? 'Publish listing' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.ivory, fontFamily: FONT_BODY }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 5vw', borderBottom: `1px solid ${COLORS.line}`, flexWrap: 'wrap', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo src={logo} />
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 17, color: COLORS.forestDeep }}>Admin Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={goSite} style={ghostBtn}>View site</button>
          <button onClick={() => setEditing('new')} style={primaryBtn}>+ Add listing</button>
        </div>
      </div>

      <div style={{ padding: '30px 5vw', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          background: '#fff', border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: 24, marginBottom: 30,
        }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: COLORS.forestDeep, marginBottom: 4 }}>Brand logo</div>
          <p style={{ fontSize: 13, color: '#6b6b62', marginBottom: 14 }}>Upload your logo — it appears across the site automatically.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Logo src={logo} size={56} />
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
          </div>
        </div>

        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: COLORS.forestDeep, marginBottom: 16 }}>
          Listings ({listings.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {listings.length === 0 && (
            <div style={{ color: '#8a8a80', fontSize: 14, padding: 20, textAlign: 'center', border: `1px dashed ${COLORS.line}`, borderRadius: 12 }}>
              No listings yet. Click "Add listing" to create one.
            </div>
          )}
          {listings.slice().sort((a,b) => b.createdAt - a.createdAt).map(l => (
            <div key={l.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, background: '#fff',
              border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 14,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 10, flexShrink: 0,
                background: l.image ? `url(${l.image}) center/cover` : 'linear-gradient(135deg,#dfe7d8,#c7d4bf)',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.forestDeep }}>{l.title}</div>
                <div style={{ fontSize: 12, color: '#8a8a80' }}>{l.location} · {catLabel(l.category)} · {l.price}</div>
              </div>
              <button onClick={() => setEditing(l)} style={{ ...ghostBtn, fontSize: 12, padding: '8px 14px' }}>Edit</button>
              <button onClick={() => remove(l.id)} style={{ ...ghostBtn, fontSize: 12, padding: '8px 14px', borderColor: COLORS.terracotta, color: COLORS.terracotta }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#1F3D2B', marginBottom: 6 };
const inp = { width: '100%', padding: '12px 14px', borderRadius: 9, border: `1.5px solid ${COLORS.line}`, fontSize: 14, fontFamily: FONT_BODY, boxSizing: 'border-box', background: COLORS.ivory };
const ghostBtn = { background: 'transparent', border: `1.5px solid ${COLORS.charcoal}`, color: COLORS.charcoal, padding: '10px 18px', borderRadius: 30, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT_BODY };
const primaryBtn = { background: COLORS.forest, color: COLORS.ivory, padding: '10px 18px', borderRadius: 30, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: FONT_BODY };

// ===== ROOT APP =====
export default function VadvalaApp() {
  const [view, setView] = useState('site'); // site | login | admin
  const [listings, setListings] = useState([]);
  const [logo, setLogo] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState('');

  const notify = useCallback((msg) => setToast(msg), []);

  useEffect(() => {
    (async () => {
      const [l, lg] = await Promise.all([loadListings(), loadLogo()]);
      setListings(l);
      setLogo(lg);
      setLoaded(true);
      // seed storage if empty
      const existing = await window.storage.get('listings', true).catch(() => null);
      if (!existing) saveListings(l);
    })();
  }, []);

  // Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.ivory, fontFamily: FONT_BODY, color: COLORS.forestDeep }}>
        Loading…
      </div>
    );
  }

  return (
    <div>
      {view === 'site' && (
        <PublicSite listings={listings} logo={logo} goAdmin={() => setView('login')} />
      )}
      {view === 'login' && (
        <AdminLogin onSuccess={() => setView('admin')} goSite={() => setView('site')} />
      )}
      {view === 'admin' && (
        <AdminDashboard
          listings={listings}
          setListings={setListings}
          logo={logo}
          setLogo={setLogo}
          goSite={() => setView('site')}
          notify={notify}
        />
      )}
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
