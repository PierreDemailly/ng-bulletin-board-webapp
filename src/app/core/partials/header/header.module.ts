import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from '@core/partials/header/header.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule { }
