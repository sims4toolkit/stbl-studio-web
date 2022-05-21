import { Writable, writable } from "svelte/store";
import type Workspace from "../models/workspace";

export const activeWorkspace: Writable<Workspace> = writable(null);
