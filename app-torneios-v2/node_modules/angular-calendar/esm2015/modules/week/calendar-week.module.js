import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { CalendarWeekViewComponent } from './calendar-week-view.component';
import { CalendarWeekViewHeaderComponent } from './calendar-week-view-header.component';
import { CalendarWeekViewEventComponent } from './calendar-week-view-event.component';
import { CalendarCommonModule } from '../common/calendar-common.module';
import { CalendarWeekViewHourSegmentComponent } from './calendar-week-view-hour-segment.component';
import { CalendarWeekViewCurrentTimeMarkerComponent } from './calendar-week-view-current-time-marker.component';
import * as i0 from "@angular/core";
export { CalendarWeekViewComponent, } from './calendar-week-view.component';
export { getWeekViewPeriod } from '../common/util';
// needed for ivy, not part of the public api
export { CalendarWeekViewHeaderComponent as ɵCalendarWeekViewHeaderComponent } from './calendar-week-view-header.component';
export { CalendarWeekViewEventComponent as ɵCalendarWeekViewEventComponent } from './calendar-week-view-event.component';
export { CalendarWeekViewHourSegmentComponent as ɵCalendarWeekViewHourSegmentComponent } from './calendar-week-view-hour-segment.component';
export { CalendarWeekViewCurrentTimeMarkerComponent as ɵCalendarWeekViewCurrentTimeMarkerComponent } from './calendar-week-view-current-time-marker.component';
export class CalendarWeekModule {
}
CalendarWeekModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.3", ngImport: i0, type: CalendarWeekModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CalendarWeekModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.3", ngImport: i0, type: CalendarWeekModule, declarations: [CalendarWeekViewComponent,
        CalendarWeekViewHeaderComponent,
        CalendarWeekViewEventComponent,
        CalendarWeekViewHourSegmentComponent,
        CalendarWeekViewCurrentTimeMarkerComponent], imports: [CommonModule,
        ResizableModule,
        DragAndDropModule,
        CalendarCommonModule], exports: [ResizableModule,
        DragAndDropModule,
        CalendarWeekViewComponent,
        CalendarWeekViewHeaderComponent,
        CalendarWeekViewEventComponent,
        CalendarWeekViewHourSegmentComponent,
        CalendarWeekViewCurrentTimeMarkerComponent] });
CalendarWeekModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.3", ngImport: i0, type: CalendarWeekModule, imports: [[
            CommonModule,
            ResizableModule,
            DragAndDropModule,
            CalendarCommonModule,
        ], ResizableModule,
        DragAndDropModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.3", ngImport: i0, type: CalendarWeekModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        ResizableModule,
                        DragAndDropModule,
                        CalendarCommonModule,
                    ],
                    declarations: [
                        CalendarWeekViewComponent,
                        CalendarWeekViewHeaderComponent,
                        CalendarWeekViewEventComponent,
                        CalendarWeekViewHourSegmentComponent,
                        CalendarWeekViewCurrentTimeMarkerComponent,
                    ],
                    exports: [
                        ResizableModule,
                        DragAndDropModule,
                        CalendarWeekViewComponent,
                        CalendarWeekViewHeaderComponent,
                        CalendarWeekViewEventComponent,
                        CalendarWeekViewHourSegmentComponent,
                        CalendarWeekViewCurrentTimeMarkerComponent,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItd2Vlay5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWNhbGVuZGFyL3NyYy9tb2R1bGVzL3dlZWsvY2FsZW5kYXItd2Vlay5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hGLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ25HLE9BQU8sRUFBRSwwQ0FBMEMsRUFBRSxNQUFNLG9EQUFvRCxDQUFDOztBQUVoSCxPQUFPLEVBQ0wseUJBQXlCLEdBRTFCLE1BQU0sZ0NBQWdDLENBQUM7QUFNeEMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsNkNBQTZDO0FBQzdDLE9BQU8sRUFBRSwrQkFBK0IsSUFBSSxnQ0FBZ0MsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzVILE9BQU8sRUFBRSw4QkFBOEIsSUFBSSwrQkFBK0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3pILE9BQU8sRUFBRSxvQ0FBb0MsSUFBSSxxQ0FBcUMsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQzVJLE9BQU8sRUFBRSwwQ0FBMEMsSUFBSSwyQ0FBMkMsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBMEIvSixNQUFNLE9BQU8sa0JBQWtCOzsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBaEIzQix5QkFBeUI7UUFDekIsK0JBQStCO1FBQy9CLDhCQUE4QjtRQUM5QixvQ0FBb0M7UUFDcEMsMENBQTBDLGFBVjFDLFlBQVk7UUFDWixlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLG9CQUFvQixhQVVwQixlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLHlCQUF5QjtRQUN6QiwrQkFBK0I7UUFDL0IsOEJBQThCO1FBQzlCLG9DQUFvQztRQUNwQywwQ0FBMEM7Z0hBR2pDLGtCQUFrQixZQXZCcEI7WUFDUCxZQUFZO1lBQ1osZUFBZTtZQUNmLGlCQUFpQjtZQUNqQixvQkFBb0I7U0FDckIsRUFTQyxlQUFlO1FBQ2YsaUJBQWlCOzJGQVFSLGtCQUFrQjtrQkF4QjlCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLG9CQUFvQjtxQkFDckI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLHlCQUF5Qjt3QkFDekIsK0JBQStCO3dCQUMvQiw4QkFBOEI7d0JBQzlCLG9DQUFvQzt3QkFDcEMsMENBQTBDO3FCQUMzQztvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLHlCQUF5Qjt3QkFDekIsK0JBQStCO3dCQUMvQiw4QkFBOEI7d0JBQzlCLG9DQUFvQzt3QkFDcEMsMENBQTBDO3FCQUMzQztpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUmVzaXphYmxlTW9kdWxlIH0gZnJvbSAnYW5ndWxhci1yZXNpemFibGUtZWxlbWVudCc7XG5pbXBvcnQgeyBEcmFnQW5kRHJvcE1vZHVsZSB9IGZyb20gJ2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZSc7XG5pbXBvcnQgeyBDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci13ZWVrLXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXdlZWstdmlldy1oZWFkZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdFdmVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYWxlbmRhckNvbW1vbk1vZHVsZSB9IGZyb20gJy4uL2NvbW1vbi9jYWxlbmRhci1jb21tb24ubW9kdWxlJztcbmltcG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdIb3VyU2VnbWVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LWhvdXItc2VnbWVudC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FsZW5kYXJXZWVrVmlld0N1cnJlbnRUaW1lTWFya2VyQ29tcG9uZW50IH0gZnJvbSAnLi9jYWxlbmRhci13ZWVrLXZpZXctY3VycmVudC10aW1lLW1hcmtlci5jb21wb25lbnQnO1xuXG5leHBvcnQge1xuICBDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50LFxuICBDYWxlbmRhcldlZWtWaWV3QmVmb3JlUmVuZGVyRXZlbnQsXG59IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LmNvbXBvbmVudCc7XG5leHBvcnQge1xuICBXZWVrVmlld0FsbERheUV2ZW50IGFzIENhbGVuZGFyV2Vla1ZpZXdBbGxEYXlFdmVudCxcbiAgV2Vla1ZpZXdBbGxEYXlFdmVudFJvdyBhcyBDYWxlbmRhcldlZWtWaWV3QWxsRGF5RXZlbnRSb3csXG4gIEdldFdlZWtWaWV3QXJncyBhcyBDYWxlbmRhckdldFdlZWtWaWV3QXJncyxcbn0gZnJvbSAnY2FsZW5kYXItdXRpbHMnO1xuZXhwb3J0IHsgZ2V0V2Vla1ZpZXdQZXJpb2QgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5cbi8vIG5lZWRlZCBmb3IgaXZ5LCBub3QgcGFydCBvZiB0aGUgcHVibGljIGFwaVxuZXhwb3J0IHsgQ2FsZW5kYXJXZWVrVmlld0hlYWRlckNvbXBvbmVudCBhcyDJtUNhbGVuZGFyV2Vla1ZpZXdIZWFkZXJDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXdlZWstdmlldy1oZWFkZXIuY29tcG9uZW50JztcbmV4cG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdFdmVudENvbXBvbmVudCBhcyDJtUNhbGVuZGFyV2Vla1ZpZXdFdmVudENvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LWV2ZW50LmNvbXBvbmVudCc7XG5leHBvcnQgeyBDYWxlbmRhcldlZWtWaWV3SG91clNlZ21lbnRDb21wb25lbnQgYXMgybVDYWxlbmRhcldlZWtWaWV3SG91clNlZ21lbnRDb21wb25lbnQgfSBmcm9tICcuL2NhbGVuZGFyLXdlZWstdmlldy1ob3VyLXNlZ21lbnQuY29tcG9uZW50JztcbmV4cG9ydCB7IENhbGVuZGFyV2Vla1ZpZXdDdXJyZW50VGltZU1hcmtlckNvbXBvbmVudCBhcyDJtUNhbGVuZGFyV2Vla1ZpZXdDdXJyZW50VGltZU1hcmtlckNvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItd2Vlay12aWV3LWN1cnJlbnQtdGltZS1tYXJrZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBSZXNpemFibGVNb2R1bGUsXG4gICAgRHJhZ0FuZERyb3BNb2R1bGUsXG4gICAgQ2FsZW5kYXJDb21tb25Nb2R1bGUsXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIENhbGVuZGFyV2Vla1ZpZXdDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0hlYWRlckNvbXBvbmVudCxcbiAgICBDYWxlbmRhcldlZWtWaWV3RXZlbnRDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0hvdXJTZWdtZW50Q29tcG9uZW50LFxuICAgIENhbGVuZGFyV2Vla1ZpZXdDdXJyZW50VGltZU1hcmtlckNvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIFJlc2l6YWJsZU1vZHVsZSxcbiAgICBEcmFnQW5kRHJvcE1vZHVsZSxcbiAgICBDYWxlbmRhcldlZWtWaWV3Q29tcG9uZW50LFxuICAgIENhbGVuZGFyV2Vla1ZpZXdIZWFkZXJDb21wb25lbnQsXG4gICAgQ2FsZW5kYXJXZWVrVmlld0V2ZW50Q29tcG9uZW50LFxuICAgIENhbGVuZGFyV2Vla1ZpZXdIb3VyU2VnbWVudENvbXBvbmVudCxcbiAgICBDYWxlbmRhcldlZWtWaWV3Q3VycmVudFRpbWVNYXJrZXJDb21wb25lbnQsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIENhbGVuZGFyV2Vla01vZHVsZSB7fVxuIl19