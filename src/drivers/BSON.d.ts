import Driver from "./Base";
export default class BSONDriver extends Driver {
	constructor(path?: string, name?: string);
	clone(path?: string): void;
	save(): void;
	read(): void;
}
//# sourceMappingURL=BSON.d.ts.map
