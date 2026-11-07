<script setup lang="ts">
import { useOnline } from '@vueuse/core'
import { onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'

const { $pwa } = useNuxtApp()

// Indikator konektivitas: beri tahu pengguna saat offline bahwa
// halaman terkurasi tetap tersedia dari cache service worker.
// navigator.onLine di Android sering tetap true walau fisiknya mati,
// jadi keputusan toast selalu difinalkan dengan tes fetch nyata.
const online = useOnline()
const wasOffline = ref(!online.value)

const PING_URL = '/api/search.json'

async function ping(timeoutMs = 4000): Promise<boolean> {
  try {
    const res = await $fetch.raw(`${PING_URL}?ping=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      timeout: timeoutMs,
      ignoreResponseError: true,
    })
    // status 2xx/4xx dari infrastruktur berarti jaringan hidup
    return !!res?.status
  } catch {
    return false
  }
}

// Resolusi status nyata: tandai kembali-online hanya bila ping berhasil;
// pengulangan untuk koneksi yang lambat/intermittent.
async function confirmOnline(maxAttempts = 3): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    if (await ping()) {
      wasOffline.value = false
      return true
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
  return false
}

watch(
  online,
  (isOnline) => {
    if (!isOnline) {
      wasOffline.value = true
      toast.info('Anda sedang offline', {
        description: 'Halaman terkurasi tetap bisa dibuka dari cache.',
      })
    } else if (wasOffline.value) {
      confirmOnline().then((ok) => {
        if (ok) toast.success('Kembali online')
      })
    }
  },
  { immediate: true }
)

// Mount dengan navigator.onLine=true walau fisik offline: verifikasi
// sekali di kali yang pertama; CPU tak jalan buat sesi online normal.
onMounted(async () => {
  if (wasOffline.value) return
  const ok = await ping()
  if (!ok) {
    wasOffline.value = true
    toast.info('Anda sedang offline', {
      description: 'Halaman terkurasi tetap bisa dibuka dari cache.',
    })
  }
})

onMounted(() => {
  if (!$pwa) return

  if ($pwa.offlineReady) {
    toast.success('Aplikasi siap digunakan offline')
  }

  watch(
    () => $pwa.offlineReady,
    (ready) => {
      if (ready) toast.success('Aplikasi siap digunakan offline')
    }
  )

  watch(
    () => $pwa.showInstallPrompt,
    (show) => {
      if (!show) return

      toast('Aplikasi bisa dipasang', {
        description: 'Pasang MarkCache di perangkat untuk akses yang lebih cepat.',
        action: {
          label: 'Pasang',
          onClick: () => {
            $pwa.install().catch(() => {
              toast.error('Gagal memasang aplikasi')
            })
          },
        },
        cancel: {
          label: 'Nanti',
          onClick: () => $pwa.cancelInstall(),
        },
      })
    }
  )

  watch(
    () => $pwa.isPWAInstalled,
    (installed) => {
      if (installed) toast.success('Aplikasi berhasil dipasang')
    }
  )

  watch(
    () => $pwa.needRefresh,
    (need) => {
      if (!need) return
      toast('Versi baru tersedia', {
        description: 'Muat ulang untuk mendapatkan pembaruan.',
        action: {
          label: 'Muat ulang',
          onClick: () => $pwa.updateServiceWorker(true),
        },
      })
    }
  )
})
</script>

<template>
  <!-- Komponen logika saja -->
</template>