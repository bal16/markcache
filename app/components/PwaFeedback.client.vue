<script setup lang="ts">
import { useOnline } from '@vueuse/core'
import { onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'

const { $pwa } = useNuxtApp()

// Indikator konektivitas: beri tahu pengguna saat offline bahwa
// halaman terkurasi tetap tersedia dari cache service worker.
const online = useOnline()
const wasOffline = ref(!online.value)

watch(
  online,
  (isOnline) => {
    if (!isOnline) {
      wasOffline.value = true
      toast.info('Anda sedang offline', {
        description: 'Halaman terkurasi tetap bisa dibuka dari cache.',
      })
    } else if (wasOffline.value) {
      wasOffline.value = false
      toast.success('Kembali online')
    }
  },
  { immediate: true }
)

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

      toast('Aplikasi bisa diinstall', {
        description: 'Pasang MarkCache di perangkat untuk akses yang lebih cepat.',
        action: {
          label: 'Install',
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