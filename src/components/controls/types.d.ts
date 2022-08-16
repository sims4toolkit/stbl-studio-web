export interface FloatingActionButtonData {
  color: string;
  title: string;
  icon: string;
  disabled?: boolean;
  keybinding?: string;
  onClick: () => void
}