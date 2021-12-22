import { readFileSync } from 'node:fs';
import { join as pathJoin, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface Config {
    vk: {
        token: string;
        allowIds: number[];
    };
}

const configFile = readFileSync(
    pathJoin(__dirname, '..', process.env.NODE_ENV === 'development' ? 'dev.config.json' : 'config.json'),
    'utf-8'
);

export const cfg: Config = JSON.parse(configFile.replace(/\/\/.*$/gm, ''));
