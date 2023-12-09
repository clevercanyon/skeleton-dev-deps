/**
 * Tailwind brand acquisition.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */

import sync from 'make-synchronous';
import fs from 'node:fs';
import path from 'node:path';
import { $brand, $fn, $json } from '../../../node_modules/@clevercanyon/utilities/dist/index.js';

// `__dirname` already exists when loaded by Tailwind via Jiti / commonjs.
// eslint-disable-next-line no-undef -- `__dirname` is not actually missing.
const projDir = path.resolve(__dirname, '../../..');

const pkgFile = path.resolve(projDir, './package.json');
const pkg = $json.parse(fs.readFileSync(pkgFile).toString());

const brandConfigFile = path.resolve(projDir, './brand.config.mjs');
const brandConfigSync = sync(async (brandConfigFile) => await (await import(brandConfigFile)).default());

/**
 * Acquires app’s brand for configuration of Tailwind themes.
 *
 * Jiti, which is used by Tailwind to load ESM config files, doesn’t support top-level await. Thus, we cannot use async
 * functionality here. Consider `make-synchronous` (already in dev-deps) if necessary. {@see https://o5p.me/1odhxy}.
 */
export default /* not async compatible */ () => {
    let brand = $fn.try(() => $brand.get(pkg.name), undefined)();
    if (brand) return brand; // That was’t such a chore, now was it?

    return process.env._APP_BASE_URL
        ? $brand.addApp({
              pkgName: pkg.name,
              baseURL: process.env._APP_BASE_URL,
              props: brandConfigSync(brandConfigFile),
          })
        : undefined;
};
