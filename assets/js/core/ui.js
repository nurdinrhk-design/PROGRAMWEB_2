/* =====================================================================
   ui.js — Utilitas antarmuka: pembuat elemen aman, format, snackbar,
   dialog konfirmasi, unduhan, CSV
   Namespace: PPDB.ui
   KEAMANAN: elemen dibuat lewat DOM + textContent, TIDAK memakai innerHTML,
   sehingga data isian tidak pernah dieksekusi sebagai HTML (anti-XSS).
   ===================================================================== */
(function (window, document) {
  'use strict';

  var PPDB = window.PPDB = window.PPDB || {};
  var R = PPDB.rules;

  /* ---------------------------------------------------------------
     1. Pembuat elemen
     el('td', { className: 'table__num', text: '12', attrs: { 'data-label': 'Nilai' },
                on: { click: fn } }, [anak, 'teks'])
     --------------------------------------------------------------- */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    var p = props || {};
    if (p.className) node.className = p.className;
    if (p.text !== undefined && p.text !== null) node.textContent = String(p.text);
    if (p.attrs) {
      Object.keys(p.attrs).forEach(function (k) {
        var v = p.attrs[k];
        if (v === false || v === null || v === undefined) return;
        node.setAttribute(k, v === true ? '' : String(v));
      });
    }
    if (p.on) {
      Object.keys(p.on).forEach(function (evt) { node.addEventListener(evt, p.on[evt]); });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
    return node;
  }

  function icon(nama, kelas) {
    return el('span', { className: 'icon' + (kelas ? ' ' + kelas : ''), text: nama, attrs: { 'aria-hidden': 'true' } });
  }

  function kosongkan(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  /* ---------------------------------------------------------------
     2. Format (AS-10: satu format tanggal & angka)
     --------------------------------------------------------------- */
  var fmtTanggal = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  var fmtTanggalPanjang = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var fmtAngka = new Intl.NumberFormat('id-ID');
  var fmtDesimal = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // 'YYYY-MM-DD' atau 'YYYY-MM-DDTHH:MM:SS' (waktu lokal) → Date
  function keDate(nilai) {
    if (nilai instanceof Date) return nilai;
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(String(nilai || ''));
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  }

  function tanggal(nilai) {
    var d = keDate(nilai);
    return d ? fmtTanggal.format(d) : '–';
  }

  function tanggalPanjang(nilai) {
    var d = keDate(nilai);
    return d ? fmtTanggalPanjang.format(d) : '–';
  }

  function jam(nilai) {
    var d = keDate(nilai);
    return d ? String(d.getHours()).padStart(2, '0') + '.' + String(d.getMinutes()).padStart(2, '0') : '–';
  }

  function tanggalWaktu(nilai) {
    return tanggal(nilai) + ', ' + jam(nilai);
  }

  function angka(n) {
    return isFinite(n) ? fmtAngka.format(n) : '–';
  }

  function desimal(n) {
    return isFinite(n) ? fmtDesimal.format(n) : '–';
  }

  function jarak(meter) {
    return angka(meter) + ' m';
  }

  // Lama menunggu sejak tanggal daftar, relatif ke "hari ini" simulasi
  function lamaMenunggu(nilai) {
    var d = keDate(nilai);
    if (!d) return '–';
    var hari = Math.max(0, R.selisihHari(d, R.today()));
    return hari === 0 ? 'hari ini' : hari + ' hari';
  }

  function inisial(nama) {
    return String(nama || '').trim().split(/\s+/).slice(0, 2).map(function (s) { return s.charAt(0); }).join('').toUpperCase();
  }

  /* ---------------------------------------------------------------
     3. Badge & chip dari data
     --------------------------------------------------------------- */
  function badgeStatus(status) {
    var s = R.STATUS_VERIFIKASI[status];
    return el('span', { className: 'badge ' + (s ? s.badge : ''), text: s ? s.label : status });
  }

  function badgeSeleksi(status) {
    var s = R.STATUS_SELEKSI[status];
    return el('span', { className: 'badge ' + (s ? s.badge : ''), text: s ? s.label : status });
  }

  function chipJalur(kode) {
    var j = R.jalur(kode);
    return el('span', { className: 'chip chip--jalur', text: j ? j.singkat : kode });
  }

  /* ---------------------------------------------------------------
     4. Snackbar (dengan aksi opsional, mis. "Urungkan")
     --------------------------------------------------------------- */
  var timerSnackbar = null;

  function snackbar(pesan, opsi) {
    var o = opsi || {};
    var host = document.querySelector('.snackbar-host');
    if (!host) {
      host = el('div', { className: 'snackbar-host', attrs: { role: 'status', 'aria-live': 'polite' } });
      document.body.appendChild(host);
    }
    kosongkan(host);
    window.clearTimeout(timerSnackbar);

    var bar = el('div', { className: 'snackbar' }, [el('span', { className: 'snackbar__message', text: pesan })]);
    if (o.aksi && typeof o.onAksi === 'function') {
      bar.appendChild(el('button', {
        className: 'snackbar__action',
        text: o.aksi,
        attrs: { type: 'button' },
        on: { click: function () { tutup(); o.onAksi(); } }
      }));
    }
    function tutup() {
      window.clearTimeout(timerSnackbar);
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    }
    host.appendChild(bar);
    timerSnackbar = window.setTimeout(tutup, o.durasi || (o.aksi ? 8000 : 5000));
    return tutup;
  }

  // Pesan yang dititipkan untuk halaman berikutnya (mis. "Data disimpan"
  // lalu pindah ke Data Pendaftar). Ditampilkan sekali oleh shell.js.
  var KUNCI_TITIPAN = 'ppdb.v2.pesan';

  function titipPesan(pesan) {
    try { window.sessionStorage.setItem(KUNCI_TITIPAN, String(pesan).slice(0, 300)); } catch (e) { /* abaikan */ }
  }

  function tampilkanTitipan() {
    var pesan = null;
    try {
      pesan = window.sessionStorage.getItem(KUNCI_TITIPAN);
      window.sessionStorage.removeItem(KUNCI_TITIPAN);
    } catch (e) { /* abaikan */ }
    if (pesan) snackbar(pesan, { durasi: 8000 });
  }

  /* ---------------------------------------------------------------
     5. Dialog konfirmasi (elemen <dialog> bawaan) → Promise<boolean>
     --------------------------------------------------------------- */
  function konfirmasi(opsi) {
    var o = opsi || {};
    return new Promise(function (resolve) {
      var idJudul = 'dlg-' + Date.now().toString(36);
      var tombolYa = el('button', {
        className: 'btn ' + (o.bahaya ? 'btn--danger' : 'btn--filled'),
        text: o.labelYa || 'Ya',
        attrs: { type: 'button', value: 'ya' }
      });
      var tombolBatal = el('button', { className: 'btn btn--text', text: o.labelBatal || 'Batal', attrs: { type: 'button', value: 'batal' } });
      var dialog = el('dialog', { className: 'dialog', attrs: { 'aria-labelledby': idJudul } }, [
        el('div', { className: 'dialog__container' }, [
          o.ikon ? icon(o.ikon, 'dialog__icon' + (o.bahaya ? ' dialog__icon--danger' : '')) : null,
          el('h2', { className: 'dialog__title', text: o.judul || 'Konfirmasi', attrs: { id: idJudul } }),
          o.isi ? el('p', { className: 'dialog__body', text: o.isi }) : null,
          el('div', { className: 'dialog__actions' }, [tombolBatal, tombolYa])
        ])
      ]);

      var hasil = false;
      tombolYa.addEventListener('click', function () { hasil = true; dialog.close(); });
      tombolBatal.addEventListener('click', function () { dialog.close(); });
      dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('close', function () {
        dialog.remove();
        resolve(hasil);
      });

      document.body.appendChild(dialog);
      dialog.showModal();
      // Tombol aman (Batal) difokuskan lebih dulu untuk aksi berbahaya
      (o.bahaya ? tombolBatal : tombolYa).focus();
    });
  }

  /* ---------------------------------------------------------------
     6. Unduhan & CSV
     --------------------------------------------------------------- */
  function unduh(namaFile, isi, mime) {
    var blob = new Blob([isi], { type: mime || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { attrs: { href: url, download: namaFile } });
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // Sel yang diawali = + - @ diberi apostrof agar tidak dieksekusi Excel (formula injection)
  function selCsv(nilai) {
    var s = String(nilai === undefined || nilai === null ? '' : nilai);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  // Pemisah titik koma agar langsung terbaca rapi di Excel berbahasa Indonesia
  function csv(barisBaris) {
    return '﻿' + barisBaris.map(function (b) { return b.map(selCsv).join(';'); }).join('\r\n');
  }

  function unduhCsv(namaFile, barisBaris) {
    unduh(namaFile, csv(barisBaris), 'text/csv;charset=utf-8');
  }

  /* ---------------------------------------------------------------
     7. Menu tarik-turun (pola disclosure, sama dengan menu akun)
     <button data-menu-toggle aria-expanded="false" aria-controls="id-menu">
     <div class="menu menu--anchored" id="id-menu" hidden> … .menu__item …
     Menu tertutup sendiri saat item dipilih, klik di luar, atau Escape.
     --------------------------------------------------------------- */
  function pasangMenu(tombol) {
    var menu = document.getElementById(tombol.getAttribute('aria-controls'));
    if (!menu) return null;

    function atur(buka, kembalikanFokus) {
      menu.hidden = !buka;
      tombol.setAttribute('aria-expanded', String(buka));
      if (buka) {
        var pertama = menu.querySelector('.menu__item');
        if (pertama) pertama.focus();
      } else if (kembalikanFokus) {
        tombol.focus();
      }
    }

    tombol.addEventListener('click', function () { atur(menu.hidden, false); });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('.menu__item')) atur(false, false);
    });
    menu.addEventListener('keydown', function (e) {
      var item = Array.prototype.slice.call(menu.querySelectorAll('.menu__item'));
      var i = item.indexOf(document.activeElement);
      if (e.key === 'Escape') {
        atur(false, true);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        var arah = e.key === 'ArrowDown' ? 1 : -1;
        item[(i + arah + item.length) % item.length].focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !menu.contains(e.target) && !tombol.contains(e.target)) atur(false, false);
    });
    return { tutup: function () { atur(false, false); } };
  }

  /* ---------------------------------------------------------------
     8. Lain-lain
     --------------------------------------------------------------- */
  function debounce(fn, ms) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      window.clearTimeout(t);
      t = window.setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }

  PPDB.ui = {
    el: el,
    icon: icon,
    kosongkan: kosongkan,
    keDate: keDate,
    tanggal: tanggal,
    tanggalPanjang: tanggalPanjang,
    jam: jam,
    tanggalWaktu: tanggalWaktu,
    angka: angka,
    desimal: desimal,
    jarak: jarak,
    lamaMenunggu: lamaMenunggu,
    inisial: inisial,
    badgeStatus: badgeStatus,
    badgeSeleksi: badgeSeleksi,
    chipJalur: chipJalur,
    snackbar: snackbar,
    titipPesan: titipPesan,
    tampilkanTitipan: tampilkanTitipan,
    konfirmasi: konfirmasi,
    unduh: unduh,
    csv: csv,
    unduhCsv: unduhCsv,
    pasangMenu: pasangMenu,
    debounce: debounce
  };
})(window, document);
