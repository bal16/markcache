import {
  Blocks,
  BookOpen,
  Bot,
  Clapperboard,
  Download,
  File,
  Gamepad2,
  GraduationCap,
  Hash,
  Headphones,
  Laptop,
  Library,
  List,
  Magnet,
  Moon,
  Puzzle,
  Shield,
  Sun,
  Terminal,
  Users,
} from '@lucide/vue'
import Fuse, { type FuseResultMatch } from 'fuse.js'
import type { Component } from 'vue'
import { computed, nextTick, ref } from 'vue'
import type { NavNode } from '~/composables/useNavigationItem'
import { useNavigationItem } from '~/composables/useNavigationItem'

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

export const categoryIconMap: Record<string, Component> = {
  clapperboard: Clapperboard,
  terminal: Terminal,
  blocks: Blocks,
  magnet: Magnet,
  download: Download,
  bot: Bot,
  'book-open': BookOpen,
  library: Library,
  headphones: Headphones,
  puzzle: Puzzle,
  'graduation-cap': GraduationCap,
  'gamepad-2': Gamepad2,
  shield: Shield,
  users: Users,
  list: List,
}

export const useSearchEngine = () => {
  const search = ref('')
  const router = useRouter()
  const colorMode = useColorMode()
  const { navigation, groups: navGroups } = useNavigationItem()

  // Fetch static data generated at build time
  const { data: rawItems } = useAsyncData('search-index', () =>
    $fetch<RawSearchItem[]>('/api/search.json')
  )

  const toggleTheme = (theme: string) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--vt-x', `${window.innerWidth / 2}px`)
      document.documentElement.style.setProperty('--vt-y', `${window.innerHeight / 2}px`)
    }
    if (
      typeof document !== 'undefined' &&
      typeof (document as any).startViewTransition === 'function'
    ) {
      ;(document as any).startViewTransition(async () => {
        colorMode.preference = theme
        await nextTick()
      })
    } else {
      colorMode.preference = theme
    }
  }

  const navMap = computed(() => {
    const map = new Map<string, NavNode>()
    for (const node of navigation.value ?? []) {
      map.set(node.path, node)
    }
    return map
  })

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

  const defaultGroups = computed<SearchCommandGroup[]>(() => {
    const groups: SearchCommandGroup[] = []

    // 1. Quick Link / Index
    const indexNode = navMap.value.get('/directory')
    groups.push({
      heading: 'Navigasi Utama',
      items: [
        {
          id: '/directory',
          title: indexNode?.title || 'Index',
          description: indexNode?.description || 'Peta semua kategori dan subkategori MarkCache',
          icon: categoryIconMap[indexNode?.icon ?? ''] ?? List,
          execute: () => {
            router.push('/directory')
          },
        },
      ],
    })

    // 2. Categories grouped by Domain (Hiburan, Developer, Utilitas, Meta)
    for (const group of navGroups.value) {
      const items: SearchCommand[] = group.items.map((item) => ({
        id: item.path,
        title: item.title,
        description: item.description || '',
        icon: categoryIconMap[item.icon ?? ''] ?? File,
        execute: () => {
          router.push(item.path)
        },
      }))

      if (items.length > 0) {
        groups.push({
          heading: group.label,
          items,
        })
      }
    }

    // 3. Quick Actions
    groups.push({
      heading: 'Aksi',
      items: [
        {
          id: 'action-theme-light',
          title: 'Light Mode',
          description: 'Ganti ke tema terang',
          icon: Sun,
          execute: () => toggleTheme('light'),
        },
        {
          id: 'action-theme-dark',
          title: 'Dark Mode',
          description: 'Ganti ke tema gelap',
          icon: Moon,
          execute: () => toggleTheme('dark'),
        },
      ],
    })

    return groups
  })

  const commandGroups = computed<SearchCommandGroup[]>(() => {
    const trimmed = search.value.trim()

    // Default state when search input is empty: show navigation & quick actions
    if (!trimmed) {
      return defaultGroups.value
    }

    // Intercept action trigger '>'
    if (search.value.startsWith('>')) {
      const query = search.value.slice(1).trim().toLowerCase()
      const allActions = rawItems.value?.filter((i) => i.type === 'action') ?? [
        {
          id: 'theme-light',
          title: 'Light Mode',
          content: 'Switch to light mode theme',
          action: 'theme-light',
        },
        {
          id: 'theme-dark',
          title: 'Dark Mode',
          content: 'Switch to dark mode theme',
          action: 'theme-dark',
        },
      ]

      const filteredActions = query
        ? allActions.filter((i) => i.title.toLowerCase().includes(query))
        : allActions

      const actions: SearchCommand[] = filteredActions.map((item) => {
        const theme = item.action?.split('-')[1] || 'dark'
        let icon = Laptop
        if (theme === 'light') icon = Sun
        if (theme === 'dark') icon = Moon

        return {
          id: item.id,
          title: item.title,
          description: item.content || '',
          icon,
          execute: () => toggleTheme(theme),
        }
      })

      return [{ heading: 'Actions', items: actions }]
    }

    if (!fuseInstance.value || !rawItems.value) return []

    const results = fuseInstance.value.search(trimmed).slice(0, 15)

    const pages: SearchCommand[] = []
    const sections: SearchCommand[] = []
    const actions: SearchCommand[] = []

    results.forEach((res) => {
      const item = res.item

      // Theme commands
      if (item.type === 'action' && item.action?.startsWith('theme-')) {
        const theme = item.action.split('-')[1] || 'dark'
        let icon = Laptop
        if (theme === 'light') icon = Sun
        if (theme === 'dark') icon = Moon

        actions.push({
          id: item.id,
          title: item.title,
          description: item.content,
          icon,
          execute: () => toggleTheme(theme),
        })
        return
      }

      // Page level match
      if (item.level === 1) {
        const navNode = navMap.value.get(item.id)
        const icon = navNode?.icon
          ? (categoryIconMap[navNode.icon] ?? File)
          : item.id === '/directory'
            ? List
            : File

        pages.push({
          id: item.id,
          title: item.title,
          description: item.content
            ? `${item.content.substring(0, 60)}...`
            : navNode?.description || '',
          icon,
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
