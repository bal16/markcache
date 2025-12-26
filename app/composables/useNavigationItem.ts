export async function useNavigationItem() {
  const { data: navigation } = await useAsyncData("navigation", () => {
    return queryCollectionNavigation("content").order("title", "ASC");
  });
  return {
    navigation,
  };
}
