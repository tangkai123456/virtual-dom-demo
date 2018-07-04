import * as _ from 'lodash';

class IElement {
  /**
   * @param tag 节点类型
   * @param props 节点属性
   * @param children 子节点
   * @param key
   */
  constructor(
    public tag: string,
    public props: object,
    public children: (IElement | string)[],
    public key: string | number | undefined,
  ) { }

  public createElement = (
    tag: string,
    props: object,
    children: IElement['children'],
    key: IElement['key'],
  ): Node => {
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
    _.forEach(children, (child: IElement | string) => {
      let node: Node | Text;

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

  public render(): Node {
    const root = this.createElement(
      this.tag,
      this.props,
      this.children,
      this.key,
    );

    document.body.appendChild(root);

    return root;
  }

  public create = () => {
    return this.createElement(
      this.tag,
      this.props,
      this.children,
      this.key,
    );
  }
}

export default IElement;
