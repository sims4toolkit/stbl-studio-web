export enum FloatingActionButtonColor {
  Green = "#68A768",
  Cyan = "#5391C7",
  Azure = "#4970C7",
  Red = "#C16262",
  Pink = "#C46DB4",
  Purple = "#845BB5",
  Orange = "#D3975C",
}

export interface FloatingActionButtonData {
  color: keyof typeof FloatingActionButtonColor;
  title: string;
  icon: string;
  disabled?: boolean;
  keybinding?: string;
  onClick: () => void
}
