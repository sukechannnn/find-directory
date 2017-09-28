'use babel';

import FindDirectoryView from './find-directory-view';
import { CompositeDisposable } from 'atom';
import {Task} from 'atom'
import path from 'path';
import {GitRepository} from 'atom';

export default {

  findDirectoryView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // for checkVcsIgnores
    this.rootPath = atom.project.getPaths()[0];
    this.repo = GitRepository.open(this.rootPath, {refreshOnWindowFocus: false});

    var parentPath = atom.project.getDirectories()[0].getEntriesSync();
    var parent = []
    try {
      parentPath.forEach((entry) => {
        if (!this.checkVcsIgnores(entry) && entry.isDirectory()) {
          return parent.push(entry);
        }
      });
      entries = this.getEntries(parent);
    } catch (e) {
      return
    }

    this.findDirectoryView = new FindDirectoryView(state.findDirectoryViewState, entries);
    // this.findDirectoryView = new FindDirectoryView(state.findDirectoryViewState, parent);
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

  checkVcsIgnores(entry) {
    if (atom.config.get('core.excludeVcsIgnoredPaths')) {
      return this.repo.isPathIgnored(entry.getPath())
    }
  },

  getEntries(parentEntries) {
    entries = [];

    let revealEntries = (parentEntries) => {
      parentEntries.forEach((entry) => {
        if (!this.checkVcsIgnores(entry) && entry.isDirectory()) {
          entries.push(entry);
          semiParentEntries = entry.getEntriesSync();
          return revealEntries(semiParentEntries)
        } else {
          return
        }
      });
    }
    revealEntries(parentEntries);
    return entries;
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.findDirectoryView.destroy();
  },

  hide() {
    this.modalPanel.hide();
  },

  serialize() {
    return {
      findDirectoryViewState: this.findDirectoryView.serialize()
    };
  },

  toggle() {
    console.log('FindDirectory was toggled!');

    this.modalPanel.isVisible() ?
    this.modalPanel.hide() :
    this.modalPanel.show()

    return this.findDirectoryView.focus();
  },
};
