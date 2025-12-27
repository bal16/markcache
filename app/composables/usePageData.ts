export async function usePageData() {
  const route = useRoute();
  const { data: pageData } = await useAsyncData(
    route.path,
    async () => {
      return await queryCollection("content").path(route.path).first();
    },
    {
      watch: [() => route.path],
    }
  );

  return {
    pageData,
  };
}
