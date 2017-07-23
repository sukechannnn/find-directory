'use babel';

import FindDirectory from './find-directory';
import {Directory} from 'atom'
import {SelectListView} from 'atom-space-pen-views';
import fs from 'fs'

class MySelectListView extends SelectListView {
  constructor(directories) {
    super();
    this.rootPath = atom.project.getPaths()[0];

    this.directories = this.brewDirectory(directories).map((directory) => {
      return atom.project.relativizePath(directory.getRealPathSync())[1];
    });
    this.directories.shift();
    this.directories.unshift('root');
    this.setItems(this.directories);
  }

  initialize() {
    super.initialize();
    if (this.panel == null) { this.panel = atom.workspace.addModalPanel({item: this}); }
    this.panel.show();
  }

  brewDirectory(entries) {
    directories = [];
    entries.forEach((entry) => {
      if (entry.isDirectory()) {
        directories.push(entry);
      }
    });
    return directories
  }

  brewFile(entries) {
    files = [];
    entries.forEach((entry) => {
      if (entry.isFile()) {
        files.push(entry);
      }
    });
    return files
  }

  viewForItem(item) {
    return `<li>${item}</li>`;
    // return `<li>${item.getBaseName()}</li>`;
  }

  confirmed(item) {
    let filepath = this.rootPath + '/' + item;
    if (fs.existsSync(filepath) && fs.statSync(filepath).isDirectory()) {

      let entry = new Directory(filepath);
      this.itemReset(entry);
    } else if (item == 'root') {
      let entry = new Directory(this.rootPath);
      this.itemReset(entry);
    } else {
      atom.workspace.open(filepath);
    }
  }

  itemReset(entry) {
    let entries = entry.getEntriesSync();
    let fileEntries = this.brewFile(entries);
    let filelist = fileEntries.map((file) => {
      return atom.project.relativizePath(file.getRealPathSync())[1];
    });
    this.setItems(filelist);
  }

  cancelled() {
    console.log("This view was cancelled");
    return FindDirectory.hide();
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
