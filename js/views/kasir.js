import {q} from '../db.js';import {checkout} from '../logic.js';import {cetak} from '../printer.js';import {rp,esc,coba} from '../app.js';
const k=new Map();let meja='',metode='Tunai',uang='';
export default function view(el){const menu=q('SELECT * FROM menu WHERE status_aktif=1 ORDER BY kategori,nama_menu');
 for(const id of k.keys())if(!menu.some(m=>m.menu_id===id))k.delete(id);
 const isi=[...k].map(([id,n])=>({...menu.find(m=>m.menu_id===id),n})),total=isi.reduce((a,i)=>a+i.harga*i.n,0);
 el.innerHTML=`<div class="dua"><div class="grid">${menu.map(m=>`<button data-t="${m.menu_id}" ${m.stok<=(k.get(m.menu_id)||0)?'disabled':''}><b>${esc(m.nama_menu)}</b><br>${rp(m.harga)}<br><small>Stok ${m.stok}</small></button>`).join('')}</div>
 <div class="nota">${isi.map(i=>`<div class="baris"><span>${i.n} × ${esc(i.nama_menu)}</span><button data-k="${i.menu_id}" aria-label="Kurangi">−</button></div>`).join('')||'<p>Ketuk menu untuk mulai pesanan.</p>'}
 <h2>${rp(total)}</h2><select id="meja"><option value="">Bawa pulang</option>${q("SELECT * FROM meja WHERE status_okupansi='KOSONG'").map(m=>`<option value="${m.meja_id}">Meja ${m.meja_id} (${m.kapasitas} kursi)</option>`).join('')}</select>
 <select id="metode"><option>Tunai</option><option>QRIS</option><option>Debit</option></select>
 <input id="uang" type="number" inputmode="numeric" placeholder="Uang diterima (tunai)" value="${uang}"><button class="utama" id="bayar">Bayar</button></div></div>`;
 const $=s=>el.querySelector(s);$('#meja').value=meja;if($('#meja').selectedIndex<0)$('#meja').value=meja='';$('#metode').value=metode;
 $('#meja').onchange=e=>meja=e.target.value;$('#metode').onchange=e=>metode=e.target.value;$('#uang').oninput=e=>uang=e.target.value;
 el.querySelectorAll('[data-t],[data-k]').forEach(b=>b.onclick=()=>{const id=+(b.dataset.t||b.dataset.k),n=(k.get(id)||0)+(b.dataset.t?1:-1);n?k.set(id,n):k.delete(id);view(el)});
 $('#bayar').onclick=e=>{e.target.disabled=true;coba(async()=>{const id=await checkout(k,+meja||null,metode,+uang);
  k.clear();meja=uang='';view(el);if(confirm(`Tersimpan. Kembalian ${rp(q('SELECT kembalian x FROM transaksi WHERE transaksi_id=?',[id])[0].x)}. Cetak struk?`))await cetak(id)}).finally(()=>e.target.disabled=false)}}
