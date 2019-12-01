import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderModule } from '@core/partials/header/header.module';
import { SharedModule } from '@shared/shared.module';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    HeaderModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RegisterModule { }
