import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  
  @ViewChild('messageContainer') messageContainer: ElementRef | undefined;
  @ViewChild('messageInput') messageInput: ElementRef | undefined;
  
  messages:any[]=[];
  chatForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2
    ) {
    this.chatForm = this.formBuilder.group({
      message: [''] 
    });
  }

  ngOnInit(): void {
    this.onInit()
  }
  sendMessage(): void {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      this.messages.push(message); 
      this.chatForm.reset();
      this.scrollMessageIntoView();
    }
  }

  scrollMessageIntoView(): void {
    setTimeout(() => {
      if (this.messageContainer && this.messageContainer.nativeElement) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    });
  }
  onInit(){
    this.chatForm = this.formBuilder.group({
      message: ['', Validators.required] 
    });
    if (this.messageInput && this.messageInput.nativeElement) {
      this.renderer.selectRootElement(this.messageInput.nativeElement).focus();
    }
  }
}
