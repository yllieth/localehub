import { NgModule } from '@angular/core';
import {
  MdSidenavModule, MdTooltipModule, MdSelectModule, MdInputModule, MdMenuModule, MdDialogModule, MdButtonModule,
  MdIconModule, MdToolbarModule, MdTabsModule
} from '@angular/material';

@NgModule({
  imports: [MdSidenavModule, MdTooltipModule, MdSelectModule, MdInputModule, MdMenuModule, MdDialogModule, MdButtonModule, MdIconModule, MdToolbarModule, MdTabsModule],
  exports: [MdSidenavModule, MdTooltipModule, MdSelectModule, MdInputModule, MdMenuModule, MdDialogModule, MdButtonModule, MdIconModule, MdToolbarModule, MdTabsModule]
})
export class MyMaterialModule {

}