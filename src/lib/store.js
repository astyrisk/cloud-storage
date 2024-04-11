import { writable } from 'svelte/store';

/* References to the current dir, a collection
 *
 * */

/* those are currently dictionaries */
// collection of the current docs
export const currentDirStore = writable(null);
export const currentElementsData = writable([]);
export const currentPath = writable([]);
