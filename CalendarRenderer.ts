import { EventManager } from './EventManager';

export type ViewMode = 'full' | 'month' | 'week';

export class CalendarRenderer {
  private container: HTMLElement;
  private eventManager: EventManager;
  private currentView: ViewMode = 'full';
  private gridContainer: HTMLElement;
  private openEventModalCallback: (date: string, eventIndex: number | null) => void;
  private openEventListModalCallback: (date: string) => void;

  private today = new Date();
  private todayStr = this.today.toISOString().split('T')[0];
  private year = this.today.getFullYear();
  private currentMonth = this.today.getMonth();
  private quarter = Math.ceil((this.currentMonth + 1) / 3);

  private themes = {
    1: { title: 'Q1 - Winter/Spring Reset', subtitle: 'January – March' },
    2: { title: 'Q2 - Summer Surge', subtitle: 'April – June' },
    3: { title: 'Q3 - Monsoon Momentum', subtitle: 'July – September' },
    4: { title: 'Q4 - Winter Lock-In', subtitle: 'October – December' }
  };

  private months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    container: HTMLElement,
    eventManager: EventManager,
    openEventModal: (date: string, eventIndex: number | null) => void,
    openEventListModal: (date: string) => void
  ) {
    this.container = container;
    this.eventManager = eventManager;
    this.openEventModalCallback = openEventModal;
    this.openEventListModalCallback = openEventListModal;
  }

  render(): void {
    this.container.empty();

    const root = this.container.createDiv({ cls: 'cal-container' });

    // Create header
    this.createHeader(root);

    // Create grid container
    this.gridContainer = root.createDiv({ cls: 'cal-grid' });

    // Render calendar
    this.renderCalendar();
  }

  refresh(): void {
    this.renderCalendar();
  }

  private createHeader(root: HTMLElement): void {
    const header = root.createDiv({ cls: 'cal-header' });
    
    const theme = this.themes[this.quarter as keyof typeof this.themes];
    header.createDiv({ cls: 'cal-title', text: theme.title });
    
    // Format current date for subtitle
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = this.today.toLocaleDateString('en-US', dateOptions);
    
    header.createDiv({ cls: 'cal-sub', text: formattedDate });

    // Create toggle switch
    this.createToggleSwitch(header);
  }

  private createToggleSwitch(header: HTMLElement): void {
    const toggleContainer = header.createDiv({ cls: 'cal-toggle-container' });
    const toggleSwitch = toggleContainer.createDiv({ cls: 'cal-toggle-switch' });
    const toggleKnob = toggleSwitch.createDiv({ cls: 'cal-toggle-knob' });

    toggleSwitch.createSpan({ cls: 'cal-toggle-label cal-toggle-year', text: 'Year' });
    toggleSwitch.createSpan({ cls: 'cal-toggle-label cal-toggle-month', text: 'Month' });
    toggleSwitch.createSpan({ cls: 'cal-toggle-label cal-toggle-week', text: 'Week' });

    let toggleState = 0;

    toggleSwitch.addEventListener('click', () => {
      toggleState = (toggleState + 1) % 3;

      toggleSwitch.removeClass('state-0', 'state-1', 'state-2');
      toggleSwitch.addClass(`state-${toggleState}`);

      if (toggleState === 0) {
        this.currentView = 'full';
      } else if (toggleState === 1) {
        this.currentView = 'month';
      } else {
        this.currentView = 'week';
      }

      this.renderCalendar();
    });
  }

  private renderCalendar(): void {
    this.gridContainer.empty();

    let monthsToShow: number[] = [];

    if (this.currentView === 'full') {
      monthsToShow = Array.from({ length: 12 }, (_, i) => i);
    } else {
      monthsToShow = [this.currentMonth];
    }

    monthsToShow.forEach((mi) => {
      this.renderMonth(mi);
    });

    // Apply event borders
    setTimeout(() => this.applyEventBorders(), 100);
  }

  private renderMonth(monthIndex: number): void {
    const box = this.gridContainer.createDiv({ cls: 'cal-month' });
    box.createEl('h3', { text: this.months[monthIndex] });

    const cal = box.createDiv({ cls: 'cal-calendar' });

    // Weekday headers
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => {
      const wd = cal.createDiv({ cls: 'cal-wd' });
      if (d === 'Sun') wd.addClass('sunday');
      wd.setText(d);
    });

    // Calculate days
    const { startDay, endDay } = this.calculateDaysToShow(monthIndex);

    // Empty cells
    const firstDayOfMonth = this.getFirstDay(this.year, monthIndex);
    for (let i = 0; i < firstDayOfMonth; i++) {
      cal.createDiv({ cls: 'cal-day cal-empty' });
    }

    // Day cells
    for (let d = startDay; d <= endDay; d++) {
      const date = this.formatDate(this.year, monthIndex, d);
      const cell = cal.createDiv({ cls: 'cal-day', text: d.toString() });
      cell.dataset.date = date;

      if (date === this.todayStr) {
        cell.addClass('today');
      }

      // Right-click context menu
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.showContextMenu(e, date);
      });

      // Add tooltip
      this.addTooltip(cell, date);
    }
  }

  private calculateDaysToShow(monthIndex: number): { startDay: number; endDay: number } {
    const totalDays = this.getDaysInMonth(this.year, monthIndex);

    if (this.currentView === 'week') {
      const todayDayOfWeek = this.today.getDay();
      const mondayOffset = todayDayOfWeek === 0 ? -6 : 1 - todayDayOfWeek;
      const startDay = Math.max(1, this.today.getDate() + mondayOffset);
      const endDay = Math.min(totalDays, startDay + 6);
      return { startDay, endDay };
    }

    return { startDay: 1, endDay: totalDays };
  }

  private showContextMenu(event: MouseEvent, date: string): void {
    // Remove existing context menu
    const existing = document.querySelector('.cal-context-menu');
    if (existing) existing.remove();

    const menu = document.body.createDiv({ cls: 'cal-context-menu' });
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';

    const addEvent = menu.createDiv({ cls: 'cal-context-item', text: 'Add Event' });
    addEvent.addEventListener('click', () => {
      this.openEventModalCallback(date, null);
      menu.remove();
    });

    const listEvents = menu.createDiv({ cls: 'cal-context-item', text: 'List Scheduled Events' });
    listEvents.addEventListener('click', () => {
      this.openEventListModalCallback(date);
      menu.remove();
    });

    // Close on outside click
    const closeMenu = () => {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
  }

  private addTooltip(cell: HTMLElement, date: string): void {
    const tooltip = document.body.createDiv({ cls: 'cal-tooltip' });
    tooltip.style.display = 'none';

    cell.addEventListener('mouseenter', (e) => {
      const events = this.eventManager.getEventsForDate(date);
      if (events.length === 0) return;

      tooltip.empty();
      tooltip.createDiv({ cls: 'cal-tooltip-date', text: date });

      events.forEach(evt => {
        const eventDiv = tooltip.createDiv({ cls: 'cal-tooltip-event' });
        eventDiv.style.borderLeftColor = evt.color;

        if (evt.time) {
          eventDiv.createDiv({ cls: 'cal-tooltip-time', text: evt.time });
        }
        eventDiv.createDiv({ cls: 'cal-tooltip-title', text: evt.title || 'Untitled Event' });
        if (evt.desc) {
          eventDiv.createDiv({ cls: 'cal-tooltip-desc', text: evt.desc });
        }
      });

      tooltip.createDiv({ 
        cls: 'cal-tooltip-count', 
        text: `${events.length} event${events.length === 1 ? '' : 's'}` 
      });

      tooltip.style.display = 'block';
      tooltip.style.left = (e.pageX + 10) + 'px';
      tooltip.style.top = (e.pageY + 10) + 'px';
    });

    cell.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    cell.addEventListener('mousemove', (e) => {
      if (tooltip.style.display === 'block') {
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY + 10) + 'px';
      }
    });
  }

  private applyEventBorders(): void {
    const events = this.eventManager.getEvents();

    Object.entries(events).forEach(([date, eventData]) => {
      const cell = this.container.querySelector(`[data-date="${date}"]`) as HTMLElement;
      if (!cell) return;

      // Reset styles
      cell.style.boxShadow = '';

      const eventArray = Array.isArray(eventData) ? eventData : [eventData];
      const colors = eventArray.map(evt => evt?.color).filter(Boolean);

      if (colors.length === 0) return;

      // Create stacked borders from outside to inside
      const shadows = colors.reverse().map((color, i) => {
        const width = 2 + (i * 2);
        return `inset 0 0 0 ${width}px ${color}`;
      }).join(', ');

      cell.style.boxShadow = shadows;
    });
  }

  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private getFirstDay(year: number, month: number): number {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }

  private formatDate(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
}