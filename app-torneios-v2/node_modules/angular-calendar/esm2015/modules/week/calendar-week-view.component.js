import { __rest } from "tslib";
import { Component, Input, Output, EventEmitter, LOCALE_ID, Inject, } from '@angular/core';
import { CalendarDragHelper } from '../common/calendar-drag-helper.provider';
import { CalendarResizeHelper } from '../common/calendar-resize-helper.provider';
import { CalendarEventTimesChangedEventType, } from '../common/calendar-event-times-changed-event.interface';
import { validateEvents, roundToNearest, trackByWeekDayHeaderDate, trackByHourSegment, trackByHour, getMinutesMoved, getDefaultEventEnd, addDaysWithExclusions, isDraggedWithinPeriod, shouldFireDroppedEvent, getWeekViewPeriod, trackByWeekAllDayEvent, trackByWeekTimeEvent, } from '../common/util';
import * as i0 from "@angular/core";
import * as i1 from "../common/calendar-utils.provider";
import * as i2 from "../../date-adapters/date-adapter";
import * as i3 from "./calendar-week-view-header.component";
import * as i4 from "./calendar-week-view-event.component";
import * as i5 from "./calendar-week-view-hour-segment.component";
import * as i6 from "./calendar-week-view-current-time-marker.component";
import * as i7 from "@angular/common";
import * as i8 from "angular-draggable-droppable";
import * as i9 from "angular-resizable-element";
import * as i10 from "../common/click.directive";
/**
 * Shows all events on a given week. Example usage:
 *
 * ```typescript
 * <mwl-calendar-week-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-week-view>
 * ```
 */
