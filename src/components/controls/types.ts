export enum FloatingActionButtonColor {
  Green = "#75B175",
  Cyan = "#60A3DD",
  Azure = "#547EDB",
  Red = "#CB6969",
  Pink = "#D176C0",
  Purple = "#9669CB",
  Orange = "#D9A169",
}

export interface FloatingActionButtonData {
  color: keyof typeof FloatingActionButtonColor;
  title: string;
  icon: string;
  disabled?: boolean;
  keybinding?: string;
  onClick: () => void
}
