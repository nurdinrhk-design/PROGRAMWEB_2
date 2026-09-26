/* =====================================================================
   setup.js — Dimuat SEBELUM shell.js pada halaman uji.
   Mencadangkan lalu mengosongkan data aplikasi (ppdb.v2.*) agar uji
   berjalan di atas data simulasi baru, tanpa mengubah data kerja pengguna.
   core.test.js memulihkan cadangan ini setelah uji selesai.
   ===================================================================== */
(function (window) {
  'use strict';

  var cadangan = { local: {}, session: {} };

  function pindahkan(st, wadah) {
    for (var i = st.length - 1; i >= 0; i--) {
      var k = st.key(i);
      if (k && k.indexOf('ppdb.v2.') === 0) {
        wadah[k] = st.getItem(k);
        st.removeItem(k);
      }
    }
  }

  pindahkan(window.localStorage, cadangan.local);
  pindahkan(window.sessionStorage, cadangan.session);

  window.PPDB_UJI_CADANGAN = cadangan;
})(window);
