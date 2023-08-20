import Driver from "./Base";
export default class JSONDriver extends Driver {
	private readonly spaces;
	constructor(path?: string, name?: string, spaces?: number);
	clone(path?: string): void;
	save(): void;
	read(): void;
}
//# sourceMappingURL=JSON.d.ts.map
