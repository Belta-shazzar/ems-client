// src/app/core/services/chat.service.ts
import { Injectable } from '@angular/core';
import { Observable, Subject, from, of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket$: WebSocketSubject<any> | null = null;
  private messageSubject = new Subject<any>();
  private statusSubject = new Subject<any>();
  private connected = false;

  constructor(private authService: AuthService) {
    this.connect();
  }

  public connect(): void {
    if (this.connected) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    this.socket$ = webSocket({
      url: `${environment.wsUrl}/chat?token=${token}`,
      openObserver: {
        next: () => {
          this.connected = true;
          console.log('WebSocket connection established');
        },
      },
      closeObserver: {
        next: () => {
          this.connected = false;
          console.log('WebSocket connection closed');
          // Attempt to reconnect after a delay
          setTimeout(() => this.connect(), 5000);
        },
      },
    });

    this.socket$.subscribe({
      next: (message) => this.handleIncomingMessage(message),
      error: (err) => {
        console.error('WebSocket error:', err);
        this.connected = false;
        // Attempt to reconnect on error
        setTimeout(() => this.connect(), 5000);
      },
    });
  }

  private handleIncomingMessage(message: any): void {
    switch (message.type) {
      case 'message':
        this.messageSubject.next(message.data);
        break;
      case 'userStatus':
        this.statusSubject.next(message.data);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  sendMessage(message: any): void {
    if (!this.connected || !this.socket$) {
      console.error('WebSocket is not connected');
      return;
    }

    this.socket$.next({
      type: 'message',
      data: {
        content: message.content,
        recipientId: message.recipientId,
      },
    });
  }

  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  onUserStatusChange(): Observable<any> {
    return this.statusSubject.asObservable();
  }

  getOnlineUsers(): Promise<string[]> {
    // In a real app, this would come from the server
    // For now, we'll return an empty array
    return Promise.resolve([]);
  }

  getMessages(userId: string): Observable<any[]> {
    // In a real app, this would fetch messages from the server
    // For now, we'll return an empty array
    return of([]);
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
      this.connected = false;
    }
  }
}
