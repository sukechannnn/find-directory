'use babel';

import FindDirectoryView from './find-directory-view';
import { CompositeDisposable } from 'atom';

export default {

  findDirectoryView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.findDirectoryView = new FindDirectoryView(state.findDirectoryViewState, ['a', 'b']);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.findDirectoryView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'find-directory:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.findDirectoryView.destroy();
  },

  serialize() {
    return {
      findDirectoryViewState: this.findDirectoryView.serialize()
    };
  },

  toggle() {
    console.log('FindDirectory was toggled!');

    entries = this.getDir();
    console.log(entries[0].getPath());

    this.modalPanel.isVisible() ?
    this.modalPanel.hide() :
    this.modalPanel.show()

    return this.findDirectoryView.focus();
  },

  getDir() {
    parentDir = atom.project.getDirectories();
    entries = parentDir[0].getEntriesSync();
    return entries;
  },
};
