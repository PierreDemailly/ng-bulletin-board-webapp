import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutComponent } from '@core/layouts/admin/admin-layout.component';
import { HeaderModule } from '@core/partials/header/header.module';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AppParametersComponent } from './app-parameters/app-parameters.component';
import { CategoriesComponent } from './categories/categories.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { UsersComponent } from './users/users.component';
import { PermissionsComponent } from './permissions/permissions.component';

@NgModule({
  declarations: [
    AdminComponent,
    CategoriesComponent,
    NewCategoryComponent,
    EditCategoryComponent,
    AdminLayoutComponent,
    AppParametersComponent,
    UsersComponent,
    EditUserComponent,
    PermissionsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    SharedModule,
  ],
})
export class AdminModule { }
