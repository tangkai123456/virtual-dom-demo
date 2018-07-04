import diff from './diff';
import IElement from './IElement';
import patch from './patch';

const test4 = new IElement('div', { class: 'my-div' }, ['test4'], 4)
const test5 = new IElement('ul', { class: 'my-div' }, ['test5'], 3)

const test1 = new IElement('div', { class: 'my-div' }, [test4], 1)

const test2 = new IElement('div', { id: '11' }, [test5, test4], 2)

const root = test1.render()

const pathchs = diff(test1, test2)

setTimeout(() => {
  console.log('开始更新')
  patch(root, pathchs)
  console.log('结束更新')
}, 1000)
