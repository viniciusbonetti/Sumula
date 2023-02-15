import { Component, Input, Output, EventEmitter, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../common/calendar-event-actions.component";
import * as i2 from "../common/calendar-event-title.component";
import * as i3 from "@angular/common";
import * as i4 from "../common/calendar-tooltip.directive";
import * as i5 from "../common/click.directive";
import * as i6 from "../common/keydown-enter.directive";
import * as i7 from "../common/calendar-event-title.pipe";
import * as i8 from "../common/calendar-a11y.pipe";
export class CalendarWeekViewEventComponent {
    constructor() {
        this.eventClicked = new EventEmitter();
    }
}
CalendarWeekViewEventComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.3", ngImport: i0, type: CalendarWeekViewEventComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CalendarWeekViewEventComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.3", type: CalendarWeekViewEventComponent, selector: "mwl-calendar-week-view-event", inputs: { locale: "locale", weekEvent: "weekEvent", tooltipPlacement: "tooltipPlacement", tooltipAppendToBody: "tooltipAppendToBody", tooltipDisabled: "tooltipDisabled", tooltipDelay: "tooltipDelay", customTemplate: "customTemplate", eventTitleTemplate: "eventTitleTemplate", eventActionsTemplate: "eventActionsTemplate", tooltipTemplate: "tooltipTemplate", column: "column", daysInWeek: "daysInWeek" }, outputs: { eventClicked: "eventClicked" }, ngImport: i0, template: `
    <ng-template
      #defaultTemplate
      let-weekEvent="weekEvent"
      let-tooltipPlacement="tooltipPlacement"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDisabled="tooltipDisabled"
      let-tooltipDelay="tooltipDelay"
      let-column="column"
      let-daysInWeek="daysInWeek"
    >
      <div
        class="cal-event"
        [ngStyle]="{
          backgroundColor: weekEvent.event.color?.secondary,
          borderColor: weekEvent.event.color?.primary
        }"
        [mwlCalendarTooltip]="
          !tooltipDisabled
            ? (weekEvent.event.title
              | calendarEventTitle
                : (daysInWeek === 1 ? 'dayTooltip' : 'weekTooltip')
                : weekEvent.tempEvent || weekEvent.event)
            : ''
        "
        [tooltipPlacement]="tooltipPlacement"
        [tooltipEvent]="weekEvent.tempEvent || weekEvent.event"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipAppendToBody]="tooltipAppendToBody"
        [tooltipDelay]="tooltipDelay"
        (mwlClick)="eventClicked.emit({ sourceEvent: $event })"
        (mwlKeydownEnter)="eventClicked.emit({ sourceEvent: $event })"
        tabindex="0"
        role="application"
        [attr.aria-label]="
          { event: weekEvent.tempEvent || weekEvent.event, locale: locale }
            | calendarA11y: 'eventDescription'
        "
      >
        <mwl-calendar-event-actions
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventActionsTemplate"
        >
        </mwl-calendar-event-actions>
        &ngsp;
        <mwl-calendar-event-title
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventTitleTemplate"
          [view]="daysInWeek === 1 ? 'day' : 'week'"
        >
        </mwl-calendar-event-title>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        weekEvent: weekEvent,
        tooltipPlacement: tooltipPlacement,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDisabled: tooltipDisabled,
        tooltipDelay: tooltipDelay,
        column: column,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `, isInline: true, components: [{ type: i1.CalendarEventActionsComponent, selector: "mwl-calendar-event-actions", inputs: ["event", "customTemplate"] }, { type: i2.CalendarEventTitleComponent, selector: "mwl-calendar-event-title", inputs: ["event", "customTemplate", "view"] }], directives: [{ type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i4.CalendarTooltipDirective, selector: "[mwlCalendarTooltip]", inputs: ["mwlCalendarTooltip", "tooltipPlacement", "tooltipTemplate", "tooltipEvent", "tooltipAppendToBody", "tooltipDelay"] }, { type: i5.ClickDirective, selector: "[mwlClick]", inputs: ["clickListenerDisabled"], outputs: ["mwlClick"] }, { type: i6.KeydownEnterDirective, selector: "[mwlKeydownEnter]", outputs: ["mwlKeydownEnter"] }, { type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], pipes: { "calendarEventTitle": i7.CalendarEventTitlePipe, "calendarA11y": i8.CalendarA11yPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.3", ngImport: i0, type: CalendarWeekViewEventComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mwl-calendar-week-view-event',
                    template: `
    <ng-template
      #defaultTemplate
      let-weekEvent="weekEvent"
      let-tooltipPlacement="tooltipPlacement"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDisabled="tooltipDisabled"
      let-tooltipDelay="tooltipDelay"
      let-column="column"
      let-daysInWeek="daysInWeek"
    >
      <div
        class="cal-event"
        [ngStyle]="{
          backgroundColor: weekEvent.event.color?.secondary,
          borderColor: weekEvent.event.color?.primary
        }"
        [mwlCalendarTooltip]="
          !tooltipDisabled
            ? (weekEvent.event.title
              | calendarEventTitle
                : (daysInWeek === 1 ? 'dayTooltip' : 'weekTooltip')
                : weekEvent.tempEvent || weekEvent.event)
            : ''
        "
        [tooltipPlacement]="tooltipPlacement"
        [tooltipEvent]="weekEvent.tempEvent || weekEvent.event"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipAppendToBody]="tooltipAppendToBody"
        [tooltipDelay]="tooltipDelay"
        (mwlClick)="eventClicked.emit({ sourceEvent: $event })"
        (mwlKeydownEnter)="eventClicked.emit({ sourceEvent: $event })"
        tabindex="0"
        role="application"
        [attr.aria-label]="
          { event: weekEvent.tempEvent || weekEvent.event, locale: locale }
            | calendarA11y: 'eventDescription'
        "
      >
        <mwl-calendar-event-actions
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventActionsTemplate"
        >
        </mwl-calendar-event-actions>
        &ngsp;
        <mwl-calendar-event-title
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventTitleTemplate"
          [view]="daysInWeek === 1 ? 'day' : 'week'"
        >
        </mwl-calendar-event-title>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        weekEvent: weekEvent,
        tooltipPlacement: tooltipPlacement,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDisabled: tooltipDisabled,
        tooltipDelay: tooltipDelay,
        column: column,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `,
                }]
        }], propDecorators: { locale: [{
                type: Input
            }], weekEvent: [{
                type: Input
            }], tooltipPlacement: [{
                type: Input
            }], tooltipAppendToBody: [{
                type: Input
            }], tooltipDisabled: [{
                type: Input
            }], tooltipDelay: [{
                type: Input
            }], customTemplate: [{
                type: Input
            }], eventTitleTemplate: [{
                type: Input
            }], eventActionsTemplate: [{
                type: Input
            }], tooltipTemplate: [{
                type: Input
            }], column: [{
                type: Input
            }], daysInWeek: [{
                type: Input
            }], eventClicked: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItY2FsZW5kYXIvc3JjL21vZHVsZXMvd2Vlay9jYWxlbmRhci13ZWVrLXZpZXctZXZlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEdBRWIsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7Ozs7QUFrRnZCLE1BQU0sT0FBTyw4QkFBOEI7SUExRTNDO1FBbUdZLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBRXJDLENBQUM7S0FDTjs7MkhBNUJZLDhCQUE4QjsrR0FBOUIsOEJBQThCLG1nQkF4RS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0VUOzJGQUVVLDhCQUE4QjtrQkExRTFDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDhCQUE4QjtvQkFDeEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0VUO2lCQUNGOzhCQUVVLE1BQU07c0JBQWQsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFFRyxtQkFBbUI7c0JBQTNCLEtBQUs7Z0JBRUcsZUFBZTtzQkFBdkIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBRUcsa0JBQWtCO3NCQUExQixLQUFLO2dCQUVHLG9CQUFvQjtzQkFBNUIsS0FBSztnQkFFRyxlQUFlO3NCQUF2QixLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVJLFlBQVk7c0JBQXJCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgV2Vla1ZpZXdBbGxEYXlFdmVudCxcbiAgV2Vla1ZpZXdUaW1lRXZlbnQsXG4gIFdlZWtWaWV3SG91ckNvbHVtbixcbn0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuaW1wb3J0IHsgUGxhY2VtZW50QXJyYXkgfSBmcm9tICdwb3NpdGlvbmluZyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ213bC1jYWxlbmRhci13ZWVrLXZpZXctZXZlbnQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgI2RlZmF1bHRUZW1wbGF0ZVxuICAgICAgbGV0LXdlZWtFdmVudD1cIndlZWtFdmVudFwiXG4gICAgICBsZXQtdG9vbHRpcFBsYWNlbWVudD1cInRvb2x0aXBQbGFjZW1lbnRcIlxuICAgICAgbGV0LWV2ZW50Q2xpY2tlZD1cImV2ZW50Q2xpY2tlZFwiXG4gICAgICBsZXQtdG9vbHRpcFRlbXBsYXRlPVwidG9vbHRpcFRlbXBsYXRlXCJcbiAgICAgIGxldC10b29sdGlwQXBwZW5kVG9Cb2R5PVwidG9vbHRpcEFwcGVuZFRvQm9keVwiXG4gICAgICBsZXQtdG9vbHRpcERpc2FibGVkPVwidG9vbHRpcERpc2FibGVkXCJcbiAgICAgIGxldC10b29sdGlwRGVsYXk9XCJ0b29sdGlwRGVsYXlcIlxuICAgICAgbGV0LWNvbHVtbj1cImNvbHVtblwiXG4gICAgICBsZXQtZGF5c0luV2Vlaz1cImRheXNJbldlZWtcIlxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJjYWwtZXZlbnRcIlxuICAgICAgICBbbmdTdHlsZV09XCJ7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB3ZWVrRXZlbnQuZXZlbnQuY29sb3I/LnNlY29uZGFyeSxcbiAgICAgICAgICBib3JkZXJDb2xvcjogd2Vla0V2ZW50LmV2ZW50LmNvbG9yPy5wcmltYXJ5XG4gICAgICAgIH1cIlxuICAgICAgICBbbXdsQ2FsZW5kYXJUb29sdGlwXT1cIlxuICAgICAgICAgICF0b29sdGlwRGlzYWJsZWRcbiAgICAgICAgICAgID8gKHdlZWtFdmVudC5ldmVudC50aXRsZVxuICAgICAgICAgICAgICB8IGNhbGVuZGFyRXZlbnRUaXRsZVxuICAgICAgICAgICAgICAgIDogKGRheXNJbldlZWsgPT09IDEgPyAnZGF5VG9vbHRpcCcgOiAnd2Vla1Rvb2x0aXAnKVxuICAgICAgICAgICAgICAgIDogd2Vla0V2ZW50LnRlbXBFdmVudCB8fCB3ZWVrRXZlbnQuZXZlbnQpXG4gICAgICAgICAgICA6ICcnXG4gICAgICAgIFwiXG4gICAgICAgIFt0b29sdGlwUGxhY2VtZW50XT1cInRvb2x0aXBQbGFjZW1lbnRcIlxuICAgICAgICBbdG9vbHRpcEV2ZW50XT1cIndlZWtFdmVudC50ZW1wRXZlbnQgfHwgd2Vla0V2ZW50LmV2ZW50XCJcbiAgICAgICAgW3Rvb2x0aXBUZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIlxuICAgICAgICBbdG9vbHRpcEFwcGVuZFRvQm9keV09XCJ0b29sdGlwQXBwZW5kVG9Cb2R5XCJcbiAgICAgICAgW3Rvb2x0aXBEZWxheV09XCJ0b29sdGlwRGVsYXlcIlxuICAgICAgICAobXdsQ2xpY2spPVwiZXZlbnRDbGlja2VkLmVtaXQoeyBzb3VyY2VFdmVudDogJGV2ZW50IH0pXCJcbiAgICAgICAgKG13bEtleWRvd25FbnRlcik9XCJldmVudENsaWNrZWQuZW1pdCh7IHNvdXJjZUV2ZW50OiAkZXZlbnQgfSlcIlxuICAgICAgICB0YWJpbmRleD1cIjBcIlxuICAgICAgICByb2xlPVwiYXBwbGljYXRpb25cIlxuICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIlxuICAgICAgICAgIHsgZXZlbnQ6IHdlZWtFdmVudC50ZW1wRXZlbnQgfHwgd2Vla0V2ZW50LmV2ZW50LCBsb2NhbGU6IGxvY2FsZSB9XG4gICAgICAgICAgICB8IGNhbGVuZGFyQTExeTogJ2V2ZW50RGVzY3JpcHRpb24nXG4gICAgICAgIFwiXG4gICAgICA+XG4gICAgICAgIDxtd2wtY2FsZW5kYXItZXZlbnQtYWN0aW9uc1xuICAgICAgICAgIFtldmVudF09XCJ3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudFwiXG4gICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImV2ZW50QWN0aW9uc1RlbXBsYXRlXCJcbiAgICAgICAgPlxuICAgICAgICA8L213bC1jYWxlbmRhci1ldmVudC1hY3Rpb25zPlxuICAgICAgICAmbmdzcDtcbiAgICAgICAgPG13bC1jYWxlbmRhci1ldmVudC10aXRsZVxuICAgICAgICAgIFtldmVudF09XCJ3ZWVrRXZlbnQudGVtcEV2ZW50IHx8IHdlZWtFdmVudC5ldmVudFwiXG4gICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cImV2ZW50VGl0bGVUZW1wbGF0ZVwiXG4gICAgICAgICAgW3ZpZXddPVwiZGF5c0luV2VlayA9PT0gMSA/ICdkYXknIDogJ3dlZWsnXCJcbiAgICAgICAgPlxuICAgICAgICA8L213bC1jYWxlbmRhci1ldmVudC10aXRsZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjdXN0b21UZW1wbGF0ZSB8fCBkZWZhdWx0VGVtcGxhdGVcIlxuICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cIntcbiAgICAgICAgd2Vla0V2ZW50OiB3ZWVrRXZlbnQsXG4gICAgICAgIHRvb2x0aXBQbGFjZW1lbnQ6IHRvb2x0aXBQbGFjZW1lbnQsXG4gICAgICAgIGV2ZW50Q2xpY2tlZDogZXZlbnRDbGlja2VkLFxuICAgICAgICB0b29sdGlwVGVtcGxhdGU6IHRvb2x0aXBUZW1wbGF0ZSxcbiAgICAgICAgdG9vbHRpcEFwcGVuZFRvQm9keTogdG9vbHRpcEFwcGVuZFRvQm9keSxcbiAgICAgICAgdG9vbHRpcERpc2FibGVkOiB0b29sdGlwRGlzYWJsZWQsXG4gICAgICAgIHRvb2x0aXBEZWxheTogdG9vbHRpcERlbGF5LFxuICAgICAgICBjb2x1bW46IGNvbHVtbixcbiAgICAgICAgZGF5c0luV2VlazogZGF5c0luV2Vla1xuICAgICAgfVwiXG4gICAgPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyV2Vla1ZpZXdFdmVudENvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGxvY2FsZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIHdlZWtFdmVudDogV2Vla1ZpZXdBbGxEYXlFdmVudCB8IFdlZWtWaWV3VGltZUV2ZW50O1xuXG4gIEBJbnB1dCgpIHRvb2x0aXBQbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5O1xuXG4gIEBJbnB1dCgpIHRvb2x0aXBBcHBlbmRUb0JvZHk6IGJvb2xlYW47XG5cbiAgQElucHV0KCkgdG9vbHRpcERpc2FibGVkOiBib29sZWFuO1xuXG4gIEBJbnB1dCgpIHRvb2x0aXBEZWxheTogbnVtYmVyIHwgbnVsbDtcblxuICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXQoKSBldmVudFRpdGxlVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KCkgZXZlbnRBY3Rpb25zVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0KCkgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dCgpIGNvbHVtbjogV2Vla1ZpZXdIb3VyQ29sdW1uO1xuXG4gIEBJbnB1dCgpIGRheXNJbldlZWs6IG51bWJlcjtcblxuICBAT3V0cHV0KCkgZXZlbnRDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcjx7XG4gICAgc291cmNlRXZlbnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50O1xuICB9PigpO1xufVxuIl19