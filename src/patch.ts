import * as _ from 'lodash';
import { STATE_ENUMS, patchItem } from './util';

let index = 0;

function patch(node: Node, patchs: object) {
  const changes = patchs[index];
  const { childNodes } = node;

  if (_.isNil(childNodes)) {
    index += 1;
  }

  if (!_.isEmpty(changes)) {
    changeDOM(node as HTMLElement, changes);
  }

  let last: Node;

  _.forEach(childNodes, (item) => {
    index = last && last.childNodes ? index + last.childNodes.length + 1 : index + 1;
    patch(item, patchs);

    last = item;
  });
}

function changeDOM(node: HTMLElement, changes: patchItem[]) {
  _.forEach(changes, (change: patchItem) => {
    const { type, props, index, from, to } = change;

    switch (type) {
      case STATE_ENUMS.CHANGE_PROPS:
        _.forEach(props, (item: { prop: string, value: string }) => {
          if (item.value) {
            node.setAttribute(item.prop, item.value);
          } else {
            node.removeAttribute(item.prop);
          }
        });
        break;
      case STATE_ENUMS.INSERT:
        const dom = change.node.create();
        node.insertBefore(dom, node.childNodes[index]);
        break;
      case STATE_ENUMS.MOVE:
        const moveItem = node.childNodes[from];
        node.removeChild(moveItem);
        node.insertBefore(moveItem, node.childNodes[to + 1]);
        break;
      case STATE_ENUMS.REMOVE:
        node.childNodes[index].remove();
        break;
      case STATE_ENUMS.REPLACE:
        node.parentNode && node.parentNode.replaceChild(change.node.create(), node);
        break;
      default:
        break;
    }
  });
}

export default patch;
