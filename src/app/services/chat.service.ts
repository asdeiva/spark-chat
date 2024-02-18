import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private socket: Socket
  ) { }

  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  sendTypingStatus(status:boolean){
    this.socket.emit('typing-status',status);
  }
  
  getTypingStatus(){
    return this.socket.fromEvent('isTyping').pipe(map((data:any) => data));
  }

  getMessage() {
    return this.socket.fromEvent('received').pipe(map((data:any) => data));
  }
}
