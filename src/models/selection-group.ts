export default class SelectionGroup<T> {
  private _selections: Set<T>;

  private _selectMode: boolean;
  get selectMode(): boolean {
    return this._selectMode;
  }

  get noneSelected(): boolean {
    return this._selectMode && this._selections.size === 0;
  }

  constructor(
    readonly selectables: T[],
    readonly key: string,
    private _refreshCallback: () => void
  ) {
    this._selectMode = false;
    this._selections = new Set();
  }

  deselectAll() {
    this._selections.clear();
    this._refreshCallback();
  }

  isSelected(value: T): boolean {
    return this._selections.has(value[this.key]);
  }

  selectAll() {
    this.selectables.forEach(s => this._selections.add(s[this.key]));
    this._refreshCallback();
  }

  toggleSelectMode(value?: boolean) {
    this._selectMode = value ?? !this._selectMode;

    if (!this._selectMode) {
      this.deselectAll();
    } else {
      this._refreshCallback();
    }
  }

  toggleValue(value: T) {
    const key = value[this.key];
    const fn = this._selections.has(key) ? "delete" : "add";
    this._selections[fn](key);
    this._refreshCallback();
  }
}
