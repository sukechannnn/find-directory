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
    directories = this.revealDir();

    this.findDirectoryView = new FindDirectoryView(state.findDirectoryViewState, directories);
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

    // atom.workspace.open('/Users/obatayousuke/.ghq/github.com/yosuke0315/find-directory/keymaps');
    return this.findDirectoryView.focus();
  },

  getEntries() {
    parent = atom.project.getDirectories();

    entries = [];
    let revealEntries = (parentEntries) => {
      parentEntries.forEach((entry) => {
        if (entry.isDirectory()) {
          entries.push(entry);
          semiParentEntries = entry.getEntriesSync();
          return revealEntries(semiParentEntries)
        } else {
          return
        }
      });
    }
    revealEntries(parent);
    return entries;
  },

  revealDir() {
    entries = this.getEntries();
    return this.brewDirectory(entries);
  },

  brewDirectory(entries) {
    directories = [];
    entries.forEach((entry) => {
      if (entry.isDirectory()) {
        if (!this.checkVcsIgnores(entry.getPath())) {
          directories.push(entry);
        }
      }
    });
    return directories
  },

  checkVcsIgnores(entry) {
    let rootPath = atom.project.getPaths()[0];
    if (atom.config.get('core.excludeVcsIgnoredPaths')) {
      const repo = GitRepository.open(rootPath, {refreshOnWindowFocus: false});
      if ((repo != null ? repo.relativize(path.join(rootPath, 'test')) : undefined) === 'test') { this.repo = repo; }
      return this.repo.isPathIgnored(entry)
    }
  },
};
