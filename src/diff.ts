import * as _ from 'lodash';
import { STATE_ENUMS } from './util';
import IElement from './IElement';

function diff(oldTree: IElement, newTree: IElement) {
  // 记录差异
  const pathchs = {};

  //  比较不同 从0开始
  dfs(oldTree, newTree, 0, pathchs);

  return pathchs;
}

/**
 * 寻找新旧节点的不同
 * @param oldNode 旧结点
 * @param newNode 新结点
 * @param index
 * @param pathchs
 */
function dfs(
  oldNode: IElement | string,
  newNode: IElement | string,
  index: number,
  pathchs: object,
) {
  // 保存子树的修改
  const curPatches = [];

  // 判断三种情况

  if (_.isEmpty(newNode)) {
    // 如果没有新结点，do nothing
  } else if (_.isEqual(newNode.tag, oldNode.tag) && _.isEqual(newNode.key, oldNode.key)) {
    // 如果新旧节点只有属性不同
    const props = diffProps(newNode.props, oldNode.props);
    if (!_.isEmpty(props)) {
      curPatches.push({
        props,
        type: STATE_ENUMS.CHANGE_PROPS,
      });
    }

    // 查找子节点的不同
    diffChildren(oldNode.children, newNode.children, index, pathchs);
  } else {
    // 如果新旧结点类型不同，则替换
    curPatches.push({
      type: STATE_ENUMS.REPLACE,
      node: newNode,
    });
  }

  pathchs[index] = [...(pathchs[index] || []), ...curPatches];
}

function diffProps(oldProps: object, newProps: object): object[] {
  const change: object[] = [];

  // 寻找被删除的属性
  _.keys(oldProps).forEach((item) => {
    if (!newProps[item]) {
      change.push({
        prop: item,
      });
    }
  });

  // 寻找修改的和增加的属性
  _.toPairs(newProps).forEach(([key, value]) => {
    if (!oldProps[key] || !_.isEqual(oldProps[key], value)) {
      change.push({
        value,
        prop: key,
      });
    }
  });

  return change;
}

/**
 * 判断子节点的不同
 * 先遍历同级children寻找修改
 * 再进入每个子节点的子节点
 * @param oldChild
 * @param newChild
 * @param index
 * @param pathchs
 */
function diffChildren(
  oldChild: IElement['children'],
  newChild: IElement['children'],
  index: number,
  pathchs: object) {
  const { changes, list } = listDiff(oldChild, newChild);

  pathchs[index] = [...(pathchs[index] || []), ...changes];

  let last: IElement | string;

  let newIndex = index;

  _.forEach(oldChild, (child) => {
    if (child instanceof IElement && child.children) {
      newIndex = last instanceof IElement && last.children
        ? index + last.children.length + 1 : index + 1;

      const keyIndex = _.findIndex(list, child.key);
      const node = newChild[keyIndex];
      if (node) {
        dfs(child, node, newIndex, pathchs);
      }
    } else {
      newIndex += 1;
    }

    last = child;
  });
}

function listDiff(
  oldList: IElement['children'],
  newList: IElement['children'],
) {
  const oldKeys = _.map(oldList, 'key');
  const newKeys = _.map(newList, 'key');

  const changes: object[] = [];
  const list: (IElement['key'])[] = [];  //  保存变更后的结点数据

  // 看新的children中是否有当前结点，如果没有，就删除
  _.forEach(oldList, (item) => {
    const { key } = item;
    const index = _.findIndex(newKeys, key);
    if (key && index > -1) {
      list.push(key);
    } else {
      list.push();
    }
  });

  // 从后往前删除
  _.forEachRight(list, (item, index) => {
    if (_.isNil(item)) {
      list.splice(index, 1);
      changes.push({
        index,
        type: STATE_ENUMS.REMOVE,
      });
    }
  });

  _.forEach(newList, (item, index) => {
    const { key } = item;
    const oldIndex = _.findIndex(oldKeys, key);

    if (_.isNil(key) || oldIndex < 0) {
      // 如果item是个新结点，则插入
      list.splice(index, 0, key);
      changes.push({
        index,
        node: item,
        type: STATE_ENUMS.INSERT,
      });
    } else if (oldIndex > -1 && oldIndex !== index) {
      // 如果是个旧结点换了位置
      const moveItem = list.splice(oldIndex, 1)[0];
      list.splice(index, 0, moveItem);
      changes.push({
        from: oldIndex,
        to: index,
        type: STATE_ENUMS.MOVE,
      });
    }
  });

  return { list, changes };
}

export default diff;
