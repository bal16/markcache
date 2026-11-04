<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'

const { $pwa } = useNuxtApp()

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