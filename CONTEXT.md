# Domain Model

## Search

- **SearchCommand**: A generic, executable action returned by a search query. It encapsulates its own execution logic (e.g. navigating to a page, toggling a theme), allowing the UI to remain agnostic of the action type.
- **SearchEngine**: The module responsible for taking a user query, searching across available data sources (files, sections, system commands), and returning a ranked list of `SearchCommand`s.
