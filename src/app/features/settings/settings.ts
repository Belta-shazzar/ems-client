import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    // RouterLink,
    // RouterLinkActive,
    RouterOutlet,
    LucideAngularModule,
  ],
  templateUrl: './settings.html',
})
export class Settings {}
