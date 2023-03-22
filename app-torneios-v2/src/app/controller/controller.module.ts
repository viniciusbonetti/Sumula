import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ControllerComponent } from './controller.component';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ ControllerComponent ],
    exports: [ ControllerComponent ]
})

export class ControllerModule {}
