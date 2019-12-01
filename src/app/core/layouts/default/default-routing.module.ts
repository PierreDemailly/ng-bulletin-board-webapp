import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '@guards/admin.guard';
import { DefaultLayoutComponent } from './default-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'forums',
      },
      {
        path: 'login',
        loadChildren: '@core/pages/login/login.module#LoginModule',
      },
      {
        path: 'register',
        loadChildren: '@core/pages/register/register.module#RegisterModule',
      },
      {
        path: 'forums',
        loadChildren: '@features/forum/forum.module#ForumModule',
      },
      {
        path: 'admin',
        loadChildren: '@features/admin/admin.module#AdminModule',
        canActivate: [AdminGuard],
      },
      {
        path: 'account',
        loadChildren: '@features/account/account.module#AccountModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultRoutingModule { }
