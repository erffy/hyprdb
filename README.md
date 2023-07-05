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
import Database from 'hypr.db';

const db = new Database<{ 'hypr': string }>();

db.set('hypr', 'ok');
```

### Json Driver (Default)

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');

const db = new Database();

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### Yaml Driver

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.YAMLDriver();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### Bson Driver

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.BSONDriver();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### Toml Driver

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.TOMLDriver();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```