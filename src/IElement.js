import _ from 'lodash';

class IElement {
  tag
  props
  children
  key
  constructor(tag, props, children, key) {
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.key = key;
  }

  createElement = (tag, props, children, key) => {
    const el = document.createElement(tag);

    // 给元素添加属性
    _.toPairs(props).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });

    // 添加key
    if (!_.isNil(key)) {
      el.setAttribute('key', String(key));
    }

    // 添加子节点
    _.forEach(children, (child) => {
      let node;

      if (child instanceof IElement) {
        node = this.createElement(
          child.tag,
          child.props,
          child.children,
          child.key,
        );
      } else {
        node = document.createTextNode(child);
      }

      el.appendChild(node);
    });

    return el;
  }

  render() {
    const root = this.createElement(
      this.tag,
      this.props,
      this.children,
      this.key,
    );

    document.body.appendChild(root);

    return root;
  }

  create = () => {
    return this.createElement(
      this.tag,
      this.props,
      this.children,
      this.key,
    );
  }
}

export default IElement;
