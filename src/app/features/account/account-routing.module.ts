import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@guards/auth.guard';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {
    path: ':id',
    component: AccountComponent,
  },
  {
    path: ':id/edit',
    component: AccountEditComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }
