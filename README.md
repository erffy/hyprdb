# Hyper Database

- Faster, Lightweight and Small advanced database.

## Installation

- We recommend to use [`pnpm`](https://npmjs.com/pnpm).

```bash
pnpm install hypr.db
```

## Features

- Faster: Optimized for you.
- Lightweight: Low size.
- Multi Support: We are supporting YAML, JSON and BSON!
- TypeScript typing: For Advanced Efficiency.
- Written with ESM: For better performance.
- Small: Faster download.
- Over 20+ functions

## Usage

- We are supporting typing with [TypeScript](https://typescriptlang.org).

```ts
// ESM
import { Database } from 'hypr.db/esm';

const db = new Database<{ 'hypr': string }>();

db.set('hypr', 'ok');
```

### Json Driver (Default)

```js
// ESM
import { Database } from 'hypr.db/esm';

// CJS
const { Database } = require('hypr.db/cjs');

const db = new Database();

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### Yaml Driver

- You need to download the [`yaml`](https://npmjs.com/yaml) module.

```bash
pnpm install yaml
```

```js
// ESM
import { Database, YAMLDriver } from 'hypr.db/esm';

// CJS
const { Database , YAMLDriver } = require('hypr.db/cjs');
const driver = new YAMLDriver();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### Bson Driver

- You need to download the [`bson`](https://npmjs.com/bson) module.

```bash
pnpm install bson
```

```js
// ESM
import { Database, BSONDriver } from 'hypr.db/esm';

// CJS
const { Database, BSONDriver } = require('hypr.db/cjs');
const driver = new BSONDriver();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```
