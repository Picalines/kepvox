# @repo/editor

Node-based music editor

## Usage

```typescript
import { Editor, type Project } from '@repo/editor'

declare const project: Project = {/* ... */}

<Editor project={project} onChange={() => {/* ... */}} />
```

## Development

```bash
# Start Storybook for component development
pnpm dev

# Run tests
pnpm test:screen
```

