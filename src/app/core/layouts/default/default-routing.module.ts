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
        loadChildren: () => import('@core/pages/login/login.module').then(m => m.LoginModule),
      },
      {
        path: 'register',
        loadChildren: () => import('@core/pages/register/register.module').then(m => m.RegisterModule),
      },
      {
        path: 'forums',
        loadChildren: () => import('@features/forum/forum.module').then(m => m.ForumModule),
      },
      {
        path: 'admin',
        loadChildren: () => import('@features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'account',
        loadChildren: () => import('@features/account/account.module').then(m => m.AccountModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultRoutingModule { }
