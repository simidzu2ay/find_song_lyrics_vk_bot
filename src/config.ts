import { readFileSync } from 'fs';
import { join as pathJoin } from 'path';

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
