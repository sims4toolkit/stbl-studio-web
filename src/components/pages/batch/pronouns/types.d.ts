interface KeyStblPair {
  key: ResourceKey;
  value: StblResourceType;
}

interface StringChange {
  key: number;
  from: string;
  to: string;
}

interface Replacement {
  patterns: string[];
  result: string;
}

type BatchFixResult = {
  stbl: KeyStblPair;
  changes: StringChange[];
}[];