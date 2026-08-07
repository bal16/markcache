import Fuse, { type FuseResultMatch } from 'fuse.js'
import { File, Hash, Laptop, Moon, Sun } from 'lucide-vue-next'
import type { Component } from 'vue'
import { computed, ref } from 'vue'

export interface SearchCommand {
  id: string
  title: string
  description: string
  icon: Component
  execute: () => void
}

export interface SearchCommandGroup {
  heading: string
  items: SearchCommand[]
}

interface RawSearchItem {
  id: string
  title: string
  titles?: string[]
  content: string
  level: number
  type?: string
  action?: string
}

export const useSearchEngine = () => {
  const search = ref('')
  const router = useRouter()
  const colorMode = useColorMode()

  // Fetch static data generated at build time
  const { data: rawItems } = useAsyncData('search-index', () =>
    $fetch<RawSearchItem[]>('/api/search.json')
  )

  const fuseInstance = computed(() => {
    if (!rawItems.value) return null
    return new Fuse(rawItems.value, {
      keys: [
        { name: 'title', weight: 0.9 },
        { name: 'titles', weight: 0.5 },
        { name: 'content', weight: 0.1 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
      includeMatches: true,
    })
  })

  const getHighlightSnippet = (content: string, matches?: readonly FuseResultMatch[]) => {
    if (!content || !matches) return ''
    const contentMatch = matches.find((m) => m.key === 'content')
    const firstIndex = contentMatch?.indices?.[0]

    if (!firstIndex) return `${content.substring(0, 60)}...`

    const startIdx = firstIndex[0]
    const endIdx = firstIndex[1]
    const contextStart = Math.max(0, startIdx - 20)
    const contextEnd = Math.min(content.length, endIdx + 40)

    let snippet = content.substring(contextStart, contextEnd)
    if (contextStart > 0) snippet = `...${snippet}`
    if (contextEnd < content.length) snippet = `${snippet}...`

    return snippet
  }

  const commandGroups = computed<SearchCommandGroup[]>(() => {
    if (!search.value || !fuseInstance.value || !rawItems.value) return []

    // Intercept action trigger
    if (search.value.startsWith('>')) {
      const query = search.value.slice(1).trim().toLowerCase()
      const allActions = rawItems.value.filter((i) => i.type === 'action')

      const filteredActions = query
        ? allActions.filter((i) => i.title.toLowerCase().includes(query))
        : allActions

      const actions: SearchCommand[] = filteredActions.map((item) => {
        const theme = item.action?.split('-')[1]
        let icon = Laptop
        if (theme === 'light') icon = Sun
        if (theme === 'dark') icon = Moon

        return {
          id: item.id,
          title: item.title,
          description: item.content,
          icon,
          execute: () => {
            colorMode.preference = theme || 'system'
          },
        }
      })

      return [{ heading: 'Actions', items: actions }]
    }

    const results = fuseInstance.value.search(search.value).slice(0, 15)

    const pages: SearchCommand[] = []
    const sections: SearchCommand[] = []
    const actions: SearchCommand[] = []

    results.forEach((res) => {
      const item = res.item

      // Theme commands
      if (item.type === 'action' && item.action?.startsWith('theme-')) {
        const theme = item.action.split('-')[1]
        let icon = Laptop
        if (theme === 'light') icon = Sun
        if (theme === 'dark') icon = Moon

        actions.push({
          id: item.id,
          title: item.title,
          description: item.content,
          icon,
          execute: () => {
            colorMode.preference = theme || 'system'
          },
        })
        return
      }

      // Page level match
      if (item.level === 1) {
        pages.push({
          id: item.id,
          title: item.title,
          description: item.content ? item.content.substring(0, 60) + '...' : '',
          icon: File,
          execute: () => {
            router.push(item.id)
          },
        })
      } else {
        // Section level match
        const subtitle = item.titles ? item.titles.slice(0, -1).join(' > ') : ''
        const snippet = getHighlightSnippet(item.content, res.matches)

        sections.push({
          id: item.id,
          title: item.title,
          description: subtitle ? `${subtitle} — ${snippet}` : snippet,
          icon: Hash,
          execute: () => {
            router.push(item.id)
          },
        })
      }
    })

    const groups: SearchCommandGroup[] = []
    if (pages.length) groups.push({ heading: 'Pages', items: pages })
    if (sections.length) groups.push({ heading: 'Sections', items: sections })
    if (actions.length) groups.push({ heading: 'Actions', items: actions })

    return groups
  })

  return {
    search,
    commandGroups,
    isReady: computed(() => !!rawItems.value),
  }
}
