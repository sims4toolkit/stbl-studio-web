import type Workspace from "src/lib/models/workspace";
import { writable } from "svelte/store";

export const activeWorkspaceStore = writable<Workspace>(undefined);
export const numMovableWindowsStore = writable<number>(0);
