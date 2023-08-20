import Driver from "./Base";
export default class JSON5Driver extends Driver {
	private readonly spaces;
	constructor(path?: string, name?: string, spaces?: number);
	clone(path?: string): void;
	save(): void;
	read(): void;
}
//# sourceMappingURL=JSON5.d.ts.map
