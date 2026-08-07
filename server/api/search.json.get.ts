export default defineEventHandler(async (event) => {
  // Query Nuxt Content for markdown sections
  // @ts-ignore - Nuxt Content v3 typings merge client/server signatures incorrectly
  const sections = await queryCollectionSearchSections(event, 'content')

  // Inject additional non-content actions
  const customItems = [
    {
      id: 'theme-light',
      title: 'Light Mode',
      titles: ['Theme', 'Light Mode'],
      level: 1,
      content: 'Switch to light mode theme',
      type: 'action',
      action: 'theme-light',
    },
    {
      id: 'theme-dark',
      title: 'Dark Mode',
      titles: ['Theme', 'Dark Mode'],
      level: 1,
      content: 'Switch to dark mode theme',
      type: 'action',
      action: 'theme-dark',
    },
    {
      id: 'theme-system',
      title: 'System Theme',
      titles: ['Theme', 'System Theme'],
      level: 1,
      content: 'Switch to system default theme',
      type: 'action',
      action: 'theme-system',
    },
  ]

  return [...sections, ...customItems]
})
