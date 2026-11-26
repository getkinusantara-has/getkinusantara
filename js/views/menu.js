import {q,run,tx} from '../db.js';import {rp,esc,coba} from '../app.js';
export default function view(el,e={}){el.innerHTML=`<form><input name="n" placeholder="Nama menu" required><input name="h" type="number" min="0" placeholder="Harga" required><input name="k" placeholder="Kategori"><input name="s" type="number" min="0" placeholder="Stok" required><label><input name="a" type="checkbox" checked> Aktif</label><button class="utama">Simpan menu</button></form>
 ${q('SELECT * FROM menu').map(m=>`<div class="baris"><span>${esc(m.nama_menu)}, ${rp(m.harga)}, stok ${m.stok}${m.status_aktif?'':' (nonaktif)'}</span><button data-id="${m.menu_id}">Ubah</button></div>`).join('')}`;
 const f=el.querySelector('form'),x=f.elements;if(e.menu_id){x.n.value=e.nama_menu;x.h.value=e.harga;x.k.value=e.kategori||'';x.s.value=e.stok;x.a.checked=!!e.status_aktif}
 f.onsubmit=v=>{v.preventDefault();const p=[x.n.value,Math.round(+x.h.value),x.k.value,Math.floor(+x.s.value),+x.a.checked];
  coba(async()=>{await tx(()=>e.menu_id?run('UPDATE menu SET nama_menu=?,harga=?,kategori=?,stok=?,status_aktif=? WHERE menu_id=?',[...p,e.menu_id]):run('INSERT INTO menu(nama_menu,harga,kategori,stok,status_aktif)VALUES(?,?,?,?,?)',p));view(el)})};
 el.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{view(el,q('SELECT * FROM menu WHERE menu_id=?',[+b.dataset.id])[0]);scrollTo(0,0)})}
