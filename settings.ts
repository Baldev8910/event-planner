import { App, PluginSettingTab, Setting } from 'obsidian';
import CalendarEventPlannerPlugin from './main';

export class CalendarSettingTab extends PluginSettingTab {
  plugin: CalendarEventPlannerPlugin;

  constructor(app: App, plugin: CalendarEventPlannerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Calendar Event Planner Settings' });

    new Setting(containerEl)
      .setName('Event file path')
      .setDesc('Path to the JSON file where events will be stored (relative to vault root)')
      .addText(text => text
        .setPlaceholder('calendar-events.json')
        .setValue(this.plugin.settings.eventFilePath)
        .onChange(async (value) => {
          this.plugin.settings.eventFilePath = value || 'calendar-events.json';
          await this.plugin.saveSettings();
          
          // Update event manager with new path
          this.plugin.eventManager = new (await import('./EventManager')).EventManager(
            this.app,
            this.plugin.settings.eventFilePath
          );
        }));

    new Setting(containerEl)
      .setName('About')
      .setDesc('Calendar Event Planner v1.0.0 - A comprehensive calendar with event planning capabilities');
  }
}