import { __awaiter } from "tslib";
import { TFile } from 'obsidian';
export class EventManager {
    constructor(app, filePath) {
        this.events = {};
        this.app = app;
        this.filePath = filePath;
    }
    loadEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = this.app.vault.getAbstractFileByPath(this.filePath);
                if (file instanceof TFile) {
                    const content = yield this.app.vault.read(file);
                    this.events = JSON.parse(content);
                }
            }
            catch (error) {
                console.log('No existing events file, starting fresh');
                this.events = {};
            }
        });
    }
    saveEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const content = JSON.stringify(this.events, null, 2);
                const file = this.app.vault.getAbstractFileByPath(this.filePath);
                if (file instanceof TFile) {
                    yield this.app.vault.modify(file, content);
                }
                else {
                    yield this.app.vault.create(this.filePath, content);
                }
            }
            catch (error) {
                console.error('Error saving events:', error);
            }
        });
    }
    getEvents() {
        return this.events;
    }
    getEventsForDate(date) {
        const events = this.events[date];
        if (!events)
            return [];
        return Array.isArray(events) ? events : [events];
    }
    addEvent(date, event) {
        return __awaiter(this, void 0, void 0, function* () {
            let events = this.events[date];
            if (!events) {
                events = [];
            }
            else if (!Array.isArray(events)) {
                events = [events];
            }
            events.push(event);
            this.events[date] = events;
            yield this.saveEvents();
        });
    }
    updateEvent(date, eventIndex, event) {
        return __awaiter(this, void 0, void 0, function* () {
            let events = this.getEventsForDate(date);
            if (eventIndex >= 0 && eventIndex < events.length) {
                events[eventIndex] = event;
                this.events[date] = events;
                yield this.saveEvents();
            }
        });
    }
    deleteEvent(date, eventIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            let events = this.getEventsForDate(date);
            events.splice(eventIndex, 1);
            if (events.length === 0) {
                delete this.events[date];
            }
            else {
                this.events[date] = events;
            }
            yield this.saveEvents();
        });
    }
    deleteAllEventsForDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            delete this.events[date];
            yield this.saveEvents();
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRXZlbnRNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQU8sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBYXRDLE1BQU0sT0FBTyxZQUFZO0lBS3ZCLFlBQVksR0FBUSxFQUFFLFFBQWdCO1FBRjlCLFdBQU0sR0FBbUIsRUFBRSxDQUFDO1FBR2xDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVLLFVBQVU7O1lBQ2QsSUFBSTtnQkFDRixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2pFLElBQUksSUFBSSxZQUFZLEtBQUssRUFBRTtvQkFDekIsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2hELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDbkM7YUFDRjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7YUFDbEI7UUFDSCxDQUFDO0tBQUE7SUFFSyxVQUFVOztZQUNkLElBQUk7Z0JBQ0YsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsSUFBSSxD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ImltcG9ydCB7IEFwcCwgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhbGVuZGFyRXZlbnQge1xyXG4gIHRpbWU6IHN0cmluZztcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIGRlc2M6IHN0cmluZztcclxuICBjb2xvcjogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBDYWxlbmRhckV2ZW50cyA9IHtcclxuICBbZGF0ZTogc3RyaW5nXTogQ2FsZW5kYXJFdmVudCB8IENhbGVuZGFyRXZlbnRbXTtcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudE1hbmFnZXIge1xyXG4gIHByaXZhdGUgYXBwOiBBcHA7XHJcbiAgcHJpdmF0ZSBmaWxlUGF0aDogc3RyaW5nO1xyXG4gIHByaXZhdGUgZXZlbnRzOiBDYWxlbmRhckV2ZW50cyA9IHt9O1xyXG5cclxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgZmlsZVBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XHJcbiAgfVxyXG5cclxuICBhc3luYyBsb2FkRXZlbnRzKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aCh0aGlzLmZpbGVQYXRoKTtcclxuICAgICAgaWYgKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRzID0gSlNPTi5wYXJzZShjb250ZW50KTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ05vIGV4aXN0aW5nIGV2ZW50cyBmaWxlLCBzdGFydGluZyBmcmVzaCcpO1xyXG4gICAgICB0aGlzLmV2ZW50cyA9IHt9O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgc2F2ZUV2ZW50cygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmV2ZW50cywgbnVsbCwgMik7XHJcbiAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgodGhpcy5maWxlUGF0aCk7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoZmlsZSBpbnN0YW5jZW9mIFRGaWxlKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIGNvbnRlbnQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZSh0aGlzLmZpbGVQYXRoLCBjb250ZW50KTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2F2aW5nIGV2ZW50czonLCBlcnJvcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRFdmVudHMoKTogQ2FsZW5kYXJFdmVudHMge1xyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzO1xyXG4gIH1cclxuXHJcbiAgZ2V0RXZlbnRzRm9yRGF0ZShkYXRlOiBzdHJpbmcpOiBDYWxlbmRhckV2ZW50W10ge1xyXG4gICAgY29uc3QgZXZlbnRzID0gdGhpcy5ldmVudHNbZGF0ZV07XHJcbiAgICBpZiAoIWV2ZW50cykgcmV0dXJuIFtdO1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZXZlbnRzKSA/IGV2ZW50cyA6IFtldmVudHNdO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgYWRkRXZlbnQoZGF0ZTogc3RyaW5nLCBldmVudDogQ2FsZW5kYXJFdmVudCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGV2ZW50cyA9IHRoaXMuZXZlbnRzW2RhdGVdO1xyXG4gICAgXHJcbiAgICBpZiAoIWV2ZW50cykge1xyXG4gICAgICBldmVudHMgPSBbXTtcclxuICAgIH0gZWxzZSBpZiAoIUFycmF5LmlzQXJyYXkoZXZlbnRzKSkge1xyXG4gICAgICBldmVudHMgPSBbZXZlbnRzXTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZXZlbnRzLnB1c2goZXZlbnQpO1xyXG4gICAgdGhpcy5ldmVudHNbZGF0ZV0gPSBldmVudHM7XHJcbiAgICBcclxuICAgIGF3YWl0IHRoaXMuc2F2ZUV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgdXBkYXRlRXZlbnQoZGF0ZTogc3RyaW5nLCBldmVudEluZGV4OiBudW1iZXIsIGV2ZW50OiBDYWxlbmRhckV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICBsZXQgZXZlbnRzID0gdGhpcy5nZXRFdmVudHNGb3JEYXRlKGRhdGUpO1xyXG4gICAgXHJcbiAgICBpZiAoZXZlbnRJbmRleCA+PSAwICYmIGV2ZW50SW5kZXggPCBldmVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGV2ZW50c1tldmVudEluZGV4XSA9IGV2ZW50O1xyXG4gICAgICB0aGlzLmV2ZW50c1tkYXRlXSA9IGV2ZW50cztcclxuICAgICAgYXdhaXQgdGhpcy5zYXZlRXZlbnRzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBkZWxldGVFdmVudChkYXRlOiBzdHJpbmcsIGV2ZW50SW5kZXg6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgbGV0IGV2ZW50cyA9IHRoaXMuZ2V0RXZlbnRzRm9yRGF0ZShkYXRlKTtcclxuICAgIFxyXG4gICAgZXZlbnRzLnNwbGljZShldmVudEluZGV4LCAxKTtcclxuICAgIFxyXG4gICAgaWYgKGV2ZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW2RhdGVdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ldmVudHNbZGF0ZV0gPSBldmVudHM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGF3YWl0IHRoaXMuc2F2ZUV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZGVsZXRlQWxsRXZlbnRzRm9yRGF0ZShkYXRlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1tkYXRlXTtcclxuICAgIGF3YWl0IHRoaXMuc2F2ZUV2ZW50cygpO1xyXG4gIH1cclxufSJdfQ==