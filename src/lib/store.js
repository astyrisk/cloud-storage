import { writable } from 'svelte/store';

/* References to the current dir, a collection
 *
 * */

/* those are currently dictionaries */
// collection of the current docs
export const currentDir = writable(null);
export const currentElementsData = writable([]);
export const currentPath = writable([]);
export const rootDir = writable(null);

export const galleryDirs= writable(null);
