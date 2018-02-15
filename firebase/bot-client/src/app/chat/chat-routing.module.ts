import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: ChatDialogComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
