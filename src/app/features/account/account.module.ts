import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderModule } from '@core/partials/header/header.module';
import { SharedModule } from '@shared/shared.module';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [AccountComponent, AccountEditComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    HeaderModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AccountModule { }
