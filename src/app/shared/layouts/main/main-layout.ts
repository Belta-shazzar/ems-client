import { Component, inject } from '@angular/core';
import { LucideAngularModule, LogOut, Menu, X } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeRole } from '../../../core/models/auth.model';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './main-layout.html',
})
export class Main {
  private authService = inject(AuthService);
  isSidebarOpen = true;
  isMobileMenuOpen = false;
  isSettinsMenuOpen = false;

  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly EmployeeRole = EmployeeRole;

  get currentUser() {
    return this.authService.currentEmployeeValue;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === EmployeeRole.ADMIN;
  }

  get isManager(): boolean {
    return this.currentUser?.role === EmployeeRole.MANAGER;
  }

  logout(): void {
    this.authService.logout();
  }

  // toggleSidebar(): void {
  //   this.isSidebarOpen = !this.isSidebarOpen;
  // }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleSettingsMenu(): void {
    this.isSettinsMenuOpen = !this.isSettinsMenuOpen;
  }
}
