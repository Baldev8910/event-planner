import { App, Plugin, WorkspaceLeaf } from 'obsidian';
import { CalendarView, VIEW_TYPE_CALENDAR } from './CalendarView';
import { CalendarSettingTab } from './settings';
import { EventManager } from './EventManager';

export interface CalendarSettings {
  eventFilePath: string;
}

const DEFAULT_SETTINGS: CalendarSettings = {
  eventFilePath: 'calendar-events.json'
};

export default class CalendarEventPlannerPlugin extends Plugin {
  settings: CalendarSettings = DEFAULT_SETTINGS;
  eventManager!: EventManager;
  app: App;

  async onload() {
    await this.loadSettings();

    // Initialize event manager
    this.eventManager = new EventManager(this.app, this.settings.eventFilePath);

    // Register the calendar view
    this.registerView(
      VIEW_TYPE_CALENDAR,
      (leaf: WorkspaceLeaf) => new CalendarView(leaf, this.eventManager)
    );

    // Add ribbon icon
    this.addRibbonIcon('calendar', 'Open Calendar', () => {
      this.activateView();
    });

    // Add command to open calendar
    this.addCommand({
      id: 'open-calendar',
      name: 'Open Calendar',
      callback: () => {
        this.activateView();
      }
    });

    // Add settings tab
    this.addSettingTab(new CalendarSettingTab(this.app, this));
  }

  async activateView() {
    const { workspace } = this.app;
    
    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_CALENDAR);

    if (leaves.length > 0) {
      // View already exists, reveal it
      leaf = leaves[0];
    } else {
      // Create new leaf in main workspace (center pane)
      leaf = workspace.getLeaf('tab');
      await leaf.setViewState({
        type: VIEW_TYPE_CALENDAR,
        active: true,
      });
    }

    workspace.revealLeaf(leaf);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    // Cleanup
  }
}