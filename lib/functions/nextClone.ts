import { existsSync } from 'node:fs';

export default function nextClone(options: any) {
  let cloneNumber: number = 0;
  let cloneName: string = '';

  while (true) {
    cloneNumber++;
    cloneName = `${options.name}.clone${cloneNumber}.${options.type}`;

    if (!existsSync(options.path + cloneName)) return cloneName;
  };
};