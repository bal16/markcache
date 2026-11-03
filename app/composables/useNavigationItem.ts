export async function useNavigationItem() {
  const { data: navigation } = await useAsyncData('navigation', () => {
    // Urutan kurasi via field `order` di frontmatter (ADR-003 #4).
    return queryCollectionNavigation('content').order('order', 'ASC')
  })
  return {
    navigation,
  }
}
