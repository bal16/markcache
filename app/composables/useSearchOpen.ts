export function useSearchOpen() {
  // State global supaya SearchDialog bisa dipicu dari mana saja
  // (header dengan ⌘K, tombol di landing, dsb.).
  const open = useState('search-open', () => false)
  return { open }
}
