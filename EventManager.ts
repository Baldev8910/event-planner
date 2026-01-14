import { App, TFile } from 'obsidian';

export interface CalendarEvent {
  time: string;
  title: string;
  desc: string;
  color: string;
}

export type CalendarEvents = {
  [date: string]: CalendarEvent | CalendarEvent[];
};

export class EventManager {
  private app: App;
  private filePath: string;
  private events: CalendarEvents = {};

  constructor(app: App, filePath: string) {
    this.app = app;
    this.filePath = filePath;
  }

  async loadEvents(): Promise<void> {
    try {
      const file = this.app.vault.getAbstractFileByPath(this.filePath);
      if (file instanceof TFile) {
        const content = await this.app.vault.read(file);
        this.events = JSON.parse(content);
      }
    } catch (error) {
      console.log('No existing events file, starting fresh');
      this.events = {};
    }
  }

  async saveEvents(): Promise<void> {
    try {
      const content = JSON.stringify(this.events, null, 2);
      const file = this.app.vault.getAbstractFileByPath(this.filePath);
      
      if (file instanceof TFile) {
        await this.app.vault.modify(file, content);
      } else {
        await this.app.vault.create(this.filePath, content);
      }
    } catch (error) {
      console.error('Error saving events:', error);
    }
  }

  getEvents(): CalendarEvents {
    return this.events;
  }

  getEventsForDate(date: string): CalendarEvent[] {
    const events = this.events[date];
    if (!events) return [];
    return Array.isArray(events) ? events : [events];
  }

  async addEvent(date: string, event: CalendarEvent): Promise<void> {
    let events = this.events[date];
    
    if (!events) {
      events = [];
    } else if (!Array.isArray(events)) {
      events = [events];
    }
    
    events.push(event);
    this.events[date] = events;
    
    await this.saveEvents();
  }

  async updateEvent(date: string, eventIndex: number, event: CalendarEvent): Promise<void> {
    let events = this.getEventsForDate(date);
    
    if (eventIndex >= 0 && eventIndex < events.length) {
      events[eventIndex] = event;
      this.events[date] = events;
      await this.saveEvents();
    }
  }

  async deleteEvent(date: string, eventIndex: number): Promise<void> {
    let events = this.getEventsForDate(date);
    
    events.splice(eventIndex, 1);
    
    if (events.length === 0) {
      delete this.events[date];
    } else {
      this.events[date] = events;
    }
    
    await this.saveEvents();
  }

  async deleteAllEventsForDate(date: string): Promise<void> {
    delete this.events[date];
    await this.saveEvents();
  }
}