/* =====================================================================
   styleguide.js — Interaksi halaman etalase design system
   - Swatch warna & uji kontras dibaca dari token CSS yang sedang aktif
   - Demo kecil: filter chip, tabs, sort, dialog, snackbar
   (Logika aplikasi sebenarnya dibuat di tahap T4.)
   ===================================================================== */
(function () {
  'use strict';

  var SWATCHES = {
    peran: [
      ['Primary', '--md-primary'],
      ['On primary', '--md-on-primary'],
      ['Primary container', '--md-primary-container'],
      ['On primary container', '--md-on-primary-container'],
      ['Secondary (aksen)', '--md-secondary'],
      ['Secondary container', '--md-secondary-container'],
      ['Surface (kanvas)', '--md-surface'],
      ['Surface container', '--md-surface-container'],
      ['On surface', '--md-on-surface'],
      ['On surface variant', '--md-on-surface-variant'],
      ['Outline (batas kontrol)', '--md-outline'],
      ['Outline variant (pemisah)', '--md-outline-variant']
    ],
    status: [
      ['Menunggu', '--status-info-text'],
      ['Perlu perbaikan', '--status-warning-text'],
      ['Terverifikasi', '--status-success-text'],
      ['Ditolak', '--status-danger-text'],
      ['Tergeser', '--status-neutral-text'],
      ['Tombol bahaya', '--status-danger-solid']
    ],
    grafik: [
      ['Zonasi', '--chart-zonasi'],
      ['Prestasi', '--chart-prestasi'],
      ['Afirmasi', '--chart-afirmasi'],
      ['Perpindahan', '--chart-perpindahan']
    ]
  };

  // [nama, token depan, token latar, syarat minimal]
  var CONTRAST = [
    ['Teks utama di kartu', '--md-on-surface', '--md-surface-container-lowest', 4.5],
    ['Teks sekunder di kartu', '--md-on-surface-variant', '--md-surface-container-lowest', 4.5],
    ['Placeholder', '--md-on-surface-muted', '--md-surface-container-lowest', 4.5],
    ['Teks di tombol utama', '--md-on-primary', '--md-primary', 4.5],
    ['Teks di tombol tonal', '--md-on-primary-container', '--md-primary-container', 4.5],
    ['Tag jalur', '--md-on-secondary-container', '--md-secondary-container', 4.5],
    ['Badge menunggu', '--status-info-text', '--status-info-bg', 4.5],
    ['Badge perlu perbaikan', '--status-warning-text', '--status-warning-bg', 4.5],
    ['Badge terverifikasi', '--status-success-text', '--status-success-bg', 4.5],
    ['Badge ditolak', '--status-danger-text', '--status-danger-bg', 4.5],
    ['Badge tergeser', '--status-neutral-text', '--status-neutral-bg', 4.5],
    ['Teks di tombol bahaya', '--md-on-primary', '--status-danger-solid', 4.5],
    ['Teks snackbar', '--md-inverse-on-surface', '--md-inverse-surface', 4.5],
    ['Aksi snackbar', '--md-inverse-primary', '--md-inverse-surface', 4.5],
    ['Batas input', '--md-outline', '--md-surface-container-lowest', 3],
    ['Cincin fokus', '--md-focus-ring', '--md-surface-container-lowest', 3],
    ['Grafik prestasi', '--chart-prestasi', '--md-surface-container-lowest', 3]
  ];

  /* ---------- Membaca warna token sebagai RGB ---------- */
  var probe = document.createElement('span');
  probe.style.display = 'none';
  document.body.appendChild(probe);

  function tokenRgb(token) {
    probe.style.color = 'var(' + token + ')';
    var m = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g) || [0, 0, 0];
    return [Number(m[0]), Number(m[1]), Number(m[2])];
  }

  function toHex(rgb) {
    return '#' + rgb.map(function (v) {
      return Math.round(v).toString(16).padStart(2, '0');
    }).join('').toUpperCase();
  }

  function luminance(rgb) {
    var c = rgb.map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  function ratio(a, b) {
    var l1 = luminance(a);
    var l2 = luminance(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  var formatRatio = new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---------- Swatch ---------- */
  document.querySelectorAll('[data-swatches]').forEach(function (grid) {
    SWATCHES[grid.getAttribute('data-swatches')].forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'sg-swatch';

      var color = document.createElement('div');
      color.className = 'sg-swatch__color';
      color.style.backgroundColor = 'var(' + item[1] + ')';

      var info = document.createElement('div');
      info.className = 'sg-swatch__info';
      [['sg-swatch__name', item[0]], ['sg-swatch__token', item[1]], ['sg-swatch__value', toHex(tokenRgb(item[1]))]]
        .forEach(function (part) {
          var el = document.createElement('span');
          el.className = part[0];
          el.textContent = part[1];
          info.appendChild(el);
        });

      card.append(color, info);
      grid.appendChild(card);
    });
  });

  /* ---------- Uji kontras ---------- */
  var contrastBody = document.querySelector('[data-contrast]');
  CONTRAST.forEach(function (row) {
    var fg = tokenRgb(row[1]);
    var bg = tokenRgb(row[2]);
    var r = ratio(fg, bg);
    var pass = r >= row[3];

    var tr = document.createElement('tr');
    var cells = [
      row[0],
      null,
      formatRatio.format(r) + ':1',
      '≥ ' + formatRatio.format(row[3]) + ':1',
      pass ? 'Lolos' : 'Gagal'
    ];
    cells.forEach(function (text, i) {
      var td = document.createElement('td');
      if (i === 1) {
        var sample = document.createElement('span');
        sample.className = 'badge';
        sample.style.color = 'var(' + row[1] + ')';
        sample.style.backgroundColor = 'var(' + row[2] + ')';
        sample.style.borderColor = 'var(' + row[1] + ')';
        sample.textContent = 'Aa ' + toHex(fg) + ' / ' + toHex(bg);
        td.appendChild(sample);
      } else {
        td.textContent = text;
      }
      if (i === 2 || i === 3) td.className = 'table__num';
      if (i === 4) td.className = pass ? 'sg-pass' : 'sg-fail';
      tr.appendChild(td);
    });
    contrastBody.appendChild(tr);
  });

  /* ---------- Demo: filter chip ---------- */
  document.querySelectorAll('[data-chip-group] .chip--filter').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var on = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', String(on));
      var icon = chip.querySelector('.icon');
      if (on && !icon) {
        icon = document.createElement('span');
        icon.className = 'icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = 'check';
        chip.prepend(icon);
      } else if (!on && icon) {
        icon.remove();
      }
    });
  });

  /* ---------- Demo: tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));

    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) {
        panel.setAttribute('aria-labelledby', tab.id);
        var label = panel.querySelector('[data-tab-label]');
        if (label) label.textContent = tab.firstChild.textContent.trim();
      }
    }

    list.addEventListener('click', function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab) select(tab);
    });

    // Panah kiri/kanan berpindah tab (pola WAI-ARIA)
    list.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0 || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      e.preventDefault();
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next);
      next.focus();
    });
  });

  /* ---------- Demo: urutkan kolom ---------- */
  document.querySelectorAll('[data-sort-demo]').forEach(function (th) {
    th.querySelector('.table__sort').addEventListener('click', function () {
      var asc = th.getAttribute('aria-sort') !== 'ascending';
      th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
      th.querySelector('.icon').textContent = asc ? 'arrow_upward' : 'arrow_downward';
    });
  });

  /* ---------- Demo: dialog ---------- */
  document.querySelectorAll('[data-open-dialog]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = document.getElementById(btn.getAttribute('data-open-dialog'));
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-dialog]') || e.target === dialog) dialog.close();
    });
  });

  /* ---------- Demo: snackbar ---------- */
  var host = document.querySelector('[data-snackbar-host]');
  document.querySelectorAll('[data-show-snackbar]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      host.textContent = '';
      var bar = document.createElement('div');
      bar.className = 'snackbar';
      var msg = document.createElement('span');
      msg.className = 'snackbar__message';
      msg.textContent = 'Data Rahma Aulia dihapus.';
      var action = document.createElement('button');
      action.type = 'button';
      action.className = 'snackbar__action';
      action.textContent = 'Urungkan';
      action.addEventListener('click', function () { bar.remove(); });
      bar.append(msg, action);
      host.appendChild(bar);
      setTimeout(function () { bar.remove(); }, 5000);
    });
  });
})();