export class CalendarWeekViewComponent {
    /**
     * @hidden
     */
    constructor(cdr, utils, locale, dateAdapter, element) {
        this.cdr = cdr;
        this.utils = utils;
        this.dateAdapter = dateAdapter;
        this.element = element;
        /**
         * An array of events to display on view
         * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
         */
        this.events = [];
        /**
         * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
         */
        this.excludeDays = [];
        /**
         * The placement of the event tooltip
         */
        this.tooltipPlacement = 'auto';
        /**
         * Whether to append tooltips to the body or next to the trigger element
         */
        this.tooltipAppendToBody = true;
        /**
         * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
         * will be displayed immediately.
         */
        this.tooltipDelay = null;
        /**
         * The precision to display events.
         * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
         */
        this.precision = 'days';
        /**
         * Whether to snap events to a grid when dragging
         */
        this.snapDraggedEvents = true;
        /**
         * The number of segments in an hour. Must divide equally into 60.
         */
        this.hourSegments = 2;
        /**
         * The height in pixels of each hour segment
         */
        this.hourSegmentHeight = 30;
        /**
         * The minimum height in pixels of each event
         */
        this.minimumEventHeight = 30;
        /**
         * The day start hours in 24 hour time. Must be 0-23
         */
        this.dayStartHour = 0;
        /**
         * The day start minutes. Must be 0-59
         */
        this.dayStartMinute = 0;
        /**
         * The day end hours in 24 hour time. Must be 0-23
         */
        this.dayEndHour = 23;
        /**
         * The day end minutes. Must be 0-59
         */
        this.dayEndMinute = 59;
        /**
         * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
         */
        this.dayHeaderClicked = new EventEmitter();
        /**
         * Called when an event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when an event is resized or dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        /**
         * An output that will be called before the view is rendered for the current week.
         * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
         */
        this.beforeViewRender = new EventEmitter();
        /**
         * Called when an hour segment is clicked
         */
        this.hourSegmentClicked = new EventEmitter();
        /**
         * @hidden
         */
        this.allDayEventResizes = new Map();
        /**
         * @hidden
         */
        this.timeEventResizes = new Map();
        /**
         * @hidden
         */
        this.eventDragEnterByType = {
            allDay: 0,
            time: 0,
        };
        /**
         * @hidden
         */
        this.dragActive = false;
        /**
         * @hidden
         */
        this.dragAlreadyMoved = false;
        /**
         * @hidden
         */
        this.calendarId = Symbol('angular calendar week view id');
        /**
         * @hidden
         */
        this.rtl = false;
        /**
         * @hidden
         */
        this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
        /**
         * @hidden
         */
        this.trackByHourSegment = trackByHourSegment;
        /**
         * @hidden
         */
        this.trackByHour = trackByHour;
        /**
         * @hidden
         */
        this.trackByWeekAllDayEvent = trackByWeekAllDayEvent;
        /**
         * @hidden
         */
        this.trackByWeekTimeEvent = trackByWeekTimeEvent;
        /**
         * @hidden
         */
        this.trackByHourColumn = (index, column) => column.hours[0] ? column.hours[0].segments[0].date.toISOString() : column;
        /**
         * @hidden
         */
        this.trackById = (index, row) => row.id;
        this.locale = locale;
    }
    /**
     * @hidden
     */
    ngOnInit() {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }
    /**
     * @hidden
     */
    ngOnChanges(changes) {
        const refreshHeader = changes.viewDate ||
            changes.excludeDays ||
            changes.weekendDays ||
            changes.daysInWeek ||
            changes.weekStartsOn;
        const refreshBody = changes.viewDate ||
            changes.dayStartHour ||
            changes.dayStartMinute ||
            changes.dayEndHour ||
            changes.dayEndMinute ||
            changes.hourSegments ||
            changes.hourDuration ||
            changes.weekStartsOn ||
            changes.weekendDays ||
            changes.excludeDays ||
            changes.hourSegmentHeight ||
            changes.events ||
            changes.daysInWeek ||
            changes.minimumEventHeight;
        if (refreshHeader) {
            this.refreshHeader();
        }
        if (changes.events) {
            validateEvents(this.events);
        }
        if (refreshBody) {
            this.refreshBody();
        }
        if (refreshHeader || refreshBody) {
            this.emitBeforeViewRender();
        }
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
    /**
     * @hidden
     */
    ngAfterViewInit() {
        this.rtl =
            typeof window !== 'undefined' &&
                getComputedStyle(this.element.nativeElement).direction === 'rtl';
        this.cdr.detectChanges();
    }
    /**
     * @hidden
     */
    timeEventResizeStarted(eventsContainer, timeEvent, resizeEvent) {
        this.timeEventResizes.set(timeEvent.event, resizeEvent);
        this.resizeStarted(eventsContainer, timeEvent);
    }
    /**
     * @hidden
     */
    timeEventResizing(timeEvent, resizeEvent) {
        this.timeEventResizes.set(timeEvent.event, resizeEvent);
        const adjustedEvents = new Map();
        const tempEvents = [...this.events];
        this.timeEventResizes.forEach((lastResizeEvent, event) => {
            const newEventDates = this.getTimeEventResizedDates(event, lastResizeEvent);
            const adjustedEvent = Object.assign(Object.assign({}, event), newEventDates);
            adjustedEvents.set(adjustedEvent, event);
            const eventIndex = tempEvents.indexOf(event);
            tempEvents[eventIndex] = adjustedEvent;
        });
        this.restoreOriginalEvents(tempEvents, adjustedEvents, true);
    }
    /**
     * @hidden
     */
    timeEventResizeEnded(timeEvent) {
        this.view = this.getWeekView(this.events);
        const lastResizeEvent = this.timeEventResizes.get(timeEvent.event);
        if (lastResizeEvent) {
            this.timeEventResizes.delete(timeEvent.event);
            const newEventDates = this.getTimeEventResizedDates(timeEvent.event, lastResizeEvent);
            this.eventTimesChanged.emit({
                newStart: newEventDates.start,
                newEnd: newEventDates.end,
                event: timeEvent.event,
                type: CalendarEventTimesChangedEventType.Resize,
            });
        }
    }
    /**
     * @hidden
     */
    allDayEventResizeStarted(allDayEventsContainer, allDayEvent, resizeEvent) {
        this.allDayEventResizes.set(allDayEvent, {
            originalOffset: allDayEvent.offset,
            originalSpan: allDayEvent.span,
            edge: typeof resizeEvent.edges.left !== 'undefined' ? 'left' : 'right',
        });
        this.resizeStarted(allDayEventsContainer, allDayEvent, this.getDayColumnWidth(allDayEventsContainer));
    }
    /**
     * @hidden
     */
    allDayEventResizing(allDayEvent, resizeEvent, dayWidth) {
        const currentResize = this.allDayEventResizes.get(allDayEvent);
        const modifier = this.rtl ? -1 : 1;
        if (typeof resizeEvent.edges.left !== 'undefined') {
            const diff = Math.round(+resizeEvent.edges.left / dayWidth) * modifier;
            allDayEvent.offset = currentResize.originalOffset + diff;
            allDayEvent.span = currentResize.originalSpan - diff;
        }
        else if (typeof resizeEvent.edges.right !== 'undefined') {
            const diff = Math.round(+resizeEvent.edges.right / dayWidth) * modifier;
            allDayEvent.span = currentResize.originalSpan + diff;
        }
    }
    /**
     * @hidden
     */
    allDayEventResizeEnded(allDayEvent) {
        const currentResize = this.allDayEventResizes.get(allDayEvent);
        if (currentResize) {
            const allDayEventResizingBeforeStart = currentResize.edge === 'left';
            let daysDiff;
            if (allDayEventResizingBeforeStart) {
                daysDiff = allDayEvent.offset - currentResize.originalOffset;
            }
            else {
                daysDiff = allDayEvent.span - currentResize.originalSpan;
            }
            allDayEvent.offset = currentResize.originalOffset;
            allDayEvent.span = currentResize.originalSpan;
            const newDates = this.getAllDayEventResizedDates(allDayEvent.event, daysDiff, allDayEventResizingBeforeStart);
            this.eventTimesChanged.emit({
                newStart: newDates.start,
                newEnd: newDates.end,
                event: allDayEvent.event,
                type: CalendarEventTimesChangedEventType.Resize,
            });
            this.allDayEventResizes.delete(allDayEvent);
        }
    }
    /**
     * @hidden
     */
    getDayColumnWidth(eventRowContainer) {
        return Math.floor(eventRowContainer.offsetWidth / this.days.length);
    }
    /**
     * @hidden
     */
    dateDragEnter(date) {
        this.lastDragEnterDate = date;
    }
    /**
     * @hidden
     */
    eventDropped(dropEvent, date, allDay) {
        if (shouldFireDroppedEvent(dropEvent, date, allDay, this.calendarId) &&
            this.lastDragEnterDate.getTime() === date.getTime() &&
            (!this.snapDraggedEvents ||
                dropEvent.dropData.event !== this.lastDraggedEvent)) {
            this.eventTimesChanged.emit({
                type: CalendarEventTimesChangedEventType.Drop,
                event: dropEvent.dropData.event,
                newStart: date,
                allDay,
            });
        }
        this.lastDraggedEvent = null;
    }
    /**
     * @hidden
     */
    dragEnter(type) {
        this.eventDragEnterByType[type]++;
    }
    /**
     * @hidden
     */
    dragLeave(type) {
        this.eventDragEnterByType[type]--;
    }
    /**
     * @hidden
     */
    dragStarted(eventsContainerElement, eventElement, event, useY) {
        this.dayColumnWidth = this.getDayColumnWidth(eventsContainerElement);
        const dragHelper = new CalendarDragHelper(eventsContainerElement, eventElement);
        this.validateDrag = ({ x, y, transform }) => {
            const isAllowed = this.allDayEventResizes.size === 0 &&
                this.timeEventResizes.size === 0 &&
                dragHelper.validateDrag({
                    x,
                    y,
                    snapDraggedEvents: this.snapDraggedEvents,
                    dragAlreadyMoved: this.dragAlreadyMoved,
                    transform,
                });
            if (isAllowed && this.validateEventTimesChanged) {
                const newEventTimes = this.getDragMovedEventTimes(event, { x, y }, this.dayColumnWidth, useY);
                return this.validateEventTimesChanged({
                    type: CalendarEventTimesChangedEventType.Drag,
                    event: event.event,
                    newStart: newEventTimes.start,
                    newEnd: newEventTimes.end,
                });
            }
            return isAllowed;
        };
        this.dragActive = true;
        this.dragAlreadyMoved = false;
        this.lastDraggedEvent = null;
        this.eventDragEnterByType = {
            allDay: 0,
            time: 0,
        };
        if (!this.snapDraggedEvents && useY) {
            this.view.hourColumns.forEach((column) => {
                const linkedEvent = column.events.find((columnEvent) => columnEvent.event === event.event && columnEvent !== event);
                // hide any linked events while dragging
                if (linkedEvent) {
                    linkedEvent.width = 0;
                    linkedEvent.height = 0;
                }
            });
        }
        this.cdr.markForCheck();
    }
    /**
     * @hidden
     */
    dragMove(dayEvent, dragEvent) {
        const newEventTimes = this.getDragMovedEventTimes(dayEvent, dragEvent, this.dayColumnWidth, true);
        const originalEvent = dayEvent.event;
        const adjustedEvent = Object.assign(Object.assign({}, originalEvent), newEventTimes);
        const tempEvents = this.events.map((event) => {
            if (event === originalEvent) {
                return adjustedEvent;
            }
            return event;
        });
        this.restoreOriginalEvents(tempEvents, new Map([[adjustedEvent, originalEvent]]), this.snapDraggedEvents);
        this.dragAlreadyMoved = true;
    }
    /**
     * @hidden
     */
    allDayEventDragMove() {
        this.dragAlreadyMoved = true;
    }
    /**
     * @hidden
     */
    dragEnded(weekEvent, dragEndEvent, dayWidth, useY = false) {
        this.view = this.getWeekView(this.events);
        this.dragActive = false;
        this.validateDrag = null;
        const { start, end } = this.getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY);
        if ((this.snapDraggedEvents ||
            this.eventDragEnterByType[useY ? 'time' : 'allDay'] > 0) &&
            isDraggedWithinPeriod(start, end, this.view.period)) {
            this.lastDraggedEvent = weekEvent.event;
            this.eventTimesChanged.emit({
                newStart: start,
                newEnd: end,
                event: weekEvent.event,
                type: CalendarEventTimesChangedEventType.Drag,
                allDay: !useY,
            });
        }
    }
    refreshHeader() {
        this.days = this.utils.getWeekViewHeader(Object.assign({ viewDate: this.viewDate, weekStartsOn: this.weekStartsOn, excluded: this.excludeDays, weekendDays: this.weekendDays }, getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)));
    }
    refreshBody() {
        this.view = this.getWeekView(this.events);
    }
    refreshAll() {
        this.refreshHeader();
        this.refreshBody();
        this.emitBeforeViewRender();
    }
    emitBeforeViewRender() {
        if (this.days && this.view) {
            this.beforeViewRender.emit(Object.assign({ header: this.days }, this.view));
        }
    }
    getWeekView(events) {
        return this.utils.getWeekView(Object.assign({ events, viewDate: this.viewDate, weekStartsOn: this.weekStartsOn, excluded: this.excludeDays, precision: this.precision, absolutePositionedEvents: true, hourSegments: this.hourSegments, hourDuration: this.hourDuration, dayStart: {
                hour: this.dayStartHour,
                minute: this.dayStartMinute,
            }, dayEnd: {
                hour: this.dayEndHour,
                minute: this.dayEndMinute,
            }, segmentHeight: this.hourSegmentHeight, weekendDays: this.weekendDays, minimumEventHeight: this.minimumEventHeight }, getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)));
    }
    getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY) {
        const daysDragged = (roundToNearest(dragEndEvent.x, dayWidth) / dayWidth) *
            (this.rtl ? -1 : 1);
        const minutesMoved = useY
            ? getMinutesMoved(dragEndEvent.y, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration)
            : 0;
        const start = this.dateAdapter.addMinutes(addDaysWithExclusions(this.dateAdapter, weekEvent.event.start, daysDragged, this.excludeDays), minutesMoved);
        let end;
        if (weekEvent.event.end) {
            end = this.dateAdapter.addMinutes(addDaysWithExclusions(this.dateAdapter, weekEvent.event.end, daysDragged, this.excludeDays), minutesMoved);
        }
        return { start, end };
    }
    restoreOriginalEvents(tempEvents, adjustedEvents, snapDraggedEvents = true) {
        const previousView = this.view;
        if (snapDraggedEvents) {
            this.view = this.getWeekView(tempEvents);
        }
        const adjustedEventsArray = tempEvents.filter((event) => adjustedEvents.has(event));
        this.view.hourColumns.forEach((column, columnIndex) => {
            previousView.hourColumns[columnIndex].hours.forEach((hour, hourIndex) => {
                hour.segments.forEach((segment, segmentIndex) => {
                    column.hours[hourIndex].segments[segmentIndex].cssClass =
                        segment.cssClass;
                });
            });
            adjustedEventsArray.forEach((adjustedEvent) => {
                const originalEvent = adjustedEvents.get(adjustedEvent);
                const existingColumnEvent = column.events.find((columnEvent) => columnEvent.event ===
                    (snapDraggedEvents ? adjustedEvent : originalEvent));
                if (existingColumnEvent) {
                    // restore the original event so trackBy kicks in and the dom isn't changed
                    existingColumnEvent.event = originalEvent;
                    existingColumnEvent['tempEvent'] = adjustedEvent;
                    if (!snapDraggedEvents) {
                        existingColumnEvent.height = 0;
                        existingColumnEvent.width = 0;
                    }
                }
                else {
                    // add a dummy event to the drop so if the event was removed from the original column the drag doesn't end early
                    const event = {
                        event: originalEvent,
                        left: 0,
                        top: 0,
                        height: 0,
                        width: 0,
                        startsBeforeDay: false,
                        endsAfterDay: false,
                        tempEvent: adjustedEvent,
                    };
                    column.events.push(event);
                }
            });
        });
        adjustedEvents.clear();
    }
    getTimeEventResizedDates(calendarEvent, resizeEvent) {
        const newEventDates = {
            start: calendarEvent.start,
            end: getDefaultEventEnd(this.dateAdapter, calendarEvent, this.minimumEventHeight),
        };
        const { end } = calendarEvent, eventWithoutEnd = __rest(calendarEvent, ["end"]);
        const smallestResizes = {
            start: this.dateAdapter.addMinutes(newEventDates.end, this.minimumEventHeight * -1),
            end: getDefaultEventEnd(this.dateAdapter, eventWithoutEnd, this.minimumEventHeight),
        };
        const modifier = this.rtl ? -1 : 1;
        if (typeof resizeEvent.edges.left !== 'undefined') {
            const daysDiff = Math.round(+resizeEvent.edges.left / this.dayColumnWidth) * modifier;
            const newStart = addDaysWithExclusions(this.dateAdapter, newEventDates.start, daysDiff, this.excludeDays);
            if (newStart < smallestResizes.start) {
                newEventDates.start = newStart;
            }
            else {
                newEventDates.start = smallestResizes.start;
            }
        }
        else if (typeof resizeEvent.edges.right !== 'undefined') {
            const daysDiff = Math.round(+resizeEvent.edges.right / this.dayColumnWidth) * modifier;
            const newEnd = addDaysWithExclusions(this.dateAdapter, newEventDates.end, daysDiff, this.excludeDays);
            if (newEnd > smallestResizes.end) {
                newEventDates.end = newEnd;
            }
            else {
                newEventDates.end = smallestResizes.end;
            }
        }
        if (typeof resizeEvent.edges.top !== 'undefined') {
            const minutesMoved = getMinutesMoved(resizeEvent.edges.top, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration);
            const newStart = this.dateAdapter.addMinutes(newEventDates.start, minutesMoved);
            if (newStart < smallestResizes.start) {
                newEventDates.start = newStart;
            }
            else {
                newEventDates.start = smallestResizes.start;
            }
        }
        else if (typeof resizeEvent.edges.bottom !== 'undefined') {
            const minutesMoved = getMinutesMoved(resizeEvent.edges.bottom, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration);
            const newEnd = this.dateAdapter.addMinutes(newEventDates.end, minutesMoved);
            if (newEnd > smallestResizes.end) {
                newEventDates.end = newEnd;
            }
            else {
                newEventDates.end = smallestResizes.end;
            }
        }
        return newEventDates;
    }
    resizeStarted(eventsContainer, event, dayWidth) {
        this.dayColumnWidth = this.getDayColumnWidth(eventsContainer);
        const resizeHelper = new CalendarResizeHelper(eventsContainer, dayWidth, this.rtl);
        this.validateResize = ({ rectangle, edges }) => {
            const isWithinBoundary = resizeHelper.validateResize({
                rectangle: Object.assign({}, rectangle),
                edges,
            });
            if (isWithinBoundary && this.validateEventTimesChanged) {
                let newEventDates;
                if (!dayWidth) {
                    newEventDates = this.getTimeEventResizedDates(event.event, {
                        rectangle,
                        edges,
                    });
                }
                else {
                    const modifier = this.rtl ? -1 : 1;
                    if (typeof edges.left !== 'undefined') {
                        const diff = Math.round(+edges.left / dayWidth) * modifier;
                        newEventDates = this.getAllDayEventResizedDates(event.event, diff, !this.rtl);
                    }
                    else {
                        const diff = Math.round(+edges.right / dayWidth) * modifier;
                        newEventDates = this.getAllDayEventResizedDates(event.event, diff, this.rtl);
                    }
                }
                return this.validateEventTimesChanged({
                    type: CalendarEventTimesChangedEventType.Resize,
                    event: event.event,
                    newStart: newEventDates.start,
                    newEnd: newEventDates.end,
                });
            }
            return isWithinBoundary;
        };
        this.cdr.markForCheck();
    }
    /**
     * @hidden
     */
    getAllDayEventResizedDates(event, daysDiff, beforeStart) {
        let start = event.start;
        let end = event.end || event.start;
        if (beforeStart) {
            start = addDaysWithExclusions(this.dateAdapter, start, daysDiff, this.excludeDays);
        }
        else {
            end = addDaysWithExclusions(this.dateAdapter, end, daysDiff, this.excludeDays);
        }
        return { start, end };
    }
}
CalendarWeekViewComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.3", ngImport: i0, type: CalendarWeekViewComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.CalendarUtils }, { token: LOCALE_ID }, { token: i2.DateAdapter }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
CalendarWeekViewComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.3", type: CalendarWeekViewComponent, selector: "mwl-calendar-week-view", inputs: { viewDate: "viewDate", events: "events", excludeDays: "excludeDays", refresh: "refresh", locale: "locale", tooltipPlacement: "tooltipPlacement", tooltipTemplate: "tooltipTemplate", tooltipAppendToBody: "tooltipAppendToBody", tooltipDelay: "tooltipDelay", weekStartsOn: "weekStartsOn", headerTemplate: "headerTemplate", eventTemplate: "eventTemplate", eventTitleTemplate: "eventTitleTemplate", eventActionsTemplate: "eventActionsTemplate", precision: "precision", weekendDays: "weekendDays", snapDraggedEvents: "snapDraggedEvents", hourSegments: "hourSegments", hourDuration: "hourDuration", hourSegmentHeight: "hourSegmentHeight", minimumEventHeight: "minimumEventHeight", dayStartHour: "dayStartHour", dayStartMinute: "dayStartMinute", dayEndHour: "dayEndHour", dayEndMinute: "dayEndMinute", hourSegmentTemplate: "hourSegmentTemplate", eventSnapSize: "eventSnapSize", allDayEventsLabelTemplate: "allDayEventsLabelTemplate", daysInWeek: "daysInWeek", currentTimeMarkerTemplate: "currentTimeMarkerTemplate", validateEventTimesChanged: "validateEventTimesChanged" }, outputs: { dayHeaderClicked: "dayHeaderClicked", eventClicked: "eventClicked", eventTimesChanged: "eventTimesChanged", beforeViewRender: "beforeViewRender", hourSegmentClicked: "hourSegmentClicked" }, usesOnChanges: true, ngImport: i0, template: `
    <div class="cal-week-view" role="grid">
      <mwl-calendar-week-view-header
        [days]="days"
        [locale]="locale"
        [customTemplate]="headerTemplate"
        (dayHeaderClicked)="dayHeaderClicked.emit($event)"
        (eventDropped)="
          eventDropped({ dropData: $event }, $event.newStart, true)
        "
        (dragEnter)="dateDragEnter($event.date)"
      >
      </mwl-calendar-week-view-header>
      <div
        class="cal-all-day-events"
        #allDayEventsContainer
        *ngIf="view.allDayEventRows.length > 0"
        mwlDroppable
        (dragEnter)="dragEnter('allDay')"
        (dragLeave)="dragLeave('allDay')"
      >
        <div class="cal-day-columns">
          <div
            class="cal-time-label-column"
            [ngTemplateOutlet]="allDayEventsLabelTemplate"
          ></div>
          <div
            class="cal-day-column"
            *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
            mwlDroppable
            dragOverClass="cal-drag-over"
            (drop)="eventDropped($event, day.date, true)"
            (dragEnter)="dateDragEnter(day.date)"
          ></div>
        </div>
        <div
          *ngFor="let eventRow of view.allDayEventRows; trackBy: trackById"
          #eventRowContainer
          class="cal-events-row"
        >
          <div
            *ngFor="
              let allDayEvent of eventRow.row;
              trackBy: trackByWeekAllDayEvent
            "
            #event
            class="cal-event-container"
            [class.cal-draggable]="
              allDayEvent.event.draggable && allDayEventResizes.size === 0
            "
            [class.cal-starts-within-week]="!allDayEvent.startsBeforeWeek"
            [class.cal-ends-within-week]="!allDayEvent.endsAfterWeek"
            [ngClass]="allDayEvent.event?.cssClass"
            [style.width.%]="(100 / days.length) * allDayEvent.span"
            [style.marginLeft.%]="
              rtl ? null : (100 / days.length) * allDayEvent.offset
            "
            [style.marginRight.%]="
              rtl
                ? (100 / days.length) * (days.length - allDayEvent.offset) * -1
                : null
            "
            mwlResizable
            [resizeSnapGrid]="{ left: dayColumnWidth, right: dayColumnWidth }"
            [validateResize]="validateResize"
            (resizeStart)="
              allDayEventResizeStarted(eventRowContainer, allDayEvent, $event)
            "
            (resizing)="
              allDayEventResizing(allDayEvent, $event, dayColumnWidth)
            "
            (resizeEnd)="allDayEventResizeEnded(allDayEvent)"
            mwlDraggable
            dragActiveClass="cal-drag-active"
            [dropData]="{ event: allDayEvent.event, calendarId: calendarId }"
            [dragAxis]="{
              x: allDayEvent.event.draggable && allDayEventResizes.size === 0,
              y:
                !snapDraggedEvents &&
                allDayEvent.event.draggable &&
                allDayEventResizes.size === 0
            }"
            [dragSnapGrid]="snapDraggedEvents ? { x: dayColumnWidth } : {}"
            [validateDrag]="validateDrag"
            [touchStartLongPress]="{ delay: 300, delta: 30 }"
            (dragStart)="
              dragStarted(eventRowContainer, event, allDayEvent, false)
            "
            (dragging)="allDayEventDragMove()"
            (dragEnd)="dragEnded(allDayEvent, $event, dayColumnWidth)"
          >
            <div
              class="cal-resize-handle cal-resize-handle-before-start"
              *ngIf="
                allDayEvent.event?.resizable?.beforeStart &&
                !allDayEvent.startsBeforeWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ left: true }"
            ></div>
            <mwl-calendar-week-view-event
              [locale]="locale"
              [weekEvent]="allDayEvent"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipDelay]="tooltipDelay"
              [customTemplate]="eventTemplate"
              [eventTitleTemplate]="eventTitleTemplate"
              [eventActionsTemplate]="eventActionsTemplate"
              [daysInWeek]="daysInWeek"
              (eventClicked)="
                eventClicked.emit({
                  event: allDayEvent.event,
                  sourceEvent: $event.sourceEvent
                })
              "
            >
            </mwl-calendar-week-view-event>
            <div
              class="cal-resize-handle cal-resize-handle-after-end"
              *ngIf="
                allDayEvent.event?.resizable?.afterEnd &&
                !allDayEvent.endsAfterWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ right: true }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="cal-time-events"
        mwlDroppable
        (dragEnter)="dragEnter('time')"
        (dragLeave)="dragLeave('time')"
      >
        <div
          class="cal-time-label-column"
          *ngIf="view.hourColumns.length > 0 && daysInWeek !== 1"
        >
          <div
            *ngFor="
              let hour of view.hourColumns[0].hours;
              trackBy: trackByHour;
              let odd = odd
            "
            class="cal-hour"
            [class.cal-hour-odd]="odd"
          >
            <mwl-calendar-week-view-hour-segment
              *ngFor="let segment of hour.segments; trackBy: trackByHourSegment"
              [style.height.px]="hourSegmentHeight"
              [segment]="segment"
              [segmentHeight]="hourSegmentHeight"
              [locale]="locale"
              [customTemplate]="hourSegmentTemplate"
              [isTimeLabel]="true"
              [daysInWeek]="daysInWeek"
            >
            </mwl-calendar-week-view-hour-segment>
          </div>
        </div>
        <div
          class="cal-day-columns"
          [class.cal-resize-active]="timeEventResizes.size > 0"
          #dayColumns
        >
          <div
            class="cal-day-column"
            *ngFor="let column of view.hourColumns; trackBy: trackByHourColumn"
          >
            <mwl-calendar-week-view-current-time-marker
              [columnDate]="column.date"
              [dayStartHour]="dayStartHour"
              [dayStartMinute]="dayStartMinute"
              [dayEndHour]="dayEndHour"
              [dayEndMinute]="dayEndMinute"
              [hourSegments]="hourSegments"
              [hourDuration]="hourDuration"
              [hourSegmentHeight]="hourSegmentHeight"
              [customTemplate]="currentTimeMarkerTemplate"
            ></mwl-calendar-week-view-current-time-marker>
            <div class="cal-events-container">
              <div
                *ngFor="
                  let timeEvent of column.events;
                  trackBy: trackByWeekTimeEvent
                "
                #event
                class="cal-event-container"
                [class.cal-draggable]="
                  timeEvent.event.draggable && timeEventResizes.size === 0
                "
                [class.cal-starts-within-day]="!timeEvent.startsBeforeDay"
                [class.cal-ends-within-day]="!timeEvent.endsAfterDay"
                [ngClass]="timeEvent.event.cssClass"
                [hidden]="timeEvent.height === 0 && timeEvent.width === 0"
                [style.top.px]="timeEvent.top"
                [style.height.px]="timeEvent.height"
                [style.left.%]="timeEvent.left"
                [style.width.%]="timeEvent.width"
                mwlResizable
                [resizeSnapGrid]="{
                  left: dayColumnWidth,
                  right: dayColumnWidth,
                  top: eventSnapSize || hourSegmentHeight,
                  bottom: eventSnapSize || hourSegmentHeight
                }"
                [validateResize]="validateResize"
                [allowNegativeResizes]="true"
                (resizeStart)="
                  timeEventResizeStarted(dayColumns, timeEvent, $event)
                "
                (resizing)="timeEventResizing(timeEvent, $event)"
                (resizeEnd)="timeEventResizeEnded(timeEvent)"
                mwlDraggable
                dragActiveClass="cal-drag-active"
                [dropData]="{ event: timeEvent.event, calendarId: calendarId }"
                [dragAxis]="{
                  x: timeEvent.event.draggable && timeEventResizes.size === 0,
                  y: timeEvent.event.draggable && timeEventResizes.size === 0
                }"
                [dragSnapGrid]="
                  snapDraggedEvents
                    ? {
                        x: dayColumnWidth,
                        y: eventSnapSize || hourSegmentHeight
                      }
                    : {}
                "
                [touchStartLongPress]="{ delay: 300, delta: 30 }"
                [ghostDragEnabled]="!snapDraggedEvents"
                [ghostElementTemplate]="weekEventTemplate"
                [validateDrag]="validateDrag"
                (dragStart)="dragStarted(dayColumns, event, timeEvent, true)"
                (dragging)="dragMove(timeEvent, $event)"
                (dragEnd)="dragEnded(timeEvent, $event, dayColumnWidth, true)"
              >
                <div
                  class="cal-resize-handle cal-resize-handle-before-start"
                  *ngIf="
                    timeEvent.event?.resizable?.beforeStart &&
                    !timeEvent.startsBeforeDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    left: true,
                    top: true
                  }"
                ></div>
                <ng-template
                  [ngTemplateOutlet]="weekEventTemplate"
                ></ng-template>
                <ng-template #weekEventTemplate>
                  <mwl-calendar-week-view-event
                    [locale]="locale"
                    [weekEvent]="timeEvent"
                    [tooltipPlacement]="tooltipPlacement"
                    [tooltipTemplate]="tooltipTemplate"
                    [tooltipAppendToBody]="tooltipAppendToBody"
                    [tooltipDisabled]="dragActive || timeEventResizes.size > 0"
                    [tooltipDelay]="tooltipDelay"
                    [customTemplate]="eventTemplate"
                    [eventTitleTemplate]="eventTitleTemplate"
                    [eventActionsTemplate]="eventActionsTemplate"
                    [column]="column"
                    [daysInWeek]="daysInWeek"
                    (eventClicked)="
                      eventClicked.emit({
                        event: timeEvent.event,
                        sourceEvent: $event.sourceEvent
                      })
                    "
                  >
                  </mwl-calendar-week-view-event>
                </ng-template>
                <div
                  class="cal-resize-handle cal-resize-handle-after-end"
                  *ngIf="
                    timeEvent.event?.resizable?.afterEnd &&
                    !timeEvent.endsAfterDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    right: true,
                    bottom: true
                  }"
                ></div>
              </div>
            </div>

            <div
              *ngFor="
                let hour of column.hours;
                trackBy: trackByHour;
                let odd = odd
              "
              class="cal-hour"
              [class.cal-hour-odd]="odd"
            >
              <mwl-calendar-week-view-hour-segment
                *ngFor="
                  let segment of hour.segments;
                  trackBy: trackByHourSegment
                "
                [style.height.px]="hourSegmentHeight"
                [segment]="segment"
                [segmentHeight]="hourSegmentHeight"
                [locale]="locale"
                [customTemplate]="hourSegmentTemplate"
                [daysInWeek]="daysInWeek"
                (mwlClick)="
                  hourSegmentClicked.emit({
                    date: segment.date,
                    sourceEvent: $event
                  })
                "
                [clickListenerDisabled]="
                  hourSegmentClicked.observers.length === 0
                "
                mwlDroppable
                [dragOverClass]="
                  !dragActive || !snapDraggedEvents ? 'cal-drag-over' : null
                "
                dragActiveClass="cal-drag-active"
                (drop)="eventDropped($event, segment.date, false)"
                (dragEnter)="dateDragEnter(segment.date)"
                [isTimeLabel]="daysInWeek === 1"
              >
              </mwl-calendar-week-view-hour-segment>
            </div>
          </div>
        </div>
      </div>
    </div>
  `, isInline: true, components: [{ type: i3.CalendarWeekViewHeaderComponent, selector: "mwl-calendar-week-view-header", inputs: ["days", "locale", "customTemplate"], outputs: ["dayHeaderClicked", "eventDropped", "dragEnter"] }, { type: i4.CalendarWeekViewEventComponent, selector: "mwl-calendar-week-view-event", inputs: ["locale", "weekEvent", "tooltipPlacement", "tooltipAppendToBody", "tooltipDisabled", "tooltipDelay", "customTemplate", "eventTitleTemplate", "eventActionsTemplate", "tooltipTemplate", "column", "daysInWeek"], outputs: ["eventClicked"] }, { type: i5.CalendarWeekViewHourSegmentComponent, selector: "mwl-calendar-week-view-hour-segment", inputs: ["segment", "segmentHeight", "locale", "isTimeLabel", "daysInWeek", "customTemplate"] }, { type: i6.CalendarWeekViewCurrentTimeMarkerComponent, selector: "mwl-calendar-week-view-current-time-marker", inputs: ["columnDate", "dayStartHour", "dayStartMinute", "dayEndHour", "dayEndMinute", "hourSegments", "hourDuration", "hourSegmentHeight", "customTemplate"] }], directives: [{ type: i7.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i8.DroppableDirective, selector: "[mwlDroppable]", inputs: ["dragOverClass", "dragActiveClass", "validateDrop"], outputs: ["dragEnter", "dragLeave", "dragOver", "drop"] }, { type: i7.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i7.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i9.ResizableDirective, selector: "[mwlResizable]", inputs: ["validateResize", "enableGhostResize", "resizeSnapGrid", "resizeCursors", "ghostElementPositioning", "allowNegativeResizes", "mouseMoveThrottleMS"], outputs: ["resizeStart", "resizing", "resizeEnd"], exportAs: ["mwlResizable"] }, { type: i8.DraggableDirective, selector: "[mwlDraggable]", inputs: ["dropData", "dragAxis", "dragSnapGrid", "ghostDragEnabled", "showOriginalElementWhileDragging", "validateDrag", "dragCursor", "dragActiveClass", "ghostElementAppendTo", "ghostElementTemplate", "touchStartLongPress", "autoScroll"], outputs: ["dragPointerDown", "dragStart", "ghostElementCreated", "dragging", "dragEnd"] }, { type: i7.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i9.ResizeHandleDirective, selector: "[mwlResizeHandle]", inputs: ["resizeEdges", "resizableContainer"] }, { type: i10.ClickDirective, selector: "[mwlClick]", inputs: ["clickListenerDisabled"], outputs: ["mwlClick"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.3", ngImport: i0, type: CalendarWeekViewComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mwl-calendar-week-view',
                    template: `
    <div class="cal-week-view" role="grid">
      <mwl-calendar-week-view-header
        [days]="days"
        [locale]="locale"
        [customTemplate]="headerTemplate"
        (dayHeaderClicked)="dayHeaderClicked.emit($event)"
        (eventDropped)="
          eventDropped({ dropData: $event }, $event.newStart, true)
        "
        (dragEnter)="dateDragEnter($event.date)"
      >
      </mwl-calendar-week-view-header>
      <div
        class="cal-all-day-events"
        #allDayEventsContainer
        *ngIf="view.allDayEventRows.length > 0"
        mwlDroppable
        (dragEnter)="dragEnter('allDay')"
        (dragLeave)="dragLeave('allDay')"
      >
        <div class="cal-day-columns">
          <div
            class="cal-time-label-column"
            [ngTemplateOutlet]="allDayEventsLabelTemplate"
          ></div>
          <div
            class="cal-day-column"
            *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
            mwlDroppable
            dragOverClass="cal-drag-over"
            (drop)="eventDropped($event, day.date, true)"
            (dragEnter)="dateDragEnter(day.date)"
          ></div>
        </div>
        <div
          *ngFor="let eventRow of view.allDayEventRows; trackBy: trackById"
          #eventRowContainer
          class="cal-events-row"
        >
          <div
            *ngFor="
              let allDayEvent of eventRow.row;
              trackBy: trackByWeekAllDayEvent
            "
            #event
            class="cal-event-container"
            [class.cal-draggable]="
              allDayEvent.event.draggable && allDayEventResizes.size === 0
            "
            [class.cal-starts-within-week]="!allDayEvent.startsBeforeWeek"
            [class.cal-ends-within-week]="!allDayEvent.endsAfterWeek"
            [ngClass]="allDayEvent.event?.cssClass"
            [style.width.%]="(100 / days.length) * allDayEvent.span"
            [style.marginLeft.%]="
              rtl ? null : (100 / days.length) * allDayEvent.offset
            "
            [style.marginRight.%]="
              rtl
                ? (100 / days.length) * (days.length - allDayEvent.offset) * -1
                : null
            "
            mwlResizable
            [resizeSnapGrid]="{ left: dayColumnWidth, right: dayColumnWidth }"
            [validateResize]="validateResize"
            (resizeStart)="
              allDayEventResizeStarted(eventRowContainer, allDayEvent, $event)
            "
            (resizing)="
              allDayEventResizing(allDayEvent, $event, dayColumnWidth)
            "
            (resizeEnd)="allDayEventResizeEnded(allDayEvent)"
            mwlDraggable
            dragActiveClass="cal-drag-active"
            [dropData]="{ event: allDayEvent.event, calendarId: calendarId }"
            [dragAxis]="{
              x: allDayEvent.event.draggable && allDayEventResizes.size === 0,
              y:
                !snapDraggedEvents &&
                allDayEvent.event.draggable &&
                allDayEventResizes.size === 0
            }"
            [dragSnapGrid]="snapDraggedEvents ? { x: dayColumnWidth } : {}"
            [validateDrag]="validateDrag"
            [touchStartLongPress]="{ delay: 300, delta: 30 }"
            (dragStart)="
              dragStarted(eventRowContainer, event, allDayEvent, false)
            "
            (dragging)="allDayEventDragMove()"
            (dragEnd)="dragEnded(allDayEvent, $event, dayColumnWidth)"
          >
            <div
              class="cal-resize-handle cal-resize-handle-before-start"
              *ngIf="
                allDayEvent.event?.resizable?.beforeStart &&
                !allDayEvent.startsBeforeWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ left: true }"
            ></div>
            <mwl-calendar-week-view-event
              [locale]="locale"
              [weekEvent]="allDayEvent"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipDelay]="tooltipDelay"
              [customTemplate]="eventTemplate"
              [eventTitleTemplate]="eventTitleTemplate"
              [eventActionsTemplate]="eventActionsTemplate"
              [daysInWeek]="daysInWeek"
              (eventClicked)="
                eventClicked.emit({
                  event: allDayEvent.event,
                  sourceEvent: $event.sourceEvent
                })
              "
            >
            </mwl-calendar-week-view-event>
            <div
              class="cal-resize-handle cal-resize-handle-after-end"
              *ngIf="
                allDayEvent.event?.resizable?.afterEnd &&
                !allDayEvent.endsAfterWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ right: true }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="cal-time-events"
        mwlDroppable
        (dragEnter)="dragEnter('time')"
        (dragLeave)="dragLeave('time')"
      >
        <div
          class="cal-time-label-column"
          *ngIf="view.hourColumns.length > 0 && daysInWeek !== 1"
        >
          <div
            *ngFor="
              let hour of view.hourColumns[0].hours;
              trackBy: trackByHour;
              let odd = odd
            "
            class="cal-hour"
            [class.cal-hour-odd]="odd"
          >
            <mwl-calendar-week-view-hour-segment
              *ngFor="let segment of hour.segments; trackBy: trackByHourSegment"
              [style.height.px]="hourSegmentHeight"
              [segment]="segment"
              [segmentHeight]="hourSegmentHeight"
              [locale]="locale"
              [customTemplate]="hourSegmentTemplate"
              [isTimeLabel]="true"
              [daysInWeek]="daysInWeek"
            >
            </mwl-calendar-week-view-hour-segment>
          </div>
        </div>
        <div
          class="cal-day-columns"
          [class.cal-resize-active]="timeEventResizes.size > 0"
          #dayColumns
        >
          <div
            class="cal-day-column"
            *ngFor="let column of view.hourColumns; trackBy: trackByHourColumn"
          >
            <mwl-calendar-week-view-current-time-marker
              [columnDate]="column.date"
              [dayStartHour]="dayStartHour"
              [dayStartMinute]="dayStartMinute"
              [dayEndHour]="dayEndHour"
              [dayEndMinute]="dayEndMinute"
              [hourSegments]="hourSegments"
              [hourDuration]="hourDuration"
              [hourSegmentHeight]="hourSegmentHeight"
              [customTemplate]="currentTimeMarkerTemplate"
            ></mwl-calendar-week-view-current-time-marker>
            <div class="cal-events-container">
              <div
                *ngFor="
                  let timeEvent of column.events;
                  trackBy: trackByWeekTimeEvent
                "
                #event
                class="cal-event-container"
                [class.cal-draggable]="
                  timeEvent.event.draggable && timeEventResizes.size === 0
                "
                [class.cal-starts-within-day]="!timeEvent.startsBeforeDay"
                [class.cal-ends-within-day]="!timeEvent.endsAfterDay"
                [ngClass]="timeEvent.event.cssClass"
                [hidden]="timeEvent.height === 0 && timeEvent.width === 0"
                [style.top.px]="timeEvent.top"
                [style.height.px]="timeEvent.height"
                [style.left.%]="timeEvent.left"
                [style.width.%]="timeEvent.width"
                mwlResizable
                [resizeSnapGrid]="{
                  left: dayColumnWidth,
                  right: dayColumnWidth,
                  top: eventSnapSize || hourSegmentHeight,
                  bottom: eventSnapSize || hourSegmentHeight
                }"
                [validateResize]="validateResize"
                [allowNegativeResizes]="true"
                (resizeStart)="
                  timeEventResizeStarted(dayColumns, timeEvent, $event)
                "
                (resizing)="timeEventResizing(timeEvent, $event)"
                (resizeEnd)="timeEventResizeEnded(timeEvent)"
                mwlDraggable
                dragActiveClass="cal-drag-active"
                [dropData]="{ event: timeEvent.event, calendarId: calendarId }"
                [dragAxis]="{
                  x: timeEvent.event.draggable && timeEventResizes.size === 0,
                  y: timeEvent.event.draggable && timeEventResizes.size === 0
                }"
                [dragSnapGrid]="
                  snapDraggedEvents
                    ? {
                        x: dayColumnWidth,
                        y: eventSnapSize || hourSegmentHeight
                      }
                    : {}
                "
                [touchStartLongPress]="{ delay: 300, delta: 30 }"
                [ghostDragEnabled]="!snapDraggedEvents"
                [ghostElementTemplate]="weekEventTemplate"
                [validateDrag]="validateDrag"
                (dragStart)="dragStarted(dayColumns, event, timeEvent, true)"
                (dragging)="dragMove(timeEvent, $event)"
                (dragEnd)="dragEnded(timeEvent, $event, dayColumnWidth, true)"
              >
                <div
                  class="cal-resize-handle cal-resize-handle-before-start"
                  *ngIf="
                    timeEvent.event?.resizable?.beforeStart &&
                    !timeEvent.startsBeforeDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    left: true,
                    top: true
                  }"
                ></div>
                <ng-template
                  [ngTemplateOutlet]="weekEventTemplate"
                ></ng-template>
                <ng-template #weekEventTemplate>
                  <mwl-calendar-week-view-event
                    [locale]="locale"
                    [weekEvent]="timeEvent"
                    [tooltipPlacement]="tooltipPlacement"
                    [tooltipTemplate]="tooltipTemplate"
                    [tooltipAppendToBody]="tooltipAppendToBody"
                    [tooltipDisabled]="dragActive || timeEventResizes.size > 0"
                    [tooltipDelay]="tooltipDelay"
                    [customTemplate]="eventTemplate"
                    [eventTitleTemplate]="eventTitleTemplate"
                    [eventActionsTemplate]="eventActionsTemplate"
                    [column]="column"
                    [daysInWeek]="daysInWeek"
                    (eventClicked)="
                      eventClicked.emit({
                        event: timeEvent.event,
                        sourceEvent: $event.sourceEvent
                      })
                    "
                  >
                  </mwl-calendar-week-view-event>
                </ng-template>
                <div
                  class="cal-resize-handle cal-resize-handle-after-end"
                  *ngIf="
                    timeEvent.event?.resizable?.afterEnd &&
                    !timeEvent.endsAfterDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    right: true,
                    bottom: true
                  }"
                ></div>
              </div>
            </div>

            <div
              *ngFor="
                let hour of column.hours;
                trackBy: trackByHour;
                let odd = odd
              "
              class="cal-hour"
              [class.cal-hour-odd]="odd"
            >
              <mwl-calendar-week-view-hour-segment
                *ngFor="
                  let segment of hour.segments;
                  trackBy: trackByHourSegment
                "
                [style.height.px]="hourSegmentHeight"
                [segment]="segment"
                [segmentHeight]="hourSegmentHeight"
                [locale]="locale"
                [customTemplate]="hourSegmentTemplate"
                [daysInWeek]="daysInWeek"
                (mwlClick)="
                  hourSegmentClicked.emit({
                    date: segment.date,
                    sourceEvent: $event
                  })
                "
                [clickListenerDisabled]="
                  hourSegmentClicked.observers.length === 0
                "
                mwlDroppable
                [dragOverClass]="
                  !dragActive || !snapDraggedEvents ? 'cal-drag-over' : null
                "
                dragActiveClass="cal-drag-active"
                (drop)="eventDropped($event, segment.date, false)"
                (dragEnter)="dateDragEnter(segment.date)"
                [isTimeLabel]="daysInWeek === 1"
              >
              </mwl-calendar-week-view-hour-segment>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.CalendarUtils }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }, { type: i2.DateAdapter }, { type: i0.ElementRef }]; }, propDecorators: { viewDate: [{
                type: Input
            }], events: [{
                type: Input
            }], excludeDays: [{
                type: Input
            }], refresh: [{
                type: Input
            }], locale: [{
                type: Input
            }], tooltipPlacement: [{
                type: Input
            }], tooltipTemplate: [{
                type: Input
            }], tooltipAppendToBody: [{
                type: Input
            }], tooltipDelay: [{
                type: Input
            }], weekStartsOn: [{
                type: Input
            }], headerTemplate: [{
                type: Input
            }], eventTemplate: [{
                type: Input
            }], eventTitleTemplate: [{
                type: Input
            }], eventActionsTemplate: [{
                type: Input
            }], precision: [{
                type: Input
            }], weekendDays: [{
                type: Input
            }], snapDraggedEvents: [{
                type: Input
            }], hourSegments: [{
                type: Input
            }], hourDuration: [{
                type: Input
            }], hourSegmentHeight: [{
                type: Input
            }], minimumEventHeight: [{
                type: Input
            }], dayStartHour: [{
                type: Input
            }], dayStartMinute: [{
                type: Input
            }], dayEndHour: [{
                type: Input
            }], dayEndMinute: [{
                type: Input
            }], hourSegmentTemplate: [{
                type: Input
            }], eventSnapSize: [{
                type: Input
            }], allDayEventsLabelTemplate: [{
                type: Input
            }], daysInWeek: [{
                type: Input
            }], currentTimeMarkerTemplate: [{
                type: Input
            }], validateEventTimesChanged: [{
                type: Input
            }], dayHeaderClicked: [{
                type: Output
            }], eventClicked: [{
                type: Output
            }], eventTimesChanged: [{
                type: Output
            }], beforeViewRender: [{
                type: Output
            }], hourSegmentClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2FsZW5kYXIvc3JjL21vZHVsZXMvd2Vlay9jYWxlbmRhci13ZWVrLXZpZXcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUtaLFNBQVMsRUFDVCxNQUFNLEdBSVAsTUFBTSxlQUFlLENBQUM7QUFldkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDN0UsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDakYsT0FBTyxFQUVMLGtDQUFrQyxHQUNuQyxNQUFNLHdEQUF3RCxDQUFDO0FBRWhFLE9BQU8sRUFDTCxjQUFjLEVBQ2QsY0FBYyxFQUNkLHdCQUF3QixFQUN4QixrQkFBa0IsRUFDbEIsV0FBVyxFQUNYLGVBQWUsRUFDZixrQkFBa0IsRUFDbEIscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixzQkFBc0IsRUFDdEIsaUJBQWlCLEVBQ2pCLHNCQUFzQixFQUN0QixvQkFBb0IsR0FDckIsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7O0FBb0J4Qjs7Ozs7Ozs7O0dBU0c7QUFxVkgsTUFBTSxPQUFPLHlCQUF5QjtJQTZUcEM7O09BRUc7SUFDSCxZQUNZLEdBQXNCLEVBQ3RCLEtBQW9CLEVBQ1gsTUFBYyxFQUN2QixXQUF3QixFQUN4QixPQUFnQztRQUpoQyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUN0QixVQUFLLEdBQUwsS0FBSyxDQUFlO1FBRXBCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLFlBQU8sR0FBUCxPQUFPLENBQXlCO1FBN1Q1Qzs7O1dBR0c7UUFDTSxXQUFNLEdBQW9CLEVBQUUsQ0FBQztRQUV0Qzs7V0FF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QkFBZixLQUFLO2dCQUtHLE1BQU07c0JBQWQsS0FBSztnQkFLRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBS0csZUFBZTtzQkFBdkIsS0FBSztnQkFLRyxtQkFBbUI7c0JBQTNCLEtBQUs7Z0JBTUcsWUFBWTtzQkFBcEIsS0FBSztnQkFnQkcsWUFBWTtzQkFBcEIsS0FBSztnQkFLRyxjQUFjO3NCQUF0QixLQUFLO2dCQUtHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBS0csa0JBQWtCO3NCQUExQixLQUFLO2dCQUtHLG9CQUFvQjtzQkFBNUIsS0FBSztnQkFNRyxTQUFTO3NCQUFqQixLQUFLO2dCQUtHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBS0csaUJBQWlCO3NCQUF6QixLQUFLO2dCQUtHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBS0csWUFBWTtzQkFBcEIsS0FBSztnQkFLRyxpQkFBaUI7c0JBQXpCLEtBQUs7Z0JBS0csa0JBQWtCO3NCQUExQixLQUFLO2dCQUtHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBS0csY0FBYztzQkFBdEIsS0FBSztnQkFLRyxVQUFVO3NCQUFsQixLQUFLO2dCQUtHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBS0csbUJBQW1CO3NCQUEzQixLQUFLO2dCQUtHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBS0cseUJBQXlCO3NCQUFqQyxLQUFLO2dCQU1HLFVBQVU7c0JBQWxCLEtBQUs7Z0JBS0cseUJBQXlCO3NCQUFqQyxLQUFLO2dCQU1HLHlCQUF5QjtzQkFBakMsS0FBSztnQkFPSSxnQkFBZ0I7c0JBQXpCLE1BQU07Z0JBUUcsWUFBWTtzQkFBckIsTUFBTTtnQkFRRyxpQkFBaUI7c0JBQTFCLE1BQU07Z0JBT0csZ0JBQWdCO3NCQUF6QixNQUFNO2dCQU1HLGtCQUFrQjtzQkFBM0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgTE9DQUxFX0lELFxuICBJbmplY3QsXG4gIFRlbXBsYXRlUmVmLFxuICBFbGVtZW50UmVmLFxuICBBZnRlclZpZXdJbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgV2Vla0RheSxcbiAgQ2FsZW5kYXJFdmVudCxcbiAgV2Vla1ZpZXdBbGxEYXlFdmVudCxcbiAgV2Vla1ZpZXcsXG4gIFZpZXdQZXJpb2QsXG4gIFdlZWtWaWV3SG91ckNvbHVtbixcbiAgV2Vla1ZpZXdUaW1lRXZlbnQsXG4gIFdlZWtWaWV3SG91clNlZ21lbnQsXG4gIFdlZWtWaWV3SG91cixcbiAgV2Vla1ZpZXdBbGxEYXlFdmVudFJvdyxcbn0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgUmVzaXplRXZlbnQgfSBmcm9tICdhbmd1bGFyLXJlc2l6YWJsZS1lbGVtZW50JztcbmltcG9ydCB7IENhbGVuZGFyRHJhZ0hlbHBlciB9IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci1kcmFnLWhlbHBlci5wcm92aWRlcic7XG5pbXBvcnQgeyBDYWxlbmRhclJlc2l6ZUhlbHBlciB9IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci1yZXNpemUtaGVscGVyLnByb3ZpZGVyJztcbmltcG9ydCB7XG4gIENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudCxcbiAgQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50VHlwZSxcbn0gZnJvbSAnLi4vY29tbW9uL2NhbGVuZGFyLWV2ZW50LXRpbWVzLWNoYW5nZWQtZXZlbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IENhbGVuZGFyVXRpbHMgfSBmcm9tICcuLi9jb21tb24vY2FsZW5kYXItdXRpbHMucHJvdmlkZXInO1xuaW1wb3J0IHtcbiAgdmFsaWRhdGVFdmVudHMsXG4gIHJvdW5kVG9OZWFyZXN0LFxuICB0cmFja0J5V2Vla0RheUhlYWRlckRhdGUsXG4gIHRyYWNrQnlIb3VyU2VnbWVudCxcbiAgdHJhY2tCeUhvdXIsXG4gIGdldE1pbnV0ZXNNb3ZlZCxcbiAgZ2V0RGVmYXVsdEV2ZW50RW5kLFxuICBhZGREYXlzV2l0aEV4Y2x1c2lvbnMsXG4gIGlzRHJhZ2dlZFdpdGhpblBlcmlvZCxcbiAgc2hvdWxkRmlyZURyb3BwZWRFdmVudCxcbiAgZ2V0V2Vla1ZpZXdQZXJpb2QsXG4gIHRyYWNrQnlXZWVrQWxsRGF5RXZlbnQsXG4gIHRyYWNrQnlXZWVrVGltZUV2ZW50LFxufSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uL2RhdGUtYWRhcHRlcnMvZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7XG4gIERyYWdFbmRFdmVudCxcbiAgRHJvcEV2ZW50LFxuICBEcmFnTW92ZUV2ZW50LFxuICBWYWxpZGF0ZURyYWcsXG59IGZyb20gJ2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZSc7XG5pbXBvcnQgeyBQbGFjZW1lbnRBcnJheSB9IGZyb20gJ3Bvc2l0aW9uaW5nJztcblxuZXhwb3J0IGludGVyZmFjZSBXZWVrVmlld0FsbERheUV2ZW50UmVzaXplIHtcbiAgb3JpZ2luYWxPZmZzZXQ6IG51bWJlcjtcbiAgb3JpZ2luYWxTcGFuOiBudW1iZXI7XG4gIGVkZ2U6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYWxlbmRhcldlZWtWaWV3QmVmb3JlUmVuZGVyRXZlbnQgZXh0ZW5kcyBXZWVrVmlldyB7XG4gIGhlYWRlcjogV2Vla0RheVtdO1xufVxuXG4vKipcbiAqIFNob3dzIGFsbCBldmVudHMgb24gYSBnaXZlbiB3ZWVrLiBFeGFtcGxlIHVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIDxtd2wtY2FsZW5kYXItd2Vlay12aWV3XG4gKiAgW3ZpZXdEYXRlXT1cInZpZXdEYXRlXCJcbiAqICBbZXZlbnRzXT1cImV2ZW50c1wiPlxuICogPC9td2wtY2FsZW5kYXItd2Vlay12aWV3PlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci13ZWVrLXZpZXcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJjYWwtd2Vlay12aWV3XCIgcm9sZT1cImdyaWRcIj5cbiAgICAgIDxtd2wtY2FsZW5kYXItd2Vlay12aWV3LWhlYWRlclxuICAgICAgICBbZGF5c109XCJkYXlzXCJcbiAgICAgICAgW2xvY2FsZV09XCJsb2NhbGVcIlxuICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiaGVhZGVyVGVtcGxhdGVcIlxuICAgICAgICAoZGF5SGVhZGVyQ2xpY2tlZCk9XCJkYXlIZWFkZXJDbGlja2VkLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgIChldmVudERyb3BwZWQpPVwiXG4gICAgICAgICAgZXZlbnREcm9wcGVkKHsgZHJvcERhdGE6ICRldmVudCB9LCAkZXZlbnQubmV3U3RhcnQsIHRydWUpXG4gICAgICAgIFwiXG4gICAgICAgIChkcmFnRW50ZXIpPVwiZGF0ZURyYWdFbnRlcigkZXZlbnQuZGF0ZSlcIlxuICAgICAgPlxuICAgICAgPC9td2wtY2FsZW5kYXItd2Vlay12aWV3LWhlYWRlcj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJjYWwtYWxsLWRheS1ldmVudHNcIlxuICAgICAgICAjYWxsRGF5RXZlbnRzQ29udGFpbmVyXG4gICAgICAgICpuZ0lmPVwidmlldy5hbGxEYXlFdmVudFJvd3MubGVuZ3RoID4gMFwiXG4gICAgICAgIG13bERyb3BwYWJsZVxuICAgICAgICAoZHJhZ0VudGVyKT1cImRyYWdFbnRlcignYWxsRGF5JylcIlxuICAgICAgICAoZHJhZ0xlYXZlKT1cImRyYWdMZWF2ZSgnYWxsRGF5JylcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FsLWRheS1jb2x1bW5zXCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtdGltZS1sYWJlbC1jb2x1bW5cIlxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiYWxsRGF5RXZlbnRzTGFiZWxUZW1wbGF0ZVwiXG4gICAgICAgICAgPjwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzPVwiY2FsLWRheS1jb2x1bW5cIlxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGRheSBvZiBkYXlzOyB0cmFja0J5OiB0cmFja0J5V2Vla0RheUhlYWRlckRhdGVcIlxuICAgICAgICAgICAgbXdsRHJvcHBhYmxlXG4gICAgICAgICAgICBkcmFnT3ZlckNsYXNzPVwiY2FsLWRyYWctb3ZlclwiXG4gICAgICAgICAgICAoZHJvcCk9XCJldmVudERyb3BwZWQoJGV2ZW50LCBkYXkuZGF0ZSwgdHJ1ZSlcIlxuICAgICAgICAgICAgKGRyYWdFbnRlcik9XCJkYXRlRHJhZ0VudGVyKGRheS5kYXRlKVwiXG4gICAgICAgICAgPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgICpuZ0Zvcj1cImxldCBldmVudFJvdyBvZiB2aWV3LmFsbERheUV2ZW50Um93czsgdHJhY2tCeTogdHJhY2tCeUlkXCJcbiAgICAgICAgICAjZXZlbnRSb3dDb250YWluZXJcbiAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudHMtcm93XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICpuZ0Zvcj1cIlxuICAgICAgICAgICAgICBsZXQgYWxsRGF5RXZlbnQgb2YgZXZlbnRSb3cucm93O1xuICAgICAgICAgICAgICB0cmFja0J5OiB0cmFja0J5V2Vla0FsbERheUV2ZW50XG4gICAgICAgICAgICBcIlxuICAgICAgICAgICAgI2V2ZW50XG4gICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1jb250YWluZXJcIlxuICAgICAgICAgICAgW2NsYXNzLmNhbC1kcmFnZ2FibGVdPVwiXG4gICAgICAgICAgICAgIGFsbERheUV2ZW50LmV2ZW50LmRyYWdnYWJsZSAmJiBhbGxEYXlFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMFxuICAgICAgICAgICAgXCJcbiAgICAgICAgICAgIFtjbGFzcy5jYWwtc3RhcnRzLXdpdGhpbi13ZWVrXT1cIiFhbGxEYXlFdmVudC5zdGFydHNCZWZvcmVXZWVrXCJcbiAgICAgICAgICAgIFtjbGFzcy5jYWwtZW5kcy13aXRoaW4td2Vla109XCIhYWxsRGF5RXZlbnQuZW5kc0FmdGVyV2Vla1wiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJhbGxEYXlFdmVudC5ldmVudD8uY3NzQ2xhc3NcIlxuICAgICAgICAgICAgW3N0eWxlLndpZHRoLiVdPVwiKDEwMCAvIGRheXMubGVuZ3RoKSAqIGFsbERheUV2ZW50LnNwYW5cIlxuICAgICAgICAgICAgW3N0eWxlLm1hcmdpbkxlZnQuJV09XCJcbiAgICAgICAgICAgICAgcnRsID8gbnVsbCA6ICgxMDAgLyBkYXlzLmxlbmd0aCkgKiBhbGxEYXlFdmVudC5vZmZzZXRcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgICBbc3R5bGUubWFyZ2luUmlnaHQuJV09XCJcbiAgICAgICAgICAgICAgcnRsXG4gICAgICAgICAgICAgICAgPyAoMTAwIC8gZGF5cy5sZW5ndGgpICogKGRheXMubGVuZ3RoIC0gYWxsRGF5RXZlbnQub2Zmc2V0KSAqIC0xXG4gICAgICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICAgICBcIlxuICAgICAgICAgICAgbXdsUmVzaXphYmxlXG4gICAgICAgICAgICBbcmVzaXplU25hcEdyaWRdPVwieyBsZWZ0OiBkYXlDb2x1bW5XaWR0aCwgcmlnaHQ6IGRheUNvbHVtbldpZHRoIH1cIlxuICAgICAgICAgICAgW3ZhbGlkYXRlUmVzaXplXT1cInZhbGlkYXRlUmVzaXplXCJcbiAgICAgICAgICAgIChyZXNpemVTdGFydCk9XCJcbiAgICAgICAgICAgICAgYWxsRGF5RXZlbnRSZXNpemVTdGFydGVkKGV2ZW50Um93Q29udGFpbmVyLCBhbGxEYXlFdmVudCwgJGV2ZW50KVxuICAgICAgICAgICAgXCJcbiAgICAgICAgICAgIChyZXNpemluZyk9XCJcbiAgICAgICAgICAgICAgYWxsRGF5RXZlbnRSZXNpemluZyhhbGxEYXlFdmVudCwgJGV2ZW50LCBkYXlDb2x1bW5XaWR0aClcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAocmVzaXplRW5kKT1cImFsbERheUV2ZW50UmVzaXplRW5kZWQoYWxsRGF5RXZlbnQpXCJcbiAgICAgICAgICAgIG13bERyYWdnYWJsZVxuICAgICAgICAgICAgZHJhZ0FjdGl2ZUNsYXNzPVwiY2FsLWRyYWctYWN0aXZlXCJcbiAgICAgICAgICAgIFtkcm9wRGF0YV09XCJ7IGV2ZW50OiBhbGxEYXlFdmVudC5ldmVudCwgY2FsZW5kYXJJZDogY2FsZW5kYXJJZCB9XCJcbiAgICAgICAgICAgIFtkcmFnQXhpc109XCJ7XG4gICAgICAgICAgICAgIHg6IGFsbERheUV2ZW50LmV2ZW50LmRyYWdnYWJsZSAmJiBhbGxEYXlFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMCxcbiAgICAgICAgICAgICAgeTpcbiAgICAgICAgICAgICAgICAhc25hcERyYWdnZWRFdmVudHMgJiZcbiAgICAgICAgICAgICAgICBhbGxEYXlFdmVudC5ldmVudC5kcmFnZ2FibGUgJiZcbiAgICAgICAgICAgICAgICBhbGxEYXlFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMFxuICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICBbZHJhZ1NuYXBHcmlkXT1cInNuYXBEcmFnZ2VkRXZlbnRzID8geyB4OiBkYXlDb2x1bW5XaWR0aCB9IDoge31cIlxuICAgICAgICAgICAgW3ZhbGlkYXRlRHJhZ109XCJ2YWxpZGF0ZURyYWdcIlxuICAgICAgICAgICAgW3RvdWNoU3RhcnRMb25nUHJlc3NdPVwieyBkZWxheTogMzAwLCBkZWx0YTogMzAgfVwiXG4gICAgICAgICAgICAoZHJhZ1N0YXJ0KT1cIlxuICAgICAgICAgICAgICBkcmFnU3RhcnRlZChldmVudFJvd0NvbnRhaW5lciwgZXZlbnQsIGFsbERheUV2ZW50LCBmYWxzZSlcbiAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAoZHJhZ2dpbmcpPVwiYWxsRGF5RXZlbnREcmFnTW92ZSgpXCJcbiAgICAgICAgICAgIChkcmFnRW5kKT1cImRyYWdFbmRlZChhbGxEYXlFdmVudCwgJGV2ZW50LCBkYXlDb2x1bW5XaWR0aClcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3M9XCJjYWwtcmVzaXplLWhhbmRsZSBjYWwtcmVzaXplLWhhbmRsZS1iZWZvcmUtc3RhcnRcIlxuICAgICAgICAgICAgICAqbmdJZj1cIlxuICAgICAgICAgICAgICAgIGFsbERheUV2ZW50LmV2ZW50Py5yZXNpemFibGU/LmJlZm9yZVN0YXJ0ICYmXG4gICAgICAgICAgICAgICAgIWFsbERheUV2ZW50LnN0YXJ0c0JlZm9yZVdlZWtcbiAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgbXdsUmVzaXplSGFuZGxlXG4gICAgICAgICAgICAgIFtyZXNpemVFZGdlc109XCJ7IGxlZnQ6IHRydWUgfVwiXG4gICAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgICA8bXdsLWNhbGVuZGFyLXdlZWstdmlldy1ldmVudFxuICAgICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgICAgICAgIFt3ZWVrRXZlbnRdPVwiYWxsRGF5RXZlbnRcIlxuICAgICAgICAgICAgICBbdG9vbHRpcFBsYWNlbWVudF09XCJ0b29sdGlwUGxhY2VtZW50XCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICAgICAgICBbdG9vbHRpcEFwcGVuZFRvQm9keV09XCJ0b29sdGlwQXBwZW5kVG9Cb2R5XCJcbiAgICAgICAgICAgICAgW3Rvb2x0aXBEZWxheV09XCJ0b29sdGlwRGVsYXlcIlxuICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgIFtldmVudFRpdGxlVGVtcGxhdGVdPVwiZXZlbnRUaXRsZVRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgW2V2ZW50QWN0aW9uc1RlbXBsYXRlXT1cImV2ZW50QWN0aW9uc1RlbXBsYXRlXCJcbiAgICAgICAgICAgICAgW2RheXNJbldlZWtdPVwiZGF5c0luV2Vla1wiXG4gICAgICAgICAgICAgIChldmVudENsaWNrZWQpPVwiXG4gICAgICAgICAgICAgICAgZXZlbnRDbGlja2VkLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgZXZlbnQ6IGFsbERheUV2ZW50LmV2ZW50LFxuICAgICAgICAgICAgICAgICAgc291cmNlRXZlbnQ6ICRldmVudC5zb3VyY2VFdmVudFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctZXZlbnQ+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzPVwiY2FsLXJlc2l6ZS1oYW5kbGUgY2FsLXJlc2l6ZS1oYW5kbGUtYWZ0ZXItZW5kXCJcbiAgICAgICAgICAgICAgKm5nSWY9XCJcbiAgICAgICAgICAgICAgICBhbGxEYXlFdmVudC5ldmVudD8ucmVzaXphYmxlPy5hZnRlckVuZCAmJlxuICAgICAgICAgICAgICAgICFhbGxEYXlFdmVudC5lbmRzQWZ0ZXJXZWVrXG4gICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgIG13bFJlc2l6ZUhhbmRsZVxuICAgICAgICAgICAgICBbcmVzaXplRWRnZXNdPVwieyByaWdodDogdHJ1ZSB9XCJcbiAgICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJjYWwtdGltZS1ldmVudHNcIlxuICAgICAgICBtd2xEcm9wcGFibGVcbiAgICAgICAgKGRyYWdFbnRlcik9XCJkcmFnRW50ZXIoJ3RpbWUnKVwiXG4gICAgICAgIChkcmFnTGVhdmUpPVwiZHJhZ0xlYXZlKCd0aW1lJylcIlxuICAgICAgPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJjYWwtdGltZS1sYWJlbC1jb2x1bW5cIlxuICAgICAgICAgICpuZ0lmPVwidmlldy5ob3VyQ29sdW1ucy5sZW5ndGggPiAwICYmIGRheXNJbldlZWsgIT09IDFcIlxuICAgICAgICA+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgKm5nRm9yPVwiXG4gICAgICAgICAgICAgIGxldCBob3VyIG9mIHZpZXcuaG91ckNvbHVtbnNbMF0uaG91cnM7XG4gICAgICAgICAgICAgIHRyYWNrQnk6IHRyYWNrQnlIb3VyO1xuICAgICAgICAgICAgICBsZXQgb2RkID0gb2RkXG4gICAgICAgICAgICBcIlxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtaG91clwiXG4gICAgICAgICAgICBbY2xhc3MuY2FsLWhvdXItb2RkXT1cIm9kZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPG13bC1jYWxlbmRhci13ZWVrLXZpZXctaG91ci1zZWdtZW50XG4gICAgICAgICAgICAgICpuZ0Zvcj1cImxldCBzZWdtZW50IG9mIGhvdXIuc2VnbWVudHM7IHRyYWNrQnk6IHRyYWNrQnlIb3VyU2VnbWVudFwiXG4gICAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICBbc2VnbWVudF09XCJzZWdtZW50XCJcbiAgICAgICAgICAgICAgW3NlZ21lbnRIZWlnaHRdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJob3VyU2VnbWVudFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgW2lzVGltZUxhYmVsXT1cInRydWVcIlxuICAgICAgICAgICAgICBbZGF5c0luV2Vla109XCJkYXlzSW5XZWVrXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgIDwvbXdsLWNhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJjYWwtZGF5LWNvbHVtbnNcIlxuICAgICAgICAgIFtjbGFzcy5jYWwtcmVzaXplLWFjdGl2ZV09XCJ0aW1lRXZlbnRSZXNpemVzLnNpemUgPiAwXCJcbiAgICAgICAgICAjZGF5Q29sdW1uc1xuICAgICAgICA+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3M9XCJjYWwtZGF5LWNvbHVtblwiXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgY29sdW1uIG9mIHZpZXcuaG91ckNvbHVtbnM7IHRyYWNrQnk6IHRyYWNrQnlIb3VyQ29sdW1uXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8bXdsLWNhbGVuZGFyLXdlZWstdmlldy1jdXJyZW50LXRpbWUtbWFya2VyXG4gICAgICAgICAgICAgIFtjb2x1bW5EYXRlXT1cImNvbHVtbi5kYXRlXCJcbiAgICAgICAgICAgICAgW2RheVN0YXJ0SG91cl09XCJkYXlTdGFydEhvdXJcIlxuICAgICAgICAgICAgICBbZGF5U3RhcnRNaW51dGVdPVwiZGF5U3RhcnRNaW51dGVcIlxuICAgICAgICAgICAgICBbZGF5RW5kSG91cl09XCJkYXlFbmRIb3VyXCJcbiAgICAgICAgICAgICAgW2RheUVuZE1pbnV0ZV09XCJkYXlFbmRNaW51dGVcIlxuICAgICAgICAgICAgICBbaG91clNlZ21lbnRzXT1cImhvdXJTZWdtZW50c1wiXG4gICAgICAgICAgICAgIFtob3VyRHVyYXRpb25dPVwiaG91ckR1cmF0aW9uXCJcbiAgICAgICAgICAgICAgW2hvdXJTZWdtZW50SGVpZ2h0XT1cImhvdXJTZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImN1cnJlbnRUaW1lTWFya2VyVGVtcGxhdGVcIlxuICAgICAgICAgICAgPjwvbXdsLWNhbGVuZGFyLXdlZWstdmlldy1jdXJyZW50LXRpbWUtbWFya2VyPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhbC1ldmVudHMtY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJcbiAgICAgICAgICAgICAgICAgIGxldCB0aW1lRXZlbnQgb2YgY29sdW1uLmV2ZW50cztcbiAgICAgICAgICAgICAgICAgIHRyYWNrQnk6IHRyYWNrQnlXZWVrVGltZUV2ZW50XG4gICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICAjZXZlbnRcbiAgICAgICAgICAgICAgICBjbGFzcz1cImNhbC1ldmVudC1jb250YWluZXJcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtZHJhZ2dhYmxlXT1cIlxuICAgICAgICAgICAgICAgICAgdGltZUV2ZW50LmV2ZW50LmRyYWdnYWJsZSAmJiB0aW1lRXZlbnRSZXNpemVzLnNpemUgPT09IDBcbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtc3RhcnRzLXdpdGhpbi1kYXldPVwiIXRpbWVFdmVudC5zdGFydHNCZWZvcmVEYXlcIlxuICAgICAgICAgICAgICAgIFtjbGFzcy5jYWwtZW5kcy13aXRoaW4tZGF5XT1cIiF0aW1lRXZlbnQuZW5kc0FmdGVyRGF5XCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ0aW1lRXZlbnQuZXZlbnQuY3NzQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFtoaWRkZW5dPVwidGltZUV2ZW50LmhlaWdodCA9PT0gMCAmJiB0aW1lRXZlbnQud2lkdGggPT09IDBcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50b3AucHhdPVwidGltZUV2ZW50LnRvcFwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLmhlaWdodC5weF09XCJ0aW1lRXZlbnQuaGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbc3R5bGUubGVmdC4lXT1cInRpbWVFdmVudC5sZWZ0XCJcbiAgICAgICAgICAgICAgICBbc3R5bGUud2lkdGguJV09XCJ0aW1lRXZlbnQud2lkdGhcIlxuICAgICAgICAgICAgICAgIG13bFJlc2l6YWJsZVxuICAgICAgICAgICAgICAgIFtyZXNpemVTbmFwR3JpZF09XCJ7XG4gICAgICAgICAgICAgICAgICBsZWZ0OiBkYXlDb2x1bW5XaWR0aCxcbiAgICAgICAgICAgICAgICAgIHJpZ2h0OiBkYXlDb2x1bW5XaWR0aCxcbiAgICAgICAgICAgICAgICAgIHRvcDogZXZlbnRTbmFwU2l6ZSB8fCBob3VyU2VnbWVudEhlaWdodCxcbiAgICAgICAgICAgICAgICAgIGJvdHRvbTogZXZlbnRTbmFwU2l6ZSB8fCBob3VyU2VnbWVudEhlaWdodFxuICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgIFt2YWxpZGF0ZVJlc2l6ZV09XCJ2YWxpZGF0ZVJlc2l6ZVwiXG4gICAgICAgICAgICAgICAgW2FsbG93TmVnYXRpdmVSZXNpemVzXT1cInRydWVcIlxuICAgICAgICAgICAgICAgIChyZXNpemVTdGFydCk9XCJcbiAgICAgICAgICAgICAgICAgIHRpbWVFdmVudFJlc2l6ZVN0YXJ0ZWQoZGF5Q29sdW1ucywgdGltZUV2ZW50LCAkZXZlbnQpXG4gICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICAocmVzaXppbmcpPVwidGltZUV2ZW50UmVzaXppbmcodGltZUV2ZW50LCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAocmVzaXplRW5kKT1cInRpbWVFdmVudFJlc2l6ZUVuZGVkKHRpbWVFdmVudClcIlxuICAgICAgICAgICAgICAgIG13bERyYWdnYWJsZVxuICAgICAgICAgICAgICAgIGRyYWdBY3RpdmVDbGFzcz1cImNhbC1kcmFnLWFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgW2Ryb3BEYXRhXT1cInsgZXZlbnQ6IHRpbWVFdmVudC5ldmVudCwgY2FsZW5kYXJJZDogY2FsZW5kYXJJZCB9XCJcbiAgICAgICAgICAgICAgICBbZHJhZ0F4aXNdPVwie1xuICAgICAgICAgICAgICAgICAgeDogdGltZUV2ZW50LmV2ZW50LmRyYWdnYWJsZSAmJiB0aW1lRXZlbnRSZXNpemVzLnNpemUgPT09IDAsXG4gICAgICAgICAgICAgICAgICB5OiB0aW1lRXZlbnQuZXZlbnQuZHJhZ2dhYmxlICYmIHRpbWVFdmVudFJlc2l6ZXMuc2l6ZSA9PT0gMFxuICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgIFtkcmFnU25hcEdyaWRdPVwiXG4gICAgICAgICAgICAgICAgICBzbmFwRHJhZ2dlZEV2ZW50c1xuICAgICAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IGRheUNvbHVtbldpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogZXZlbnRTbmFwU2l6ZSB8fCBob3VyU2VnbWVudEhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgOiB7fVxuICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgW3RvdWNoU3RhcnRMb25nUHJlc3NdPVwieyBkZWxheTogMzAwLCBkZWx0YTogMzAgfVwiXG4gICAgICAgICAgICAgICAgW2dob3N0RHJhZ0VuYWJsZWRdPVwiIXNuYXBEcmFnZ2VkRXZlbnRzXCJcbiAgICAgICAgICAgICAgICBbZ2hvc3RFbGVtZW50VGVtcGxhdGVdPVwid2Vla0V2ZW50VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFt2YWxpZGF0ZURyYWddPVwidmFsaWRhdGVEcmFnXCJcbiAgICAgICAgICAgICAgICAoZHJhZ1N0YXJ0KT1cImRyYWdTdGFydGVkKGRheUNvbHVtbnMsIGV2ZW50LCB0aW1lRXZlbnQsIHRydWUpXCJcbiAgICAgICAgICAgICAgICAoZHJhZ2dpbmcpPVwiZHJhZ01vdmUodGltZUV2ZW50LCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoZHJhZ0VuZCk9XCJkcmFnRW5kZWQodGltZUV2ZW50LCAkZXZlbnQsIGRheUNvbHVtbldpZHRoLCB0cnVlKVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzcz1cImNhbC1yZXNpemUtaGFuZGxlIGNhbC1yZXNpemUtaGFuZGxlLWJlZm9yZS1zdGFydFwiXG4gICAgICAgICAgICAgICAgICAqbmdJZj1cIlxuICAgICAgICAgICAgICAgICAgICB0aW1lRXZlbnQuZXZlbnQ/LnJlc2l6YWJsZT8uYmVmb3JlU3RhcnQgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRpbWVFdmVudC5zdGFydHNCZWZvcmVEYXlcbiAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgICBtd2xSZXNpemVIYW5kbGVcbiAgICAgICAgICAgICAgICAgIFtyZXNpemVFZGdlc109XCJ7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAgICAgPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwid2Vla0V2ZW50VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgID48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjd2Vla0V2ZW50VGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICA8bXdsLWNhbGVuZGFyLXdlZWstdmlldy1ldmVudFxuICAgICAgICAgICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgICAgICAgICAgICAgIFt3ZWVrRXZlbnRdPVwidGltZUV2ZW50XCJcbiAgICAgICAgICAgICAgICAgICAgW3Rvb2x0aXBQbGFjZW1lbnRdPVwidG9vbHRpcFBsYWNlbWVudFwiXG4gICAgICAgICAgICAgICAgICAgIFt0b29sdGlwVGVtcGxhdGVdPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgW3Rvb2x0aXBBcHBlbmRUb0JvZHldPVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICAgICAgICAgICAgICAgIFt0b29sdGlwRGlzYWJsZWRdPVwiZHJhZ0FjdGl2ZSB8fCB0aW1lRXZlbnRSZXNpemVzLnNpemUgPiAwXCJcbiAgICAgICAgICAgICAgICAgICAgW3Rvb2x0aXBEZWxheV09XCJ0b29sdGlwRGVsYXlcIlxuICAgICAgICAgICAgICAgICAgICBbY3VzdG9tVGVtcGxhdGVdPVwiZXZlbnRUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgIFtldmVudFRpdGxlVGVtcGxhdGVdPVwiZXZlbnRUaXRsZVRlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgW2V2ZW50QWN0aW9uc1RlbXBsYXRlXT1cImV2ZW50QWN0aW9uc1RlbXBsYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgW2NvbHVtbl09XCJjb2x1bW5cIlxuICAgICAgICAgICAgICAgICAgICBbZGF5c0luV2Vla109XCJkYXlzSW5XZWVrXCJcbiAgICAgICAgICAgICAgICAgICAgKGV2ZW50Q2xpY2tlZCk9XCJcbiAgICAgICAgICAgICAgICAgICAgICBldmVudENsaWNrZWQuZW1pdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudDogdGltZUV2ZW50LmV2ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRXZlbnQ6ICRldmVudC5zb3VyY2VFdmVudFxuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8L213bC1jYWxlbmRhci13ZWVrLXZpZXctZXZlbnQ+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBjbGFzcz1cImNhbC1yZXNpemUtaGFuZGxlIGNhbC1yZXNpemUtaGFuZGxlLWFmdGVyLWVuZFwiXG4gICAgICAgICAgICAgICAgICAqbmdJZj1cIlxuICAgICAgICAgICAgICAgICAgICB0aW1lRXZlbnQuZXZlbnQ/LnJlc2l6YWJsZT8uYWZ0ZXJFbmQgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRpbWVFdmVudC5lbmRzQWZ0ZXJEYXlcbiAgICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgICBtd2xSZXNpemVIYW5kbGVcbiAgICAgICAgICAgICAgICAgIFtyZXNpemVFZGdlc109XCJ7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206IHRydWVcbiAgICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAqbmdGb3I9XCJcbiAgICAgICAgICAgICAgICBsZXQgaG91ciBvZiBjb2x1bW4uaG91cnM7XG4gICAgICAgICAgICAgICAgdHJhY2tCeTogdHJhY2tCeUhvdXI7XG4gICAgICAgICAgICAgICAgbGV0IG9kZCA9IG9kZFxuICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICBjbGFzcz1cImNhbC1ob3VyXCJcbiAgICAgICAgICAgICAgW2NsYXNzLmNhbC1ob3VyLW9kZF09XCJvZGRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8bXdsLWNhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnRcbiAgICAgICAgICAgICAgICAqbmdGb3I9XCJcbiAgICAgICAgICAgICAgICAgIGxldCBzZWdtZW50IG9mIGhvdXIuc2VnbWVudHM7XG4gICAgICAgICAgICAgICAgICB0cmFja0J5OiB0cmFja0J5SG91clNlZ21lbnRcbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQucHhdPVwiaG91clNlZ21lbnRIZWlnaHRcIlxuICAgICAgICAgICAgICAgIFtzZWdtZW50XT1cInNlZ21lbnRcIlxuICAgICAgICAgICAgICAgIFtzZWdtZW50SGVpZ2h0XT1cImhvdXJTZWdtZW50SGVpZ2h0XCJcbiAgICAgICAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZVwiXG4gICAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImhvdXJTZWdtZW50VGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFtkYXlzSW5XZWVrXT1cImRheXNJbldlZWtcIlxuICAgICAgICAgICAgICAgIChtd2xDbGljayk9XCJcbiAgICAgICAgICAgICAgICAgIGhvdXJTZWdtZW50Q2xpY2tlZC5lbWl0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZTogc2VnbWVudC5kYXRlLFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VFdmVudDogJGV2ZW50XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIFwiXG4gICAgICAgICAgICAgICAgW2NsaWNrTGlzdGVuZXJEaXNhYmxlZF09XCJcbiAgICAgICAgICAgICAgICAgIGhvdXJTZWdtZW50Q2xpY2tlZC5vYnNlcnZlcnMubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgXCJcbiAgICAgICAgICAgICAgICBtd2xEcm9wcGFibGVcbiAgICAgICAgICAgICAgICBbZHJhZ092ZXJDbGFzc109XCJcbiAgICAgICAgICAgICAgICAgICFkcmFnQWN0aXZlIHx8ICFzbmFwRHJhZ2dlZEV2ZW50cyA/ICdjYWwtZHJhZy1vdmVyJyA6IG51bGxcbiAgICAgICAgICAgICAgICBcIlxuICAgICAgICAgICAgICAgIGRyYWdBY3RpdmVDbGFzcz1cImNhbC1kcmFnLWFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgKGRyb3ApPVwiZXZlbnREcm9wcGVkKCRldmVudCwgc2VnbWVudC5kYXRlLCBmYWxzZSlcIlxuICAgICAgICAgICAgICAgIChkcmFnRW50ZXIpPVwiZGF0ZURyYWdFbnRlcihzZWdtZW50LmRhdGUpXCJcbiAgICAgICAgICAgICAgICBbaXNUaW1lTGFiZWxdPVwiZGF5c0luV2VlayA9PT0gMVwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPC9td2wtY2FsZW5kYXItd2Vlay12aWV3LWhvdXItc2VnbWVudD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxufSlcbmV4cG9ydCBjbGFzcyBDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50XG4gIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdFxue1xuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmlldyBkYXRlXG4gICAqL1xuICBASW5wdXQoKSB2aWV3RGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXZlbnRzIHRvIGRpc3BsYXkgb24gdmlld1xuICAgKiBUaGUgc2NoZW1hIGlzIGF2YWlsYWJsZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vbWF0dGxld2lzOTIvY2FsZW5kYXItdXRpbHMvYmxvYi9jNTE2ODk5ODVmNTlhMjcxOTQwZTMwYmM0ZTJjNGUxZmVlM2ZjYjVjL3NyYy9jYWxlbmRhclV0aWxzLnRzI0w0OS1MNjNcbiAgICovXG4gIEBJbnB1dCgpIGV2ZW50czogQ2FsZW5kYXJFdmVudFtdID0gW107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGRheSBpbmRleGVzICgwID0gc3VuZGF5LCAxID0gbW9uZGF5IGV0YykgdGhhdCB3aWxsIGJlIGhpZGRlbiBvbiB0aGUgdmlld1xuICAgKi9cbiAgQElucHV0KCkgZXhjbHVkZURheXM6IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIEFuIG9ic2VydmFibGUgdGhhdCB3aGVuIGVtaXR0ZWQgb24gd2lsbCByZS1yZW5kZXIgdGhlIGN1cnJlbnQgdmlld1xuICAgKi9cbiAgQElucHV0KCkgcmVmcmVzaDogU3ViamVjdDxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgbG9jYWxlIHVzZWQgdG8gZm9ybWF0IGRhdGVzXG4gICAqL1xuICBASW5wdXQoKSBsb2NhbGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBsYWNlbWVudCBvZiB0aGUgZXZlbnQgdG9vbHRpcFxuICAgKi9cbiAgQElucHV0KCkgdG9vbHRpcFBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYXV0byc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSBmb3IgdGhlIGV2ZW50IHRvb2x0aXBzXG4gICAqL1xuICBASW5wdXQoKSB0b29sdGlwVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gYXBwZW5kIHRvb2x0aXBzIHRvIHRoZSBib2R5IG9yIG5leHQgdG8gdGhlIHRyaWdnZXIgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCkgdG9vbHRpcEFwcGVuZFRvQm9keTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWxheSBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIHRoZSB0b29sdGlwIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIG5vdCBwcm92aWRlZCB0aGUgdG9vbHRpcFxuICAgKiB3aWxsIGJlIGRpc3BsYXllZCBpbW1lZGlhdGVseS5cbiAgICovXG4gIEBJbnB1dCgpIHRvb2x0aXBEZWxheTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGFydCBudW1iZXIgb2YgdGhlIHdlZWsuXG4gICAqIFRoaXMgaXMgaWdub3JlZCB3aGVuIHRoZSBgZGF5c0luV2Vla2AgaW5wdXQgaXMgYWxzbyBzZXQgYXMgdGhlIGB2aWV3RGF0ZWAgd2lsbCBiZSB1c2VkIGFzIHRoZSBzdGFydCBvZiB0aGUgd2VlayBpbnN0ZWFkLlxuICAgKiBOb3RlLCB5b3Ugc2hvdWxkIGFsc28gcGFzcyB0aGlzIHRvIHRoZSBjYWxlbmRhciB0aXRsZSBwaXBlIHNvIGl0IHNob3dzIHRoZSBzYW1lIGRheXM6IHt7IHZpZXdEYXRlIHwgY2FsZW5kYXJEYXRlOih2aWV3ICsgJ1ZpZXdUaXRsZScpOmxvY2FsZTp3ZWVrU3RhcnRzT24gfX1cbiAgICogSWYgdXNpbmcgdGhlIG1vbWVudCBkYXRlIGFkYXB0ZXIgdGhpcyBvcHRpb24gd29uJ3QgZG8gYW55dGhpbmcgYW5kIHlvdSdsbCBuZWVkIHRvIHNldCBpdCBnbG9iYWxseSBsaWtlIHNvOlxuICAgKiBgYGBcbiAgICogbW9tZW50LnVwZGF0ZUxvY2FsZSgnZW4nLCB7XG4gICAqICAgd2Vlazoge1xuICAgKiAgICAgZG93OiAxLCAvLyBzZXQgc3RhcnQgb2Ygd2VlayB0byBtb25kYXkgaW5zdGVhZFxuICAgKiAgICAgZG95OiAwLFxuICAgKiAgIH0sXG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICovXG4gIEBJbnB1dCgpIHdlZWtTdGFydHNPbjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgdG8gcmVwbGFjZSB0aGUgaGVhZGVyXG4gICAqL1xuICBASW5wdXQoKSBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB3ZWVrIHZpZXcgZXZlbnRzXG4gICAqL1xuICBASW5wdXQoKSBldmVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IHRpdGxlc1xuICAgKi9cbiAgQElucHV0KCkgZXZlbnRUaXRsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIGV2ZW50IGFjdGlvbnNcbiAgICovXG4gIEBJbnB1dCgpIGV2ZW50QWN0aW9uc1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlY2lzaW9uIHRvIGRpc3BsYXkgZXZlbnRzLlxuICAgKiBgZGF5c2Agd2lsbCByb3VuZCBldmVudCBzdGFydCBhbmQgZW5kIGRhdGVzIHRvIHRoZSBuZWFyZXN0IGRheSBhbmQgYG1pbnV0ZXNgIHdpbGwgbm90IGRvIHRoaXMgcm91bmRpbmdcbiAgICovXG4gIEBJbnB1dCgpIHByZWNpc2lvbjogJ2RheXMnIHwgJ21pbnV0ZXMnID0gJ2RheXMnO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBkYXkgaW5kZXhlcyAoMCA9IHN1bmRheSwgMSA9IG1vbmRheSBldGMpIHRoYXQgaW5kaWNhdGUgd2hpY2ggZGF5cyBhcmUgd2Vla2VuZHNcbiAgICovXG4gIEBJbnB1dCgpIHdlZWtlbmREYXlzOiBudW1iZXJbXTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBzbmFwIGV2ZW50cyB0byBhIGdyaWQgd2hlbiBkcmFnZ2luZ1xuICAgKi9cbiAgQElucHV0KCkgc25hcERyYWdnZWRFdmVudHM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHNlZ21lbnRzIGluIGFuIGhvdXIuIE11c3QgZGl2aWRlIGVxdWFsbHkgaW50byA2MC5cbiAgICovXG4gIEBJbnB1dCgpIGhvdXJTZWdtZW50czogbnVtYmVyID0gMjtcblxuICAvKipcbiAgICogVGhlIGR1cmF0aW9uIG9mIGVhY2ggc2VnbWVudCBncm91cCBpbiBtaW51dGVzXG4gICAqL1xuICBASW5wdXQoKSBob3VyRHVyYXRpb246IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGhlaWdodCBpbiBwaXhlbHMgb2YgZWFjaCBob3VyIHNlZ21lbnRcbiAgICovXG4gIEBJbnB1dCgpIGhvdXJTZWdtZW50SGVpZ2h0OiBudW1iZXIgPSAzMDtcblxuICAvKipcbiAgICogVGhlIG1pbmltdW0gaGVpZ2h0IGluIHBpeGVscyBvZiBlYWNoIGV2ZW50XG4gICAqL1xuICBASW5wdXQoKSBtaW5pbXVtRXZlbnRIZWlnaHQ6IG51bWJlciA9IDMwO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IHN0YXJ0IGhvdXJzIGluIDI0IGhvdXIgdGltZS4gTXVzdCBiZSAwLTIzXG4gICAqL1xuICBASW5wdXQoKSBkYXlTdGFydEhvdXI6IG51bWJlciA9IDA7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgc3RhcnQgbWludXRlcy4gTXVzdCBiZSAwLTU5XG4gICAqL1xuICBASW5wdXQoKSBkYXlTdGFydE1pbnV0ZTogbnVtYmVyID0gMDtcblxuICAvKipcbiAgICogVGhlIGRheSBlbmQgaG91cnMgaW4gMjQgaG91ciB0aW1lLiBNdXN0IGJlIDAtMjNcbiAgICovXG4gIEBJbnB1dCgpIGRheUVuZEhvdXI6IG51bWJlciA9IDIzO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IGVuZCBtaW51dGVzLiBNdXN0IGJlIDAtNTlcbiAgICovXG4gIEBJbnB1dCgpIGRheUVuZE1pbnV0ZTogbnVtYmVyID0gNTk7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIHRlbXBsYXRlIHRvIHVzZSB0byByZXBsYWNlIHRoZSBob3VyIHNlZ21lbnRcbiAgICovXG4gIEBJbnB1dCgpIGhvdXJTZWdtZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFRoZSBncmlkIHNpemUgdG8gc25hcCByZXNpemluZyBhbmQgZHJhZ2dpbmcgb2YgaG91cmx5IGV2ZW50cyB0b1xuICAgKi9cbiAgQElucHV0KCkgZXZlbnRTbmFwU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSB0ZW1wbGF0ZSB0byB1c2UgZm9yIHRoZSBhbGwgZGF5IGV2ZW50cyBsYWJlbCB0ZXh0XG4gICAqL1xuICBASW5wdXQoKSBhbGxEYXlFdmVudHNMYWJlbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGRheXMgaW4gYSB3ZWVrLiBDYW4gYmUgdXNlZCB0byBjcmVhdGUgYSBzaG9ydGVyIG9yIGxvbmdlciB3ZWVrIHZpZXcuXG4gICAqIFRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsgd2lsbCBhbHdheXMgYmUgdGhlIGB2aWV3RGF0ZWAgYW5kIGB3ZWVrU3RhcnRzT25gIGlmIHNldCB3aWxsIGJlIGlnbm9yZWRcbiAgICovXG4gIEBJbnB1dCgpIGRheXNJbldlZWs6IG51bWJlcjtcblxuICAvKipcbiAgICogQSBjdXN0b20gdGVtcGxhdGUgdG8gdXNlIGZvciB0aGUgY3VycmVudCB0aW1lIG1hcmtlclxuICAgKi9cbiAgQElucHV0KCkgY3VycmVudFRpbWVNYXJrZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKipcbiAgICogQWxsb3cgeW91IHRvIGN1c3RvbWlzZSB3aGVyZSBldmVudHMgY2FuIGJlIGRyYWdnZWQgYW5kIHJlc2l6ZWQgdG8uXG4gICAqIFJldHVybiB0cnVlIHRvIGFsbG93IGRyYWdnaW5nIGFuZCByZXNpemluZyB0byB0aGUgbmV3IGxvY2F0aW9uLCBvciBmYWxzZSB0byBwcmV2ZW50IGl0XG4gICAqL1xuICBASW5wdXQoKSB2YWxpZGF0ZUV2ZW50VGltZXNDaGFuZ2VkOiAoXG4gICAgZXZlbnQ6IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFxuICApID0+IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGEgaGVhZGVyIHdlZWsgZGF5IGlzIGNsaWNrZWQuIEFkZGluZyBhIGBjc3NDbGFzc2AgcHJvcGVydHkgb24gYCRldmVudC5kYXlgIHdpbGwgYWRkIHRoYXQgY2xhc3MgdG8gdGhlIGhlYWRlciBlbGVtZW50XG4gICAqL1xuICBAT3V0cHV0KCkgZGF5SGVhZGVyQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8e1xuICAgIGRheTogV2Vla0RheTtcbiAgICBzb3VyY2VFdmVudDogTW91c2VFdmVudDtcbiAgfT4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYW4gZXZlbnQgdGl0bGUgaXMgY2xpY2tlZFxuICAgKi9cbiAgQE91dHB1dCgpIGV2ZW50Q2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXI8e1xuICAgIGV2ZW50OiBDYWxlbmRhckV2ZW50O1xuICAgIHNvdXJjZUV2ZW50OiBNb3VzZUV2ZW50IHwgS2V5Ym9hcmRFdmVudDtcbiAgfT4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYW4gZXZlbnQgaXMgcmVzaXplZCBvciBkcmFnZ2VkIGFuZCBkcm9wcGVkXG4gICAqL1xuICBAT3V0cHV0KCkgZXZlbnRUaW1lc0NoYW5nZWQgPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8Q2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBBbiBvdXRwdXQgdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHZpZXcgaXMgcmVuZGVyZWQgZm9yIHRoZSBjdXJyZW50IHdlZWsuXG4gICAqIElmIHlvdSBhZGQgdGhlIGBjc3NDbGFzc2AgcHJvcGVydHkgdG8gYSBkYXkgaW4gdGhlIGhlYWRlciBpdCB3aWxsIGFkZCB0aGF0IGNsYXNzIHRvIHRoZSBjZWxsIGVsZW1lbnQgaW4gdGhlIHRlbXBsYXRlXG4gICAqL1xuICBAT3V0cHV0KCkgYmVmb3JlVmlld1JlbmRlciA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxDYWxlbmRhcldlZWtWaWV3QmVmb3JlUmVuZGVyRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGFuIGhvdXIgc2VnbWVudCBpcyBjbGlja2VkXG4gICAqL1xuICBAT3V0cHV0KCkgaG91clNlZ21lbnRDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgZGF0ZTogRGF0ZTtcbiAgICBzb3VyY2VFdmVudDogTW91c2VFdmVudDtcbiAgfT4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZGF5czogV2Vla0RheVtdO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB2aWV3OiBXZWVrVmlldztcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcmVmcmVzaFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBhbGxEYXlFdmVudFJlc2l6ZXM6IE1hcDxXZWVrVmlld0FsbERheUV2ZW50LCBXZWVrVmlld0FsbERheUV2ZW50UmVzaXplPiA9XG4gICAgbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0aW1lRXZlbnRSZXNpemVzOiBNYXA8Q2FsZW5kYXJFdmVudCwgUmVzaXplRXZlbnQ+ID0gbmV3IE1hcCgpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBldmVudERyYWdFbnRlckJ5VHlwZSA9IHtcbiAgICBhbGxEYXk6IDAsXG4gICAgdGltZTogMCxcbiAgfTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZHJhZ0FjdGl2ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkcmFnQWxyZWFkeU1vdmVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHZhbGlkYXRlRHJhZzogVmFsaWRhdGVEcmFnO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB2YWxpZGF0ZVJlc2l6ZTogKGFyZ3M6IGFueSkgPT4gYm9vbGVhbjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZGF5Q29sdW1uV2lkdGg6IG51bWJlcjtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY2FsZW5kYXJJZCA9IFN5bWJvbCgnYW5ndWxhciBjYWxlbmRhciB3ZWVrIHZpZXcgaWQnKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbGFzdERyYWdnZWRFdmVudDogQ2FsZW5kYXJFdmVudDtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcnRsID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZSA9IHRyYWNrQnlXZWVrRGF5SGVhZGVyRGF0ZTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeUhvdXJTZWdtZW50ID0gdHJhY2tCeUhvdXJTZWdtZW50O1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5SG91ciA9IHRyYWNrQnlIb3VyO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5V2Vla0FsbERheUV2ZW50ID0gdHJhY2tCeVdlZWtBbGxEYXlFdmVudDtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdHJhY2tCeVdlZWtUaW1lRXZlbnQgPSB0cmFja0J5V2Vla1RpbWVFdmVudDtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcHJpdmF0ZSBsYXN0RHJhZ0VudGVyRGF0ZTogRGF0ZTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJvdGVjdGVkIHV0aWxzOiBDYWxlbmRhclV0aWxzLFxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBsb2NhbGU6IHN0cmluZyxcbiAgICBwcm90ZWN0ZWQgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyLFxuICAgIHByb3RlY3RlZCBlbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PlxuICApIHtcbiAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5SG91ckNvbHVtbiA9IChpbmRleDogbnVtYmVyLCBjb2x1bW46IFdlZWtWaWV3SG91ckNvbHVtbikgPT5cbiAgICBjb2x1bW4uaG91cnNbMF0gPyBjb2x1bW4uaG91cnNbMF0uc2VnbWVudHNbMF0uZGF0ZS50b0lTT1N0cmluZygpIDogY29sdW1uO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0cmFja0J5SWQgPSAoaW5kZXg6IG51bWJlciwgcm93OiBXZWVrVmlld0FsbERheUV2ZW50Um93KSA9PiByb3cuaWQ7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlZnJlc2gpIHtcbiAgICAgIHRoaXMucmVmcmVzaFN1YnNjcmlwdGlvbiA9IHRoaXMucmVmcmVzaC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZnJlc2hBbGwoKTtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogYW55KTogdm9pZCB7XG4gICAgY29uc3QgcmVmcmVzaEhlYWRlciA9XG4gICAgICBjaGFuZ2VzLnZpZXdEYXRlIHx8XG4gICAgICBjaGFuZ2VzLmV4Y2x1ZGVEYXlzIHx8XG4gICAgICBjaGFuZ2VzLndlZWtlbmREYXlzIHx8XG4gICAgICBjaGFuZ2VzLmRheXNJbldlZWsgfHxcbiAgICAgIGNoYW5nZXMud2Vla1N0YXJ0c09uO1xuXG4gICAgY29uc3QgcmVmcmVzaEJvZHkgPVxuICAgICAgY2hhbmdlcy52aWV3RGF0ZSB8fFxuICAgICAgY2hhbmdlcy5kYXlTdGFydEhvdXIgfHxcbiAgICAgIGNoYW5nZXMuZGF5U3RhcnRNaW51dGUgfHxcbiAgICAgIGNoYW5nZXMuZGF5RW5kSG91ciB8fFxuICAgICAgY2hhbmdlcy5kYXlFbmRNaW51dGUgfHxcbiAgICAgIGNoYW5nZXMuaG91clNlZ21lbnRzIHx8XG4gICAgICBjaGFuZ2VzLmhvdXJEdXJhdGlvbiB8fFxuICAgICAgY2hhbmdlcy53ZWVrU3RhcnRzT24gfHxcbiAgICAgIGNoYW5nZXMud2Vla2VuZERheXMgfHxcbiAgICAgIGNoYW5nZXMuZXhjbHVkZURheXMgfHxcbiAgICAgIGNoYW5nZXMuaG91clNlZ21lbnRIZWlnaHQgfHxcbiAgICAgIGNoYW5nZXMuZXZlbnRzIHx8XG4gICAgICBjaGFuZ2VzLmRheXNJbldlZWsgfHxcbiAgICAgIGNoYW5nZXMubWluaW11bUV2ZW50SGVpZ2h0O1xuXG4gICAgaWYgKHJlZnJlc2hIZWFkZXIpIHtcbiAgICAgIHRoaXMucmVmcmVzaEhlYWRlcigpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmV2ZW50cykge1xuICAgICAgdmFsaWRhdGVFdmVudHModGhpcy5ldmVudHMpO1xuICAgIH1cblxuICAgIGlmIChyZWZyZXNoQm9keSkge1xuICAgICAgdGhpcy5yZWZyZXNoQm9keSgpO1xuICAgIH1cblxuICAgIGlmIChyZWZyZXNoSGVhZGVyIHx8IHJlZnJlc2hCb2R5KSB7XG4gICAgICB0aGlzLmVtaXRCZWZvcmVWaWV3UmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlZnJlc2hTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVmcmVzaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5ydGwgPVxuICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIGdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpLmRpcmVjdGlvbiA9PT0gJ3J0bCc7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHRpbWVFdmVudFJlc2l6ZVN0YXJ0ZWQoXG4gICAgZXZlbnRzQ29udGFpbmVyOiBIVE1MRWxlbWVudCxcbiAgICB0aW1lRXZlbnQ6IFdlZWtWaWV3VGltZUV2ZW50LFxuICAgIHJlc2l6ZUV2ZW50OiBSZXNpemVFdmVudFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnRpbWVFdmVudFJlc2l6ZXMuc2V0KHRpbWVFdmVudC5ldmVudCwgcmVzaXplRXZlbnQpO1xuICAgIHRoaXMucmVzaXplU3RhcnRlZChldmVudHNDb250YWluZXIsIHRpbWVFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgdGltZUV2ZW50UmVzaXppbmcodGltZUV2ZW50OiBXZWVrVmlld1RpbWVFdmVudCwgcmVzaXplRXZlbnQ6IFJlc2l6ZUV2ZW50KSB7XG4gICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLnNldCh0aW1lRXZlbnQuZXZlbnQsIHJlc2l6ZUV2ZW50KTtcbiAgICBjb25zdCBhZGp1c3RlZEV2ZW50cyA9IG5ldyBNYXA8Q2FsZW5kYXJFdmVudCwgQ2FsZW5kYXJFdmVudD4oKTtcblxuICAgIGNvbnN0IHRlbXBFdmVudHMgPSBbLi4udGhpcy5ldmVudHNdO1xuXG4gICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLmZvckVhY2goKGxhc3RSZXNpemVFdmVudCwgZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG5ld0V2ZW50RGF0ZXMgPSB0aGlzLmdldFRpbWVFdmVudFJlc2l6ZWREYXRlcyhcbiAgICAgICAgZXZlbnQsXG4gICAgICAgIGxhc3RSZXNpemVFdmVudFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGFkanVzdGVkRXZlbnQgPSB7IC4uLmV2ZW50LCAuLi5uZXdFdmVudERhdGVzIH07XG4gICAgICBhZGp1c3RlZEV2ZW50cy5zZXQoYWRqdXN0ZWRFdmVudCwgZXZlbnQpO1xuICAgICAgY29uc3QgZXZlbnRJbmRleCA9IHRlbXBFdmVudHMuaW5kZXhPZihldmVudCk7XG4gICAgICB0ZW1wRXZlbnRzW2V2ZW50SW5kZXhdID0gYWRqdXN0ZWRFdmVudDtcbiAgICB9KTtcblxuICAgIHRoaXMucmVzdG9yZU9yaWdpbmFsRXZlbnRzKHRlbXBFdmVudHMsIGFkanVzdGVkRXZlbnRzLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICB0aW1lRXZlbnRSZXNpemVFbmRlZCh0aW1lRXZlbnQ6IFdlZWtWaWV3VGltZUV2ZW50KSB7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5nZXRXZWVrVmlldyh0aGlzLmV2ZW50cyk7XG4gICAgY29uc3QgbGFzdFJlc2l6ZUV2ZW50ID0gdGhpcy50aW1lRXZlbnRSZXNpemVzLmdldCh0aW1lRXZlbnQuZXZlbnQpO1xuICAgIGlmIChsYXN0UmVzaXplRXZlbnQpIHtcbiAgICAgIHRoaXMudGltZUV2ZW50UmVzaXplcy5kZWxldGUodGltZUV2ZW50LmV2ZW50KTtcbiAgICAgIGNvbnN0IG5ld0V2ZW50RGF0ZXMgPSB0aGlzLmdldFRpbWVFdmVudFJlc2l6ZWREYXRlcyhcbiAgICAgICAgdGltZUV2ZW50LmV2ZW50LFxuICAgICAgICBsYXN0UmVzaXplRXZlbnRcbiAgICAgICk7XG4gICAgICB0aGlzLmV2ZW50VGltZXNDaGFuZ2VkLmVtaXQoe1xuICAgICAgICBuZXdTdGFydDogbmV3RXZlbnREYXRlcy5zdGFydCxcbiAgICAgICAgbmV3RW5kOiBuZXdFdmVudERhdGVzLmVuZCxcbiAgICAgICAgZXZlbnQ6IHRpbWVFdmVudC5ldmVudCxcbiAgICAgICAgdHlwZTogQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50VHlwZS5SZXNpemUsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgYWxsRGF5RXZlbnRSZXNpemVTdGFydGVkKFxuICAgIGFsbERheUV2ZW50c0NvbnRhaW5lcjogSFRNTEVsZW1lbnQsXG4gICAgYWxsRGF5RXZlbnQ6IFdlZWtWaWV3QWxsRGF5RXZlbnQsXG4gICAgcmVzaXplRXZlbnQ6IFJlc2l6ZUV2ZW50XG4gICk6IHZvaWQge1xuICAgIHRoaXMuYWxsRGF5RXZlbnRSZXNpemVzLnNldChhbGxEYXlFdmVudCwge1xuICAgICAgb3JpZ2luYWxPZmZzZXQ6IGFsbERheUV2ZW50Lm9mZnNldCxcbiAgICAgIG9yaWdpbmFsU3BhbjogYWxsRGF5RXZlbnQuc3BhbixcbiAgICAgIGVkZ2U6IHR5cGVvZiByZXNpemVFdmVudC5lZGdlcy5sZWZ0ICE9PSAndW5kZWZpbmVkJyA/ICdsZWZ0JyA6ICdyaWdodCcsXG4gICAgfSk7XG4gICAgdGhpcy5yZXNpemVTdGFydGVkKFxuICAgICAgYWxsRGF5RXZlbnRzQ29udGFpbmVyLFxuICAgICAgYWxsRGF5RXZlbnQsXG4gICAgICB0aGlzLmdldERheUNvbHVtbldpZHRoKGFsbERheUV2ZW50c0NvbnRhaW5lcilcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGFsbERheUV2ZW50UmVzaXppbmcoXG4gICAgYWxsRGF5RXZlbnQ6IFdlZWtWaWV3QWxsRGF5RXZlbnQsXG4gICAgcmVzaXplRXZlbnQ6IFJlc2l6ZUV2ZW50LFxuICAgIGRheVdpZHRoOiBudW1iZXJcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY3VycmVudFJlc2l6ZTogV2Vla1ZpZXdBbGxEYXlFdmVudFJlc2l6ZSA9XG4gICAgICB0aGlzLmFsbERheUV2ZW50UmVzaXplcy5nZXQoYWxsRGF5RXZlbnQpO1xuXG4gICAgY29uc3QgbW9kaWZpZXIgPSB0aGlzLnJ0bCA/IC0xIDogMTtcbiAgICBpZiAodHlwZW9mIHJlc2l6ZUV2ZW50LmVkZ2VzLmxlZnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkaWZmOiBudW1iZXIgPVxuICAgICAgICBNYXRoLnJvdW5kKCtyZXNpemVFdmVudC5lZGdlcy5sZWZ0IC8gZGF5V2lkdGgpICogbW9kaWZpZXI7XG4gICAgICBhbGxEYXlFdmVudC5vZmZzZXQgPSBjdXJyZW50UmVzaXplLm9yaWdpbmFsT2Zmc2V0ICsgZGlmZjtcbiAgICAgIGFsbERheUV2ZW50LnNwYW4gPSBjdXJyZW50UmVzaXplLm9yaWdpbmFsU3BhbiAtIGRpZmY7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzaXplRXZlbnQuZWRnZXMucmlnaHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkaWZmOiBudW1iZXIgPVxuICAgICAgICBNYXRoLnJvdW5kKCtyZXNpemVFdmVudC5lZGdlcy5yaWdodCAvIGRheVdpZHRoKSAqIG1vZGlmaWVyO1xuICAgICAgYWxsRGF5RXZlbnQuc3BhbiA9IGN1cnJlbnRSZXNpemUub3JpZ2luYWxTcGFuICsgZGlmZjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgYWxsRGF5RXZlbnRSZXNpemVFbmRlZChhbGxEYXlFdmVudDogV2Vla1ZpZXdBbGxEYXlFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRSZXNpemU6IFdlZWtWaWV3QWxsRGF5RXZlbnRSZXNpemUgPVxuICAgICAgdGhpcy5hbGxEYXlFdmVudFJlc2l6ZXMuZ2V0KGFsbERheUV2ZW50KTtcblxuICAgIGlmIChjdXJyZW50UmVzaXplKSB7XG4gICAgICBjb25zdCBhbGxEYXlFdmVudFJlc2l6aW5nQmVmb3JlU3RhcnQgPSBjdXJyZW50UmVzaXplLmVkZ2UgPT09ICdsZWZ0JztcbiAgICAgIGxldCBkYXlzRGlmZjogbnVtYmVyO1xuICAgICAgaWYgKGFsbERheUV2ZW50UmVzaXppbmdCZWZvcmVTdGFydCkge1xuICAgICAgICBkYXlzRGlmZiA9IGFsbERheUV2ZW50Lm9mZnNldCAtIGN1cnJlbnRSZXNpemUub3JpZ2luYWxPZmZzZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYXlzRGlmZiA9IGFsbERheUV2ZW50LnNwYW4gLSBjdXJyZW50UmVzaXplLm9yaWdpbmFsU3BhbjtcbiAgICAgIH1cblxuICAgICAgYWxsRGF5RXZlbnQub2Zmc2V0ID0gY3VycmVudFJlc2l6ZS5vcmlnaW5hbE9mZnNldDtcbiAgICAgIGFsbERheUV2ZW50LnNwYW4gPSBjdXJyZW50UmVzaXplLm9yaWdpbmFsU3BhbjtcblxuICAgICAgY29uc3QgbmV3RGF0ZXMgPSB0aGlzLmdldEFsbERheUV2ZW50UmVzaXplZERhdGVzKFxuICAgICAgICBhbGxEYXlFdmVudC5ldmVudCxcbiAgICAgICAgZGF5c0RpZmYsXG4gICAgICAgIGFsbERheUV2ZW50UmVzaXppbmdCZWZvcmVTdGFydFxuICAgICAgKTtcblxuICAgICAgdGhpcy5ldmVudFRpbWVzQ2hhbmdlZC5lbWl0KHtcbiAgICAgICAgbmV3U3RhcnQ6IG5ld0RhdGVzLnN0YXJ0LFxuICAgICAgICBuZXdFbmQ6IG5ld0RhdGVzLmVuZCxcbiAgICAgICAgZXZlbnQ6IGFsbERheUV2ZW50LmV2ZW50LFxuICAgICAgICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLlJlc2l6ZSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5hbGxEYXlFdmVudFJlc2l6ZXMuZGVsZXRlKGFsbERheUV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZ2V0RGF5Q29sdW1uV2lkdGgoZXZlbnRSb3dDb250YWluZXI6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihldmVudFJvd0NvbnRhaW5lci5vZmZzZXRXaWR0aCAvIHRoaXMuZGF5cy5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGRhdGVEcmFnRW50ZXIoZGF0ZTogRGF0ZSkge1xuICAgIHRoaXMubGFzdERyYWdFbnRlckRhdGUgPSBkYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGV2ZW50RHJvcHBlZChcbiAgICBkcm9wRXZlbnQ6IERyb3BFdmVudDx7IGV2ZW50PzogQ2FsZW5kYXJFdmVudDsgY2FsZW5kYXJJZD86IHN5bWJvbCB9PixcbiAgICBkYXRlOiBEYXRlLFxuICAgIGFsbERheTogYm9vbGVhblxuICApOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBzaG91bGRGaXJlRHJvcHBlZEV2ZW50KGRyb3BFdmVudCwgZGF0ZSwgYWxsRGF5LCB0aGlzLmNhbGVuZGFySWQpICYmXG4gICAgICB0aGlzLmxhc3REcmFnRW50ZXJEYXRlLmdldFRpbWUoKSA9PT0gZGF0ZS5nZXRUaW1lKCkgJiZcbiAgICAgICghdGhpcy5zbmFwRHJhZ2dlZEV2ZW50cyB8fFxuICAgICAgICBkcm9wRXZlbnQuZHJvcERhdGEuZXZlbnQgIT09IHRoaXMubGFzdERyYWdnZWRFdmVudClcbiAgICApIHtcbiAgICAgIHRoaXMuZXZlbnRUaW1lc0NoYW5nZWQuZW1pdCh7XG4gICAgICAgIHR5cGU6IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGUuRHJvcCxcbiAgICAgICAgZXZlbnQ6IGRyb3BFdmVudC5kcm9wRGF0YS5ldmVudCxcbiAgICAgICAgbmV3U3RhcnQ6IGRhdGUsXG4gICAgICAgIGFsbERheSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmxhc3REcmFnZ2VkRXZlbnQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGRyYWdFbnRlcih0eXBlOiAnYWxsRGF5JyB8ICd0aW1lJykge1xuICAgIHRoaXMuZXZlbnREcmFnRW50ZXJCeVR5cGVbdHlwZV0rKztcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkcmFnTGVhdmUodHlwZTogJ2FsbERheScgfCAndGltZScpIHtcbiAgICB0aGlzLmV2ZW50RHJhZ0VudGVyQnlUeXBlW3R5cGVdLS07XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgZHJhZ1N0YXJ0ZWQoXG4gICAgZXZlbnRzQ29udGFpbmVyRWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgZXZlbnRFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBldmVudDogV2Vla1ZpZXdUaW1lRXZlbnQgfCBXZWVrVmlld0FsbERheUV2ZW50LFxuICAgIHVzZVk6IGJvb2xlYW5cbiAgKTogdm9pZCB7XG4gICAgdGhpcy5kYXlDb2x1bW5XaWR0aCA9IHRoaXMuZ2V0RGF5Q29sdW1uV2lkdGgoZXZlbnRzQ29udGFpbmVyRWxlbWVudCk7XG4gICAgY29uc3QgZHJhZ0hlbHBlcjogQ2FsZW5kYXJEcmFnSGVscGVyID0gbmV3IENhbGVuZGFyRHJhZ0hlbHBlcihcbiAgICAgIGV2ZW50c0NvbnRhaW5lckVsZW1lbnQsXG4gICAgICBldmVudEVsZW1lbnRcbiAgICApO1xuICAgIHRoaXMudmFsaWRhdGVEcmFnID0gKHsgeCwgeSwgdHJhbnNmb3JtIH0pID0+IHtcbiAgICAgIGNvbnN0IGlzQWxsb3dlZCA9XG4gICAgICAgIHRoaXMuYWxsRGF5RXZlbnRSZXNpemVzLnNpemUgPT09IDAgJiZcbiAgICAgICAgdGhpcy50aW1lRXZlbnRSZXNpemVzLnNpemUgPT09IDAgJiZcbiAgICAgICAgZHJhZ0hlbHBlci52YWxpZGF0ZURyYWcoe1xuICAgICAgICAgIHgsXG4gICAgICAgICAgeSxcbiAgICAgICAgICBzbmFwRHJhZ2dlZEV2ZW50czogdGhpcy5zbmFwRHJhZ2dlZEV2ZW50cyxcbiAgICAgICAgICBkcmFnQWxyZWFkeU1vdmVkOiB0aGlzLmRyYWdBbHJlYWR5TW92ZWQsXG4gICAgICAgICAgdHJhbnNmb3JtLFxuICAgICAgICB9KTtcbiAgICAgIGlmIChpc0FsbG93ZWQgJiYgdGhpcy52YWxpZGF0ZUV2ZW50VGltZXNDaGFuZ2VkKSB7XG4gICAgICAgIGNvbnN0IG5ld0V2ZW50VGltZXMgPSB0aGlzLmdldERyYWdNb3ZlZEV2ZW50VGltZXMoXG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgeyB4LCB5IH0sXG4gICAgICAgICAgdGhpcy5kYXlDb2x1bW5XaWR0aCxcbiAgICAgICAgICB1c2VZXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbGlkYXRlRXZlbnRUaW1lc0NoYW5nZWQoe1xuICAgICAgICAgIHR5cGU6IENhbGVuZGFyRXZlbnRUaW1lc0NoYW5nZWRFdmVudFR5cGUuRHJhZyxcbiAgICAgICAgICBldmVudDogZXZlbnQuZXZlbnQsXG4gICAgICAgICAgbmV3U3RhcnQ6IG5ld0V2ZW50VGltZXMuc3RhcnQsXG4gICAgICAgICAgbmV3RW5kOiBuZXdFdmVudFRpbWVzLmVuZCxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc0FsbG93ZWQ7XG4gICAgfTtcbiAgICB0aGlzLmRyYWdBY3RpdmUgPSB0cnVlO1xuICAgIHRoaXMuZHJhZ0FscmVhZHlNb3ZlZCA9IGZhbHNlO1xuICAgIHRoaXMubGFzdERyYWdnZWRFdmVudCA9IG51bGw7XG4gICAgdGhpcy5ldmVudERyYWdFbnRlckJ5VHlwZSA9IHtcbiAgICAgIGFsbERheTogMCxcbiAgICAgIHRpbWU6IDAsXG4gICAgfTtcbiAgICBpZiAoIXRoaXMuc25hcERyYWdnZWRFdmVudHMgJiYgdXNlWSkge1xuICAgICAgdGhpcy52aWV3LmhvdXJDb2x1bW5zLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgICBjb25zdCBsaW5rZWRFdmVudCA9IGNvbHVtbi5ldmVudHMuZmluZChcbiAgICAgICAgICAoY29sdW1uRXZlbnQpID0+XG4gICAgICAgICAgICBjb2x1bW5FdmVudC5ldmVudCA9PT0gZXZlbnQuZXZlbnQgJiYgY29sdW1uRXZlbnQgIT09IGV2ZW50XG4gICAgICAgICk7XG4gICAgICAgIC8vIGhpZGUgYW55IGxpbmtlZCBldmVudHMgd2hpbGUgZHJhZ2dpbmdcbiAgICAgICAgaWYgKGxpbmtlZEV2ZW50KSB7XG4gICAgICAgICAgbGlua2VkRXZlbnQud2lkdGggPSAwO1xuICAgICAgICAgIGxpbmtlZEV2ZW50LmhlaWdodCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkcmFnTW92ZShkYXlFdmVudDogV2Vla1ZpZXdUaW1lRXZlbnQsIGRyYWdFdmVudDogRHJhZ01vdmVFdmVudCkge1xuICAgIGNvbnN0IG5ld0V2ZW50VGltZXMgPSB0aGlzLmdldERyYWdNb3ZlZEV2ZW50VGltZXMoXG4gICAgICBkYXlFdmVudCxcbiAgICAgIGRyYWdFdmVudCxcbiAgICAgIHRoaXMuZGF5Q29sdW1uV2lkdGgsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICBjb25zdCBvcmlnaW5hbEV2ZW50ID0gZGF5RXZlbnQuZXZlbnQ7XG4gICAgY29uc3QgYWRqdXN0ZWRFdmVudCA9IHsgLi4ub3JpZ2luYWxFdmVudCwgLi4ubmV3RXZlbnRUaW1lcyB9O1xuICAgIGNvbnN0IHRlbXBFdmVudHMgPSB0aGlzLmV2ZW50cy5tYXAoKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQgPT09IG9yaWdpbmFsRXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIGFkanVzdGVkRXZlbnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXZlbnQ7XG4gICAgfSk7XG4gICAgdGhpcy5yZXN0b3JlT3JpZ2luYWxFdmVudHMoXG4gICAgICB0ZW1wRXZlbnRzLFxuICAgICAgbmV3IE1hcChbW2FkanVzdGVkRXZlbnQsIG9yaWdpbmFsRXZlbnRdXSksXG4gICAgICB0aGlzLnNuYXBEcmFnZ2VkRXZlbnRzXG4gICAgKTtcbiAgICB0aGlzLmRyYWdBbHJlYWR5TW92ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGFsbERheUV2ZW50RHJhZ01vdmUoKSB7XG4gICAgdGhpcy5kcmFnQWxyZWFkeU1vdmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBkcmFnRW5kZWQoXG4gICAgd2Vla0V2ZW50OiBXZWVrVmlld0FsbERheUV2ZW50IHwgV2Vla1ZpZXdUaW1lRXZlbnQsXG4gICAgZHJhZ0VuZEV2ZW50OiBEcmFnRW5kRXZlbnQsXG4gICAgZGF5V2lkdGg6IG51bWJlcixcbiAgICB1c2VZID0gZmFsc2VcbiAgKTogdm9pZCB7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5nZXRXZWVrVmlldyh0aGlzLmV2ZW50cyk7XG4gICAgdGhpcy5kcmFnQWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy52YWxpZGF0ZURyYWcgPSBudWxsO1xuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gdGhpcy5nZXREcmFnTW92ZWRFdmVudFRpbWVzKFxuICAgICAgd2Vla0V2ZW50LFxuICAgICAgZHJhZ0VuZEV2ZW50LFxuICAgICAgZGF5V2lkdGgsXG4gICAgICB1c2VZXG4gICAgKTtcbiAgICBpZiAoXG4gICAgICAodGhpcy5zbmFwRHJhZ2dlZEV2ZW50cyB8fFxuICAgICAgICB0aGlzLmV2ZW50RHJhZ0VudGVyQnlUeXBlW3VzZVkgPyAndGltZScgOiAnYWxsRGF5J10gPiAwKSAmJlxuICAgICAgaXNEcmFnZ2VkV2l0aGluUGVyaW9kKHN0YXJ0LCBlbmQsIHRoaXMudmlldy5wZXJpb2QpXG4gICAgKSB7XG4gICAgICB0aGlzLmxhc3REcmFnZ2VkRXZlbnQgPSB3ZWVrRXZlbnQuZXZlbnQ7XG4gICAgICB0aGlzLmV2ZW50VGltZXNDaGFuZ2VkLmVtaXQoe1xuICAgICAgICBuZXdTdGFydDogc3RhcnQsXG4gICAgICAgIG5ld0VuZDogZW5kLFxuICAgICAgICBldmVudDogd2Vla0V2ZW50LmV2ZW50LFxuICAgICAgICB0eXBlOiBDYWxlbmRhckV2ZW50VGltZXNDaGFuZ2VkRXZlbnRUeXBlLkRyYWcsXG4gICAgICAgIGFsbERheTogIXVzZVksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVmcmVzaEhlYWRlcigpOiB2b2lkIHtcbiAgICB0aGlzLmRheXMgPSB0aGlzLnV0aWxzLmdldFdlZWtWaWV3SGVhZGVyKHtcbiAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxuICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzLFxuICAgICAgd2Vla2VuZERheXM6IHRoaXMud2Vla2VuZERheXMsXG4gICAgICAuLi5nZXRXZWVrVmlld1BlcmlvZChcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgdGhpcy52aWV3RGF0ZSxcbiAgICAgICAgdGhpcy53ZWVrU3RhcnRzT24sXG4gICAgICAgIHRoaXMuZXhjbHVkZURheXMsXG4gICAgICAgIHRoaXMuZGF5c0luV2Vla1xuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWZyZXNoQm9keSgpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmdldFdlZWtWaWV3KHRoaXMuZXZlbnRzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWZyZXNoQWxsKCk6IHZvaWQge1xuICAgIHRoaXMucmVmcmVzaEhlYWRlcigpO1xuICAgIHRoaXMucmVmcmVzaEJvZHkoKTtcbiAgICB0aGlzLmVtaXRCZWZvcmVWaWV3UmVuZGVyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZW1pdEJlZm9yZVZpZXdSZW5kZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF5cyAmJiB0aGlzLnZpZXcpIHtcbiAgICAgIHRoaXMuYmVmb3JlVmlld1JlbmRlci5lbWl0KHtcbiAgICAgICAgaGVhZGVyOiB0aGlzLmRheXMsXG4gICAgICAgIC4uLnRoaXMudmlldyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRXZWVrVmlldyhldmVudHM6IENhbGVuZGFyRXZlbnRbXSkge1xuICAgIHJldHVybiB0aGlzLnV0aWxzLmdldFdlZWtWaWV3KHtcbiAgICAgIGV2ZW50cyxcbiAgICAgIHZpZXdEYXRlOiB0aGlzLnZpZXdEYXRlLFxuICAgICAgd2Vla1N0YXJ0c09uOiB0aGlzLndlZWtTdGFydHNPbixcbiAgICAgIGV4Y2x1ZGVkOiB0aGlzLmV4Y2x1ZGVEYXlzLFxuICAgICAgcHJlY2lzaW9uOiB0aGlzLnByZWNpc2lvbixcbiAgICAgIGFic29sdXRlUG9zaXRpb25lZEV2ZW50czogdHJ1ZSxcbiAgICAgIGhvdXJTZWdtZW50czogdGhpcy5ob3VyU2VnbWVudHMsXG4gICAgICBob3VyRHVyYXRpb246IHRoaXMuaG91ckR1cmF0aW9uLFxuICAgICAgZGF5U3RhcnQ6IHtcbiAgICAgICAgaG91cjogdGhpcy5kYXlTdGFydEhvdXIsXG4gICAgICAgIG1pbnV0ZTogdGhpcy5kYXlTdGFydE1pbnV0ZSxcbiAgICAgIH0sXG4gICAgICBkYXlFbmQ6IHtcbiAgICAgICAgaG91cjogdGhpcy5kYXlFbmRIb3VyLFxuICAgICAgICBtaW51dGU6IHRoaXMuZGF5RW5kTWludXRlLFxuICAgICAgfSxcbiAgICAgIHNlZ21lbnRIZWlnaHQ6IHRoaXMuaG91clNlZ21lbnRIZWlnaHQsXG4gICAgICB3ZWVrZW5kRGF5czogdGhpcy53ZWVrZW5kRGF5cyxcbiAgICAgIG1pbmltdW1FdmVudEhlaWdodDogdGhpcy5taW5pbXVtRXZlbnRIZWlnaHQsXG4gICAgICAuLi5nZXRXZWVrVmlld1BlcmlvZChcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgdGhpcy52aWV3RGF0ZSxcbiAgICAgICAgdGhpcy53ZWVrU3RhcnRzT24sXG4gICAgICAgIHRoaXMuZXhjbHVkZURheXMsXG4gICAgICAgIHRoaXMuZGF5c0luV2Vla1xuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXREcmFnTW92ZWRFdmVudFRpbWVzKFxuICAgIHdlZWtFdmVudDogV2Vla1ZpZXdBbGxEYXlFdmVudCB8IFdlZWtWaWV3VGltZUV2ZW50LFxuICAgIGRyYWdFbmRFdmVudDogRHJhZ0VuZEV2ZW50IHwgRHJhZ01vdmVFdmVudCxcbiAgICBkYXlXaWR0aDogbnVtYmVyLFxuICAgIHVzZVk6IGJvb2xlYW5cbiAgKSB7XG4gICAgY29uc3QgZGF5c0RyYWdnZWQgPVxuICAgICAgKHJvdW5kVG9OZWFyZXN0KGRyYWdFbmRFdmVudC54LCBkYXlXaWR0aCkgLyBkYXlXaWR0aCkgKlxuICAgICAgKHRoaXMucnRsID8gLTEgOiAxKTtcbiAgICBjb25zdCBtaW51dGVzTW92ZWQgPSB1c2VZXG4gICAgICA/IGdldE1pbnV0ZXNNb3ZlZChcbiAgICAgICAgICBkcmFnRW5kRXZlbnQueSxcbiAgICAgICAgICB0aGlzLmhvdXJTZWdtZW50cyxcbiAgICAgICAgICB0aGlzLmhvdXJTZWdtZW50SGVpZ2h0LFxuICAgICAgICAgIHRoaXMuZXZlbnRTbmFwU2l6ZSxcbiAgICAgICAgICB0aGlzLmhvdXJEdXJhdGlvblxuICAgICAgICApXG4gICAgICA6IDA7XG5cbiAgICBjb25zdCBzdGFydCA9IHRoaXMuZGF0ZUFkYXB0ZXIuYWRkTWludXRlcyhcbiAgICAgIGFkZERheXNXaXRoRXhjbHVzaW9ucyhcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgd2Vla0V2ZW50LmV2ZW50LnN0YXJ0LFxuICAgICAgICBkYXlzRHJhZ2dlZCxcbiAgICAgICAgdGhpcy5leGNsdWRlRGF5c1xuICAgICAgKSxcbiAgICAgIG1pbnV0ZXNNb3ZlZFxuICAgICk7XG4gICAgbGV0IGVuZDogRGF0ZTtcbiAgICBpZiAod2Vla0V2ZW50LmV2ZW50LmVuZCkge1xuICAgICAgZW5kID0gdGhpcy5kYXRlQWRhcHRlci5hZGRNaW51dGVzKFxuICAgICAgICBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoXG4gICAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgICB3ZWVrRXZlbnQuZXZlbnQuZW5kLFxuICAgICAgICAgIGRheXNEcmFnZ2VkLFxuICAgICAgICAgIHRoaXMuZXhjbHVkZURheXNcbiAgICAgICAgKSxcbiAgICAgICAgbWludXRlc01vdmVkXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXN0b3JlT3JpZ2luYWxFdmVudHMoXG4gICAgdGVtcEV2ZW50czogQ2FsZW5kYXJFdmVudFtdLFxuICAgIGFkanVzdGVkRXZlbnRzOiBNYXA8Q2FsZW5kYXJFdmVudCwgQ2FsZW5kYXJFdmVudD4sXG4gICAgc25hcERyYWdnZWRFdmVudHMgPSB0cnVlXG4gICkge1xuICAgIGNvbnN0IHByZXZpb3VzVmlldyA9IHRoaXMudmlldztcbiAgICBpZiAoc25hcERyYWdnZWRFdmVudHMpIHtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuZ2V0V2Vla1ZpZXcodGVtcEV2ZW50cyk7XG4gICAgfVxuXG4gICAgY29uc3QgYWRqdXN0ZWRFdmVudHNBcnJheSA9IHRlbXBFdmVudHMuZmlsdGVyKChldmVudCkgPT5cbiAgICAgIGFkanVzdGVkRXZlbnRzLmhhcyhldmVudClcbiAgICApO1xuICAgIHRoaXMudmlldy5ob3VyQ29sdW1ucy5mb3JFYWNoKChjb2x1bW4sIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICBwcmV2aW91c1ZpZXcuaG91ckNvbHVtbnNbY29sdW1uSW5kZXhdLmhvdXJzLmZvckVhY2goKGhvdXIsIGhvdXJJbmRleCkgPT4ge1xuICAgICAgICBob3VyLnNlZ21lbnRzLmZvckVhY2goKHNlZ21lbnQsIHNlZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGNvbHVtbi5ob3Vyc1tob3VySW5kZXhdLnNlZ21lbnRzW3NlZ21lbnRJbmRleF0uY3NzQ2xhc3MgPVxuICAgICAgICAgICAgc2VnbWVudC5jc3NDbGFzcztcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgYWRqdXN0ZWRFdmVudHNBcnJheS5mb3JFYWNoKChhZGp1c3RlZEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRXZlbnQgPSBhZGp1c3RlZEV2ZW50cy5nZXQoYWRqdXN0ZWRFdmVudCk7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQ29sdW1uRXZlbnQgPSBjb2x1bW4uZXZlbnRzLmZpbmQoXG4gICAgICAgICAgKGNvbHVtbkV2ZW50KSA9PlxuICAgICAgICAgICAgY29sdW1uRXZlbnQuZXZlbnQgPT09XG4gICAgICAgICAgICAoc25hcERyYWdnZWRFdmVudHMgPyBhZGp1c3RlZEV2ZW50IDogb3JpZ2luYWxFdmVudClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGV4aXN0aW5nQ29sdW1uRXZlbnQpIHtcbiAgICAgICAgICAvLyByZXN0b3JlIHRoZSBvcmlnaW5hbCBldmVudCBzbyB0cmFja0J5IGtpY2tzIGluIGFuZCB0aGUgZG9tIGlzbid0IGNoYW5nZWRcbiAgICAgICAgICBleGlzdGluZ0NvbHVtbkV2ZW50LmV2ZW50ID0gb3JpZ2luYWxFdmVudDtcbiAgICAgICAgICBleGlzdGluZ0NvbHVtbkV2ZW50Wyd0ZW1wRXZlbnQnXSA9IGFkanVzdGVkRXZlbnQ7XG4gICAgICAgICAgaWYgKCFzbmFwRHJhZ2dlZEV2ZW50cykge1xuICAgICAgICAgICAgZXhpc3RpbmdDb2x1bW5FdmVudC5oZWlnaHQgPSAwO1xuICAgICAgICAgICAgZXhpc3RpbmdDb2x1bW5FdmVudC53aWR0aCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGFkZCBhIGR1bW15IGV2ZW50IHRvIHRoZSBkcm9wIHNvIGlmIHRoZSBldmVudCB3YXMgcmVtb3ZlZCBmcm9tIHRoZSBvcmlnaW5hbCBjb2x1bW4gdGhlIGRyYWcgZG9lc24ndCBlbmQgZWFybHlcbiAgICAgICAgICBjb25zdCBldmVudCA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBvcmlnaW5hbEV2ZW50LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgc3RhcnRzQmVmb3JlRGF5OiBmYWxzZSxcbiAgICAgICAgICAgIGVuZHNBZnRlckRheTogZmFsc2UsXG4gICAgICAgICAgICB0ZW1wRXZlbnQ6IGFkanVzdGVkRXZlbnQsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb2x1bW4uZXZlbnRzLnB1c2goZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBhZGp1c3RlZEV2ZW50cy5jbGVhcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFRpbWVFdmVudFJlc2l6ZWREYXRlcyhcbiAgICBjYWxlbmRhckV2ZW50OiBDYWxlbmRhckV2ZW50LFxuICAgIHJlc2l6ZUV2ZW50OiBSZXNpemVFdmVudFxuICApIHtcbiAgICBjb25zdCBuZXdFdmVudERhdGVzID0ge1xuICAgICAgc3RhcnQ6IGNhbGVuZGFyRXZlbnQuc3RhcnQsXG4gICAgICBlbmQ6IGdldERlZmF1bHRFdmVudEVuZChcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgY2FsZW5kYXJFdmVudCxcbiAgICAgICAgdGhpcy5taW5pbXVtRXZlbnRIZWlnaHRcbiAgICAgICksXG4gICAgfTtcbiAgICBjb25zdCB7IGVuZCwgLi4uZXZlbnRXaXRob3V0RW5kIH0gPSBjYWxlbmRhckV2ZW50O1xuICAgIGNvbnN0IHNtYWxsZXN0UmVzaXplcyA9IHtcbiAgICAgIHN0YXJ0OiB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMoXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuZW5kLFxuICAgICAgICB0aGlzLm1pbmltdW1FdmVudEhlaWdodCAqIC0xXG4gICAgICApLFxuICAgICAgZW5kOiBnZXREZWZhdWx0RXZlbnRFbmQoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgIGV2ZW50V2l0aG91dEVuZCxcbiAgICAgICAgdGhpcy5taW5pbXVtRXZlbnRIZWlnaHRcbiAgICAgICksXG4gICAgfTtcblxuICAgIGNvbnN0IG1vZGlmaWVyID0gdGhpcy5ydGwgPyAtMSA6IDE7XG5cbiAgICBpZiAodHlwZW9mIHJlc2l6ZUV2ZW50LmVkZ2VzLmxlZnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkYXlzRGlmZiA9XG4gICAgICAgIE1hdGgucm91bmQoK3Jlc2l6ZUV2ZW50LmVkZ2VzLmxlZnQgLyB0aGlzLmRheUNvbHVtbldpZHRoKSAqIG1vZGlmaWVyO1xuICAgICAgY29uc3QgbmV3U3RhcnQgPSBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQsXG4gICAgICAgIGRheXNEaWZmLFxuICAgICAgICB0aGlzLmV4Y2x1ZGVEYXlzXG4gICAgICApO1xuICAgICAgaWYgKG5ld1N0YXJ0IDwgc21hbGxlc3RSZXNpemVzLnN0YXJ0KSB7XG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQgPSBuZXdTdGFydDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQgPSBzbWFsbGVzdFJlc2l6ZXMuc3RhcnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcmVzaXplRXZlbnQuZWRnZXMucmlnaHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkYXlzRGlmZiA9XG4gICAgICAgIE1hdGgucm91bmQoK3Jlc2l6ZUV2ZW50LmVkZ2VzLnJpZ2h0IC8gdGhpcy5kYXlDb2x1bW5XaWR0aCkgKiBtb2RpZmllcjtcbiAgICAgIGNvbnN0IG5ld0VuZCA9IGFkZERheXNXaXRoRXhjbHVzaW9ucyhcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgbmV3RXZlbnREYXRlcy5lbmQsXG4gICAgICAgIGRheXNEaWZmLFxuICAgICAgICB0aGlzLmV4Y2x1ZGVEYXlzXG4gICAgICApO1xuICAgICAgaWYgKG5ld0VuZCA+IHNtYWxsZXN0UmVzaXplcy5lbmQpIHtcbiAgICAgICAgbmV3RXZlbnREYXRlcy5lbmQgPSBuZXdFbmQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdFdmVudERhdGVzLmVuZCA9IHNtYWxsZXN0UmVzaXplcy5lbmQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiByZXNpemVFdmVudC5lZGdlcy50b3AgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBtaW51dGVzTW92ZWQgPSBnZXRNaW51dGVzTW92ZWQoXG4gICAgICAgIHJlc2l6ZUV2ZW50LmVkZ2VzLnRvcCBhcyBudW1iZXIsXG4gICAgICAgIHRoaXMuaG91clNlZ21lbnRzLFxuICAgICAgICB0aGlzLmhvdXJTZWdtZW50SGVpZ2h0LFxuICAgICAgICB0aGlzLmV2ZW50U25hcFNpemUsXG4gICAgICAgIHRoaXMuaG91ckR1cmF0aW9uXG4gICAgICApO1xuICAgICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMoXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuc3RhcnQsXG4gICAgICAgIG1pbnV0ZXNNb3ZlZFxuICAgICAgKTtcbiAgICAgIGlmIChuZXdTdGFydCA8IHNtYWxsZXN0UmVzaXplcy5zdGFydCkge1xuICAgICAgICBuZXdFdmVudERhdGVzLnN0YXJ0ID0gbmV3U3RhcnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdFdmVudERhdGVzLnN0YXJ0ID0gc21hbGxlc3RSZXNpemVzLnN0YXJ0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlc2l6ZUV2ZW50LmVkZ2VzLmJvdHRvbSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IG1pbnV0ZXNNb3ZlZCA9IGdldE1pbnV0ZXNNb3ZlZChcbiAgICAgICAgcmVzaXplRXZlbnQuZWRnZXMuYm90dG9tIGFzIG51bWJlcixcbiAgICAgICAgdGhpcy5ob3VyU2VnbWVudHMsXG4gICAgICAgIHRoaXMuaG91clNlZ21lbnRIZWlnaHQsXG4gICAgICAgIHRoaXMuZXZlbnRTbmFwU2l6ZSxcbiAgICAgICAgdGhpcy5ob3VyRHVyYXRpb25cbiAgICAgICk7XG4gICAgICBjb25zdCBuZXdFbmQgPSB0aGlzLmRhdGVBZGFwdGVyLmFkZE1pbnV0ZXMoXG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuZW5kLFxuICAgICAgICBtaW51dGVzTW92ZWRcbiAgICAgICk7XG4gICAgICBpZiAobmV3RW5kID4gc21hbGxlc3RSZXNpemVzLmVuZCkge1xuICAgICAgICBuZXdFdmVudERhdGVzLmVuZCA9IG5ld0VuZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0V2ZW50RGF0ZXMuZW5kID0gc21hbGxlc3RSZXNpemVzLmVuZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3RXZlbnREYXRlcztcbiAgfVxuXG4gIHByb3RlY3RlZCByZXNpemVTdGFydGVkKFxuICAgIGV2ZW50c0NvbnRhaW5lcjogSFRNTEVsZW1lbnQsXG4gICAgZXZlbnQ6IFdlZWtWaWV3VGltZUV2ZW50IHwgV2Vla1ZpZXdBbGxEYXlFdmVudCxcbiAgICBkYXlXaWR0aD86IG51bWJlclxuICApIHtcbiAgICB0aGlzLmRheUNvbHVtbldpZHRoID0gdGhpcy5nZXREYXlDb2x1bW5XaWR0aChldmVudHNDb250YWluZXIpO1xuICAgIGNvbnN0IHJlc2l6ZUhlbHBlciA9IG5ldyBDYWxlbmRhclJlc2l6ZUhlbHBlcihcbiAgICAgIGV2ZW50c0NvbnRhaW5lcixcbiAgICAgIGRheVdpZHRoLFxuICAgICAgdGhpcy5ydGxcbiAgICApO1xuICAgIHRoaXMudmFsaWRhdGVSZXNpemUgPSAoeyByZWN0YW5nbGUsIGVkZ2VzIH0pID0+IHtcbiAgICAgIGNvbnN0IGlzV2l0aGluQm91bmRhcnkgPSByZXNpemVIZWxwZXIudmFsaWRhdGVSZXNpemUoe1xuICAgICAgICByZWN0YW5nbGU6IHsgLi4ucmVjdGFuZ2xlIH0sXG4gICAgICAgIGVkZ2VzLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChpc1dpdGhpbkJvdW5kYXJ5ICYmIHRoaXMudmFsaWRhdGVFdmVudFRpbWVzQ2hhbmdlZCkge1xuICAgICAgICBsZXQgbmV3RXZlbnREYXRlcztcbiAgICAgICAgaWYgKCFkYXlXaWR0aCkge1xuICAgICAgICAgIG5ld0V2ZW50RGF0ZXMgPSB0aGlzLmdldFRpbWVFdmVudFJlc2l6ZWREYXRlcyhldmVudC5ldmVudCwge1xuICAgICAgICAgICAgcmVjdGFuZ2xlLFxuICAgICAgICAgICAgZWRnZXMsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgbW9kaWZpZXIgPSB0aGlzLnJ0bCA/IC0xIDogMTtcbiAgICAgICAgICBpZiAodHlwZW9mIGVkZ2VzLmxlZnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBkaWZmID0gTWF0aC5yb3VuZCgrZWRnZXMubGVmdCAvIGRheVdpZHRoKSAqIG1vZGlmaWVyO1xuICAgICAgICAgICAgbmV3RXZlbnREYXRlcyA9IHRoaXMuZ2V0QWxsRGF5RXZlbnRSZXNpemVkRGF0ZXMoXG4gICAgICAgICAgICAgIGV2ZW50LmV2ZW50LFxuICAgICAgICAgICAgICBkaWZmLFxuICAgICAgICAgICAgICAhdGhpcy5ydGxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBNYXRoLnJvdW5kKCtlZGdlcy5yaWdodCAvIGRheVdpZHRoKSAqIG1vZGlmaWVyO1xuICAgICAgICAgICAgbmV3RXZlbnREYXRlcyA9IHRoaXMuZ2V0QWxsRGF5RXZlbnRSZXNpemVkRGF0ZXMoXG4gICAgICAgICAgICAgIGV2ZW50LmV2ZW50LFxuICAgICAgICAgICAgICBkaWZmLFxuICAgICAgICAgICAgICB0aGlzLnJ0bFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVFdmVudFRpbWVzQ2hhbmdlZCh7XG4gICAgICAgICAgdHlwZTogQ2FsZW5kYXJFdmVudFRpbWVzQ2hhbmdlZEV2ZW50VHlwZS5SZXNpemUsXG4gICAgICAgICAgZXZlbnQ6IGV2ZW50LmV2ZW50LFxuICAgICAgICAgIG5ld1N0YXJ0OiBuZXdFdmVudERhdGVzLnN0YXJ0LFxuICAgICAgICAgIG5ld0VuZDogbmV3RXZlbnREYXRlcy5lbmQsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNXaXRoaW5Cb3VuZGFyeTtcbiAgICB9O1xuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHByb3RlY3RlZCBnZXRBbGxEYXlFdmVudFJlc2l6ZWREYXRlcyhcbiAgICBldmVudDogQ2FsZW5kYXJFdmVudCxcbiAgICBkYXlzRGlmZjogbnVtYmVyLFxuICAgIGJlZm9yZVN0YXJ0OiBib29sZWFuXG4gICkge1xuICAgIGxldCBzdGFydDogRGF0ZSA9IGV2ZW50LnN0YXJ0O1xuICAgIGxldCBlbmQ6IERhdGUgPSBldmVudC5lbmQgfHwgZXZlbnQuc3RhcnQ7XG4gICAgaWYgKGJlZm9yZVN0YXJ0KSB7XG4gICAgICBzdGFydCA9IGFkZERheXNXaXRoRXhjbHVzaW9ucyhcbiAgICAgICAgdGhpcy5kYXRlQWRhcHRlcixcbiAgICAgICAgc3RhcnQsXG4gICAgICAgIGRheXNEaWZmLFxuICAgICAgICB0aGlzLmV4Y2x1ZGVEYXlzXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmQgPSBhZGREYXlzV2l0aEV4Y2x1c2lvbnMoXG4gICAgICAgIHRoaXMuZGF0ZUFkYXB0ZXIsXG4gICAgICAgIGVuZCxcbiAgICAgICAgZGF5c0RpZmYsXG4gICAgICAgIHRoaXMuZXhjbHVkZURheXNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgc3RhcnQsIGVuZCB9O1xuICB9XG59XG4iXX0=