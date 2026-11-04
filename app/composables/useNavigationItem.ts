export async function useNavigationItem() {
  const { data: navigation } = await useAsyncData('navigation', () => {
    // Urutan kurasi via field `order` di frontmatter (ADR-003 #4).
    return queryCollectionNavigation('content').order('order', 'ASC')
  })

  // ADR-002: 1 folder = 1 kategori dengan index.md. Folder yang isinya
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

  return {
    navigation: normalized,
  }
}

interface NavNode {
  title: string
  path: string
  children?: NavNode[]
}
