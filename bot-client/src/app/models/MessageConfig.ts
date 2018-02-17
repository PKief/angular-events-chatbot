import { Location } from './Location';

export interface MessageConfig {
  text?: string;
  title?: string;
  selectionList?: any[];
  locationsList?: Location[];
  locationDetail?: Location;
  bot: boolean;
}
