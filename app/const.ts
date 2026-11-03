interface SearchResult {
  id: string
  title: string
  path: string
  type: 'file' | 'section'
  subtitle?: string
}

export const GITHUB_URL = 'https://github.com/bal16/markcache'
