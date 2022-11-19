import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DefaultRoutingModule } from '@core/layouts/default/default-routing.module';
import { AsideComponent } from '@core/partials/aside/aside.component';
import { FooterModule } from '@core/partials/footer/footer.module';
import { HeaderModule } from '@core/partials/header/header.module';
import { AdminGuard } from '@guards/admin.guard';
import { SharedModule } from '@shared/shared.module';
import { DefaultLayoutComponent } from './default-layout.component';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DefaultLayoutComponent, AsideComponent],
  imports: [
    CommonModule,
    DefaultRoutingModule,
    RouterModule,
    HeaderModule,
    FooterModule,
    SharedModule,
  ],
  providers: [
    AdminGuard,
  ],
})
export class DefaultModule { }
