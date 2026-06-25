export const NAV_STRUCTURE = [
  {
    group: 'Introduction',
    items: [
      { id: 'index', title: 'Overview', file: '/docs/index.md' },
      { id: 'getting-started', title: 'Getting Started', file: '/docs/getting-started.md' },
      { id: 'architecture', title: 'Architecture', file: '/docs/architecture.md' },
    ],
  },
  {
    group: 'HTTP Layer',
    items: [
      { id: 'routing', title: 'Routing', file: '/docs/routing.md' },
      { id: 'request', title: 'Request', file: '/docs/request.md' },
      { id: 'response', title: 'Response', file: '/docs/response.md' },
    ],
  },
  {
    group: 'Middleware',
    items: [
      { id: 'interceptors', title: 'Interceptors', file: '/docs/interceptors.md' },
      { id: 'plugins', title: 'Plugins', file: '/docs/plugins.md' },
      { id: 'decorators', title: 'Decorators', file: '/docs/decorators.md' },
    ],
  },
  {
    group: 'Features',
    items: [
      { id: 'logging', title: 'Logging', file: '/docs/logging.md' },
      { id: 'error-handling', title: 'Error Handling', file: '/docs/error-handling.md' },
      { id: 'file-uploads', title: 'File Uploads', file: '/docs/file-uploads.md' },
      { id: 'static-files', title: 'Static Files', file: '/docs/static-files.md' },
    ],
  },
  {
    group: 'Performance',
    items: [
      { id: 'caching', title: 'Caching', file: '/docs/caching.md' },
      { id: 'rate-limiting', title: 'Rate Limiting', file: '/docs/rate-limiting.md' },
      { id: 'cors', title: 'CORS', file: '/docs/cors.md' },
      { id: 'clustering', title: 'Clustering', file: '/docs/clustering.md' },
      { id: 'schema-serialization', title: 'Schema Serialization', file: '/docs/schema-serialization.md' },
    ],
  },
];

export const ALL_PAGES = NAV_STRUCTURE.flatMap(g => g.items);
