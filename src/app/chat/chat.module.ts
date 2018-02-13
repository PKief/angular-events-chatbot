import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
  ],
  declarations: [ChatDialogComponent],
  providers: [ChatService],
  exports: [ChatDialogComponent]
})
export class ChatModule { }
