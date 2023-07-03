# Nova Database

- Faster, Lightweight and Small advanced database.

## Installation

- We recommend to use [`pnpm`](https://npmjs.com/pnpm).

```bash
pnpm install nova.db
```

## Features

- Faster
- Lightweight
- JSON, BSON and YAML databases
- TypeScript typing
- Written with ESM
- Small
- Over 20+ functions

## Usage

- We are supporting typing with [TypeScript](https://typescriptlang.org).

```ts
// ESM
import { Database } from '@erqeweew/nova.db';

const db = new Database<{ 'nova': string }>();

db.set('nova', 'ok');
```

### Json Provider (Default)

```js
// ESM
import { Database } from '@erqeweew/nova.db';

// CJS
const { Database } = require('@erqeweew/nova.db');

const db = new Database();

db.set('nova', 'ok');
db.get('nova');
db.exists('nova');
db.del('nova');
```

### Yaml Provider

- You need to download the [`yaml`](https://npmjs.com/yaml) module.

```bash
pnpm install yaml
```

```js
// ESM
import { Database, YAMLProvider } from '@erqeweew/nova.db';

// CJS
const { Database , YAMLProvider } = require('@erqeweew/nova.db');
const provider = new YAMLProvider();
const db = new Database({ provider });

db.set('nova', 'ok');
db.get('nova');
db.exists('nova');
db.del('nova');
```

### Bson Provider

- You need to download the [`bson`](https://npmjs.com/bson) module.

```bash
pnpm install bson
```

```js
// ESM
import { Database, BSONProvider } from '@erqeweew/nova.db';

// CJS
const { Database, BSONProvider } = require('@erqeweew/nova.db');
const provider = new BSONProvider();
const db = new Database({ provider });

db.set('nova', 'ok');
db.get('nova');
db.exists('nova');
db.del('nova');
```