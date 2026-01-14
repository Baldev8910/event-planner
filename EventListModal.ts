import { App, Modal } from 'obsidian';
import { EventManager, CalendarEvent } from './EventManager';

export class EventListModal extends Modal {
  private eventManager: EventManager;
  private date: string;
  private onEdit: (eventIndex: number) => void;
  private onUpdate: () => void;

  constructor(
    app: App,
    eventManager: EventManager,
    date: string,
    onEdit: (eventIndex: number) => void,
    onUpdate: () => void
  ) {
    super(app);
    this.eventManager = eventManager;
    this.date = date;
    this.onEdit = onEdit;
    this.onUpdate = onUpdate;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('calendar-event-list-modal');

    // Modal title
    contentEl.createEl('h2', { text: `Events for ${this.date}` });

    // Get events for this date
    const events = this.eventManager.getEventsForDate(this.date);

    if (events.length === 0) {
      contentEl.createDiv({ 
        cls: 'calendar-no-events',
        text: 'No events scheduled' 
      });
    } else {
      const listContainer = contentEl.createDiv({ cls: 'calendar-event-list' });

      events.forEach((event, index) => {
        this.renderEventItem(listContainer, event, index);
      });
    }

    // Close button
    const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });
    const closeBtn = buttonContainer.createEl('button', { text: 'Close' });
    closeBtn.addEventListener('click', () => this.close());
  }

  private renderEventItem(container: HTMLElement, event: CalendarEvent, index: number): void {
    const eventItem = container.createDiv({ cls: 'calendar-event-item' });
    
    // Color indicator
    const colorBar = eventItem.createDiv({ cls: 'calendar-event-color-bar' });
    colorBar.style.backgroundColor = event.color;

    // Event content (clickable to edit)
    const eventContent = eventItem.createDiv({ cls: 'calendar-event-content' });
    
    if (event.time) {
      eventContent.createDiv({ cls: 'calendar-event-time', text: event.time });
    }
    
    eventContent.createDiv({ 
      cls: 'calendar-event-title', 
      text: event.title || 'Untitled Event' 
    });
    
    if (event.desc) {
      eventContent.createDiv({ cls: 'calendar-event-desc', text: event.desc });
    }

    // Make content clickable to edit
    eventContent.addEventListener('click', () => {
      this.close();
      this.onEdit(index);
    });

    // Delete button
    const deleteBtn = eventItem.createEl('button', { 
      cls: 'calendar-event-delete',
      text: 'Delete'
    });
    
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await this.handleDelete(index);
    });
  }

  private async handleDelete(eventIndex: number): Promise<void> {
    await this.eventManager.deleteEvent(this.date, eventIndex);
    this.onUpdate();
    
    // Refresh the modal content
    this.onOpen();
  }

  onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
  }
}