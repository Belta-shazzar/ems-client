import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './chat.html',
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  employees: any[] = [];
  selectedUser: any = null;
  messages: any[] = [];
  newMessage = '';
  currentUser: any;
  onlineUsers: Set<string> = new Set();

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private chatService: ChatService
  ) {
    this.currentUser = this.authService.currentEmployeeValue;
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.setupChatListeners();
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  private async loadEmployees() {
    try {
      // Load employees with roles lower than or equal to current user
      const allEmployees = await this.employeeService
        .getAllEmployees()
        .toPromise();
      this.employees = allEmployees?.filter(
        (emp: any) =>
          emp.id !== this.currentUser.userId &&
          this.hasPermissionToMessage(emp.role)
      ) || [];
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  private hasPermissionToMessage(role: string): boolean {
    const currentUserRole = this.currentUser.role;
    const roleOrder = ['EMPLOYEE', 'MANAGER', 'ADMIN'];
    return roleOrder.indexOf(role) <= roleOrder.indexOf(currentUserRole);
  }

  private setupChatListeners() {
    // Listen for new messages
    this.chatService.onMessage().subscribe((message: any) => {
      if (
        (message.senderId === this.selectedUser?.id &&
          message.recipientId === this.currentUser.userId) ||
        (message.recipientId === this.selectedUser?.id &&
          message.senderId === this.currentUser.userId)
      ) {
        this.messages.push({
          ...message,
          timestamp: new Date(),
        });
      }
    });

    // Listen for user status changes
    this.chatService.onUserStatusChange().subscribe((data: any) => {
      if (data.isOnline) {
        this.onlineUsers.add(data.userId);
      } else {
        this.onlineUsers.delete(data.userId);
      }
    });

    // Get initial online users
    this.chatService.getOnlineUsers().then((userIds: string[]) => {
      this.onlineUsers = new Set(userIds);
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.loadMessages();
  }

  private async loadMessages() {
    if (!this.selectedUser) return;

    try {
      const messages = await this.chatService
        .getMessages(this.selectedUser.id)
        .toPromise();
      this.messages = (messages ?? []).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const message = {
      content: this.newMessage,
      recipientId: this.selectedUser.id,
      senderId: this.currentUser.userId,
      senderName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      timestamp: new Date(),
    };

    this.chatService.sendMessage(message);
    this.messages.push(message);
    this.newMessage = '';
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }
}
