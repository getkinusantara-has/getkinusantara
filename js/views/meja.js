import {q,run,tx} from '../db.js';import {coba} from '../app.js';
export default function view(el){
 const daftar=q('SELECT * FROM meja ORDER BY meja_id');
 el.innerHTML=`<p>Ketuk meja untuk mengubah status. Hijau kosong, merah terisi.</p>
 <div class="grid">${daftar.map(x=>{const t=x.status_okupansi==='TERISI';return `<button class="mj ${t?'terisi':'kosong'}" data-id="${x.meja_id}" data-s="${x.status_okupansi}">Meja ${x.meja_id}<br><small>${x.kapasitas} kursi</small><br><b>${x.status_okupansi}</b></button>`}).join('')}</div>
 <h3>Tambah meja</h3><form id="baru"><input name="k" type="number" min="1" step="1" inputmode="numeric" placeholder="Jumlah kursi" required><button class="utama">Tambah meja</button></form>`;
 el.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>coba(async()=>{
  const baru=b.dataset.s==='TERISI'?'KOSONG':'TERISI';
  await tx(()=>run('UPDATE meja SET status_okupansi=? WHERE meja_id=?',[baru,+b.dataset.id]));view(el)}));
 el.querySelector('#baru').onsubmit=e=>{e.preventDefault();const n=Math.floor(+e.target.elements.k.value);
  coba(async()=>{if(!(n>0))throw Error('Isi jumlah kursi dengan angka lebih dari 0');await tx(()=>run('INSERT INTO meja(kapasitas)VALUES(?)',[n]));view(el)})}}
