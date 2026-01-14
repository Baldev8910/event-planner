import { ItemView, WorkspaceLeaf } from 'obsidian';
import { EventManager } from './EventManager';
import { CalendarRenderer } from './CalendarRenderer';
import { EventModal } from './EventModal';
import { EventListModal } from './EventListModal';

export const VIEW_TYPE_CALENDAR = 'calendar-event-planner';

export class CalendarView extends ItemView {
  private eventManager: EventManager;
  private renderer: CalendarRenderer;

  constructor(leaf: WorkspaceLeaf, eventManager: EventManager) {
    super(leaf);
    this.eventManager = eventManager;
  }

  getViewType(): string {
    return VIEW_TYPE_CALENDAR;
  }

  getDisplayText(): string {
    return 'Calendar';
  }

  getIcon(): string {
    return 'calendar';
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('calendar-view-container');

    // Load events
    await this.eventManager.loadEvents();

    // Initialize renderer
    this.renderer = new CalendarRenderer(
      container as HTMLElement,
      this.eventManager,
      this.openEventModal.bind(this),
      this.openEventListModal.bind(this)
    );

    // Render calendar
    this.renderer.render();
  }

  async onClose(): Promise<void> {
    // Cleanup
  }

  private openEventModal(date: string, eventIndex: number | null = null): void {
    new EventModal(
      this.app,
      this.eventManager,
      date,
      eventIndex,
      () => this.renderer.refresh()
    ).open();
  }

  private openEventListModal(date: string): void {
    new EventListModal(
      this.app,
      this.eventManager,
      date,
      (eventIndex) => this.openEventModal(date, eventIndex),
      () => this.renderer.refresh()
    ).open();
  }
}