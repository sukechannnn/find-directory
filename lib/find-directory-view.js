'use babel';

import {SelectListView} from 'atom-space-pen-views';

class MySelectListView extends SelectListView {
  initialize() {
    super.initialize();
    this.setItems(['Hello', 'World']);
    if (this.panel == null) { this.panel = atom.workspace.addModalPanel({item: this}); }
    this.panel.show();
    return this.focusFilterEditor();
  }

  viewForItem(item) {
    return `<li>${item}</li>`;
  }

  confirmed(item) {
    return console.log(`${item} was selected`);
  }

  cancelled() {
    return console.log("This view was cancelled");
  }
}

export default class FindDirectoryView {

  constructor(serializedState) {
    // Create root element
    this.selectListView = new MySelectListView();

    this.element = this.selectListView.element;
    this.element.classList.add('find-directory');
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
