import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  getMessagesSubscription: Subscription | undefined;
  notification: any[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.getOldmessages();
  }

  getOldmessages() {
    this.getMessagesSubscription = this.chatService
      .getMessage()
      .subscribe((message: any) => {
        this.notification.push(message);
      });
  }
}
