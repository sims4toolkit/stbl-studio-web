export default class SelectionGroup<Selectable, KeyType extends string | number = string> {
  private _selections: Set<KeyType>;

  private _selectMode: boolean;
  get selectMode(): boolean {
    return this._selectMode;
  }

  get allSelectedKeys(): KeyType[] {
    return Array.from(this._selections);
  }

  get allSelectedItems(): Selectable[] {
    return this.selectables.filter(s => this._selections.has(s[this.key]));
  }

  get noneSelected(): boolean {
    return this._selectMode && this._selections.size === 0;
  }

  constructor(
    readonly selectables: Selectable[],
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

  isSelected(value: Selectable): boolean {
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

  toggleValue(value: Selectable) {
    const key = value[this.key];
    const fn = this._selections.has(key) ? "delete" : "add";
    this._selections[fn](key);
    this._refreshCallback();
  }
}
