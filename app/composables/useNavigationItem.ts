export async function useNavigationItem() {
  const { data: navigation } = await useAsyncData('navigation', () => {
    // Urutan kurasi via field `order` di frontmatter;
    // `domain` dibawa juga untuk grouping sidebar (ADR-006, tampilan-only).
    return queryCollectionNavigation('content', ['domain', 'order']).order('order', 'ASC')
  })

  // 1 folder = 1 kategori dengan index.md. Folder yang isinya
  // cuma index.md di-promote jadi item mandiri — judul pakai title halaman,
  // tanpa parent collapsible duplikat (folder-name di-mask SidebarItem).
  const normalized = computed(() => {
    const promote = (node: NavNode): NavNode => {
      if (!node) return node
      const original = node.children
      if (!original?.length) return node
      const children = original.map(promote)
      const first = children[0]
      if (first && children.length === 1 && first.path === node.path && !first.children) {
        return first
      }
      return { ...node, children }
    }
    return (navigation.value ?? []).filter(Boolean).map(promote)
  })

  // Grouping domain untuk sidebar: heading non-klik per domain,
  // semua link tetap flat (landing & sidebar konsep sama).
  const groups = computed(() => {
    return DOMAIN_ORDER.map((domain) => ({
      domain,
      label: DOMAIN_LABEL[domain] ?? domain,
      items: normalized.value.filter((n) => (n.domain ?? 'utilitas') === domain),
    })).filter((g) => g.items.length > 0)
  })

  return {
    navigation: normalized,
    groups,
  }
}

// ADR-006: kelompok top-level. Dipakai landing & sidebar (heading per domain).
export const DOMAIN_ORDER = ['hiburan', 'dev', 'utilitas', 'meta'] as const
export const DOMAIN_LABEL: Record<string, string> = {
  hiburan: 'Hiburan',
  dev: 'Developer',
  utilitas: 'Utilitas',
  meta: 'Meta',
}

interface NavNode {
  title: string
  path: string
  domain?: string
  children?: NavNode[]
}
