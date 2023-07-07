# Hyper Database

- Faster, Lightweight and Small advanced Database.Drivers.

## Installation

- We recommend to use [pnpm](https://npmjs.com/pnpm).

```bash
pnpm install hypr.db
```

## Features

- Faster: Optimized for you.
- Lightweight: Low size.
- Multi Support: We are supporting YAML, JSON, HJSON, JSON5, BSON, INI, TOML and CSV!
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

### JSON Driver (Default)

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

### YAML Driver

- You need to download [js-yaml](https://npmjs.com/js-yaml) module.
```bash
pnpm install js-yaml
```

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.Drivers.YAML();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### BSON Driver

- You need to download [bson-ext](https://npmjs.com/bson-ext) module.
```bash
pnpm install bson-ext
```

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.Drivers.BSON();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### TOML Driver

- You need to download [@iarna/toml](https://npmjs.com/@iarna/toml) module.
```bash
pnpm install @iarna/toml
```

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.Drivers.TOML();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### HJSON Driver (Beta)

- You need to download [hjson](https://npmjs.com/hjson) module.
```bash
pnpm install hjson
```

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.Drivers.HJSON();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### JSON5 Driver (Beta)

- You need to download [json5](https://npmjs.com/json5) module.
```bash
pnpm install json5
```

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.Drivers.JSON5();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### INI Driver (Beta)

- You need to download [ini](https://npmjs.com/ini) module.
```bash
pnpm install ini
```

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.Drivers.INI();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### CSON Driver (Beta)

- You need to download [cson](https://npmjs.com/cson) module.
```bash
pnpm install cson
```

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.Drivers.CSON();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```

### CSV Driver (Beta)

- You need to download [csv](https://npmjs.com/csv) module.
```bash
pnpm install csv
```

```js
// ESM
import Database from 'hypr.db';

// CJS
const Database = require('hypr.db'); // or - require('hypr.db/cjs');
const driver = new Database.Drivers.CSV();
const db = new Database({ driver });

db.set('hypr', 'ok');
db.get('hypr');
db.exists('hypr');
db.del('hypr');
```