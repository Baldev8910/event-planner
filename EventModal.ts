import { App, Modal, Setting } from 'obsidian';
import { EventManager, CalendarEvent } from './EventManager';

export class EventModal extends Modal {
  private eventManager: EventManager;
  private date: string;
  private eventIndex: number | null;
  private onSave: () => void;
  
  private timeInput: HTMLInputElement;
  private titleInput: HTMLInputElement;
  private descInput: HTMLTextAreaElement;
  private colorInput: HTMLInputElement;

  constructor(
    app: App,
    eventManager: EventManager,
    date: string,
    eventIndex: number | null,
    onSave: () => void
  ) {
    super(app);
    this.eventManager = eventManager;
    this.date = date;
    this.eventIndex = eventIndex;
    this.onSave = onSave;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('calendar-event-modal');

    // Modal title
    contentEl.createEl('h2', { 
      text: this.eventIndex !== null ? 'Edit Event' : 'Add Event' 
    });

    // Load existing event data if editing
    let existingEvent: CalendarEvent | null = null;
    if (this.eventIndex !== null) {
      const events = this.eventManager.getEventsForDate(this.date);
      existingEvent = events[this.eventIndex] || null;
    }

    // Date field
    new Setting(contentEl)
      .setName('Date')
      .addText(text => {
        text.setValue(this.date);
        text.setDisabled(true);
      });

    // Time field
    new Setting(contentEl)
      .setName('Time')
      .addText(text => {
        this.timeInput = text.inputEl;
        this.timeInput.type = 'time';
        this.timeInput.value = existingEvent?.time || '';
      });

    // Title field
    new Setting(contentEl)
      .setName('Title')
      .addText(text => {
        this.titleInput = text.inputEl;
        this.titleInput.placeholder = 'Event title';
        this.titleInput.value = existingEvent?.title || '';
        // Make title input wider
        this.titleInput.style.width = '100%';
      });

    // Description field
    new Setting(contentEl)
      .setName('Description')
      .setDesc('Optional event description')
      .addTextArea(text => {
        this.descInput = text.inputEl;
        this.descInput.rows = 3;
        this.descInput.value = existingEvent?.desc || '';
        // Make textarea wider
        this.descInput.style.width = '100%';
      });

    // Color field - using HTML input directly for better compatibility
    const colorSetting = new Setting(contentEl)
      .setName('Border Color')
      .setDesc('Choose event border color');
    
    // Create color input manually
    this.colorInput = colorSetting.controlEl.createEl('input', {
      type: 'color',
      value: existingEvent?.color || '#1CA08F'
    });
    this.colorInput.style.width = '60px';
    this.colorInput.style.height = '30px';
    this.colorInput.style.cursor = 'pointer';

    // Buttons
    const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });

    // Delete button (only show when editing)
    if (this.eventIndex !== null) {
      const deleteBtn = buttonContainer.createEl('button', { 
        text: 'Delete',
        cls: 'mod-warning'
      });
      deleteBtn.addEventListener('click', () => this.handleDelete());
    }

    // Cancel button
    const cancelBtn = buttonContainer.createEl('button', { text: 'Cancel' });
    cancelBtn.addEventListener('click', () => this.close());

    // Save button
    const saveBtn = buttonContainer.createEl('button', { 
      text: 'Save',
      cls: 'mod-cta'
    });
    saveBtn.addEventListener('click', () => this.handleSave());
  }

  async handleSave(): Promise<void> {
    const event: CalendarEvent = {
      time: this.timeInput.value,
      title: this.titleInput.value,
      desc: this.descInput.value,
      color: this.colorInput.value
    };

    // Prevent empty events
    if (!event.title && !event.desc) {
      this.close();
      return;
    }

    if (this.eventIndex !== null) {
      // Update existing event
      await this.eventManager.updateEvent(this.date, this.eventIndex, event);
    } else {
      // Add new event
      await this.eventManager.addEvent(this.date, event);
    }

    this.onSave();
    this.close();
  }

  async handleDelete(): Promise<void> {
    if (this.eventIndex !== null) {
      await this.eventManager.deleteEvent(this.date, this.eventIndex);
      this.onSave();
      this.close();
    }
  }

  onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
  }
}