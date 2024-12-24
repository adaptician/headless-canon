import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {PreviewComponent} from "./preview/preview/preview.component";

const routes: Routes = [
  {
    path: 'preview',
    component: PreviewComponent
  },
  {
    path: '',
    redirectTo: '/preview',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
