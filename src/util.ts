import IElement from './IElement';

export enum STATE_ENUMS {
  CHANGE_PROPS = 1,
  INSERT = 2,
  MOVE = 3,
  REMOVE = 4,
  REPLACE = 5,
}

export interface patchItem {
  type: STATE_ENUMS;
  index: number;
  from: number;
  to: number;
  node: IElement;
  props: IElement['props'];
}

export default {
  STATE_ENUMS,
};
