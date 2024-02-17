import {  Component,  ElementRef,  OnDestroy,  OnInit,  Renderer2,  ViewChild,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit,OnDestroy {
  @ViewChild('messageContainer') messageContainer: ElementRef | undefined;
  @ViewChild('messageInput') messageInput: ElementRef | undefined;

  messages: any[] = [];
  chatForm: FormGroup;
  getMessagesSubscription:Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private chatServise: ChatService
  ) {
    this.chatForm = this.formBuilder.group({
      message: [''],
    });
    this.getMessagesSubscription = this.chatServise.getMessage().subscribe((message: any) => {
    this.focusOnInput();
    });
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.unsubscribeSubscription(this.getMessagesSubscription);
  }

  unsubscribeSubscription(variable:Subscription) {
    if(variable){
      variable.unsubscribe();
    }
  }
  
  sendMessage(): void {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      let sendMgs = {
        text: message,
        type: 'sent',
      };
      this.messages.push(sendMgs);
      this.chatForm.reset();
      this.scrollMessageIntoView();
      this.chatServise.sendMessage(message);
    }
  }

  scrollMessageIntoView(): void {
    setTimeout(() => {
      if (this.messageContainer && this.messageContainer.nativeElement) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    });
  }

  onInit() {
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
    this.focusOnInput();
    this.getOldmessages();
  }

  focusOnInput() {
    if (this.messageInput && this.messageInput.nativeElement) {
    this.renderer.selectRootElement(this.messageInput.nativeElement).focus();
    }
  }

  getOldmessages() {
    this.chatServise.getMessage().subscribe((message: any) => {
      // console.log('Received message:', message);
      this.messages.push(message);
    });
  }
}
