'use babel';

import {SelectListView} from 'atom-space-pen-views';

class MySelectListView extends SelectListView {
  constructor(directories) {
    super();
    this.directories = directories.map((directory) => {
      return directory.getBaseName();
    });
    this.setItems(this.directories);
  }

  initialize() {
    super.initialize();
    this.setItems(this.directories);
    if (this.panel == null) { this.panel = atom.workspace.addModalPanel({item: this}); }
    this.panel.show();
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

  constructor(serializedState, directories) {
    this.directories = directories;
    // Create root element
    this.selectListView = new MySelectListView(this.directories);

    this.element = this.selectListView.element;
    this.element.classList.add('find-directory');
  }

  focus() {
    return this.selectListView.focusFilterEditor();
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
