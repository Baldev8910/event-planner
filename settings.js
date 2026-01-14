import { __awaiter } from "tslib";
import { PluginSettingTab, Setting } from 'obsidian';
export class CalendarSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Calendar Event Planner Settings' });
        new Setting(containerEl)
            .setName('Event file path')
            .setDesc('Path to the JSON file where events will be stored (relative to vault root)')
            .addText(text => text
            .setPlaceholder('calendar-events.json')
            .setValue(this.plugin.settings.eventFilePath)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.eventFilePath = value || 'calendar-events.json';
            yield this.plugin.saveSettings();
            // Update event manager with new path
            this.plugin.eventManager = new (yield import('./EventManager')).EventManager(this.app, this.plugin.settings.eventFilePath);
        })));
        new Setting(containerEl)
            .setName('About')
            .setDesc('Calendar Event Planner v1.0.0 - A comprehensive calendar with event planning capabilities');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFPLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUcxRCxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0JBQWdCO0lBR3RELFlBQVksR0FBUSxFQUFFLE1BQWtDO1FBQ3RELEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELE9BQU87UUFDTCxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzdCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVwQixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxpQ0FBaUMsRUFBRSxDQUFDLENBQUM7UUFFeEUsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQzthQUMxQixPQUFPLENBQUMsNEVBQTRFLENBQUM7YUFDckYsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSTthQUNsQixjQUFjLENBQUMsc0JBQXNCLENBQUM7YUFDdEMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQzthQUM1QyxRQUFRLENBQUMsQ0FBTyxLQUFLLEVBQUUsRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEdBQUcsS0FBSyxJQUFJLHNCQUFzQixDQUFDO1lBQ3JFLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVqQyxxQ0FBcUM7WUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQzFFLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUNuQyxDQUFDO1FBQ0osQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO1FBRVIsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDO2FBQ3JCLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDaEIsT0FBTyxDQUFDLDJGQUEyRixDQUFDLENBQUM7SUFDMUcsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgQ2FsZW5kYXJFdmVudFBsYW5uZXJQbHVnaW4gZnJvbSAnLi9tYWluJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDYWxlbmRhclNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuICBwbHVnaW46IENhbGVuZGFyRXZlbnRQbGFubmVyUGx1Z2luO1xyXG5cclxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBDYWxlbmRhckV2ZW50UGxhbm5lclBsdWdpbikge1xyXG4gICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xyXG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcbiAgfVxyXG5cclxuICBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG4gICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywgeyB0ZXh0OiAnQ2FsZW5kYXIgRXZlbnQgUGxhbm5lciBTZXR0aW5ncycgfSk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKCdFdmVudCBmaWxlIHBhdGgnKVxyXG4gICAgICAuc2V0RGVzYygnUGF0aCB0byB0aGUgSlNPTiBmaWxlIHdoZXJlIGV2ZW50cyB3aWxsIGJlIHN0b3JlZCAocmVsYXRpdmUgdG8gdmF1bHQgcm9vdCknKVxyXG4gICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcclxuICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ2NhbGVuZGFyLWV2ZW50cy5qc29uJylcclxuICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZXZlbnRGaWxlUGF0aClcclxuICAgICAgICAub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ldmVudEZpbGVQYXRoID0gdmFsdWUgfHwgJ2NhbGVuZGFyLWV2ZW50cy5qc29uJztcclxuICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAvLyBVcGRhdGUgZXZlbnQgbWFuYWdlciB3aXRoIG5ldyBwYXRoXHJcbiAgICAgICAgICB0aGlzLnBsdWdpbi5ldmVudE1hbmFnZXIgPSBuZXcgKGF3YWl0IGltcG9ydCgnLi9FdmVudE1hbmFnZXInKSkuRXZlbnRNYW5hZ2VyKFxyXG4gICAgICAgICAgICB0aGlzLmFwcCxcclxuICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZXZlbnRGaWxlUGF0aFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcbiAgICAgIC5zZXROYW1lKCdBYm91dCcpXHJcbiAgICAgIC5zZXREZXNjKCdDYWxlbmRhciBFdmVudCBQbGFubmVyIHYxLjAuMCAtIEEgY29tcHJlaGVuc2l2ZSBjYWxlbmRhciB3aXRoIGV2ZW50IHBsYW5uaW5nIGNhcGFiaWxpdGllcycpO1xyXG4gIH1cclxufSJdfQ==