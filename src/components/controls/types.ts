export enum FloatingActionButtonColor {
  Green = "var(--toolbar-green)",
  Cyan = "var(--toolbar-cyan)",
  Azure = "var(--toolbar-azure)",
  Red = "var(--toolbar-red)",
  Pink = "var(--toolbar-pink)",
  Purple = "var(--toolbar-purple)",
  Orange = "var(--toolbar-orange)",
}

export interface FloatingActionButtonData {
  color: keyof typeof FloatingActionButtonColor;
  title: string;
  icon: string;
  disabled?: boolean;
  keybinding?: string;
  onClick: () => void
}
