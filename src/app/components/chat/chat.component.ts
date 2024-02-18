import {  Component,  ElementRef,  OnDestroy,  OnInit,  Renderer2,  ViewChild,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, takeUntil, timer } from 'rxjs';
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
  getMessagesSubscription:Subscription | undefined;
  valueChangesSubscription: Subscription | undefined;
  isTyping:boolean = false;
  private destroy$: Subject<void> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private chatServise: ChatService
  ) {
    this.chatForm = this.formBuilder.group({
      message: [''],
    });
    
    this.getOldmessages();
    this.getTypingStatus();
    this.startTypingDetection();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if(this.getMessagesSubscription){
      this.getMessagesSubscription.unsubscribe();
    }
    if(this.valueChangesSubscription){
      this.valueChangesSubscription.unsubscribe();
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
    this.startTypingDetection();
    this.focusOnInput();
    this.getTypingStatus();
  }

  focusOnInput() {
    if (this.messageInput && this.messageInput.nativeElement) {
    this.renderer.selectRootElement(this.messageInput.nativeElement).focus();
    }
  }

  getOldmessages() {
    this.getMessagesSubscription = this.chatServise.getMessage().subscribe((message: any) => {
      this.messages.push(message);
      this.focusOnInput();
      });
  }

  getTypingStatus(){
    this.chatServise.getTypingStatus().subscribe((data:any)=>{
      this.isTyping = data.isTyping;
    })
  }

  startTypingDetection() {
    this.valueChangesSubscription = this.chatForm.get('message')?.valueChanges.pipe(
      distinctUntilChanged(),
      // switchMap(() => timer(200)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Send typing status to the server
      this.chatServise.sendTypingStatus(true);
      // Automatically send 'false' after a period of inactivity
      timer(1000).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.chatServise.sendTypingStatus(false);
      });
    });
  }
}
