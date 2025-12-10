import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

type Theme = 'light' | 'dark' | 'system';

@Component({
  selector: 'app-appearance',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './appearance.html',
})
export class Appearance implements OnInit {
  theme = signal<Theme>('light');
  accentColor = signal('#3b82f6'); // Default blue-500
  accentColors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
  ];

  constructor() {
    // Load saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedColor = localStorage.getItem('accentColor');

    if (savedTheme) {
      this.theme.set(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme.set('system');
    }

    if (savedColor) {
      this.accentColor.set(savedColor);
    }

    // Apply theme on init and when theme changes
    this.applyTheme(this.theme());
    this.applyAccentColor(this.accentColor());

    // Watch for system theme changes when in system mode
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (this.theme() === 'system') {
          document.documentElement.classList.toggle('dark', e.matches);
        }
      });

    // Effect to watch for theme changes
    effect(() => {
      this.applyTheme(this.theme());
    });

    // Effect to watch for accent color changes
    effect(() => {
      this.applyAccentColor(this.accentColor());
    });
  }

  ngOnInit(): void {}

  setTheme(theme: Theme) {
    this.theme.set(theme);
    localStorage.setItem('theme', theme);
  }

  setAccentColor(color: string) {
    this.accentColor.set(color);
    localStorage.setItem('accentColor', color);
  }

  private applyTheme(theme: Theme) {
    const root = document.documentElement;

    if (theme === 'system') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }

  private applyAccentColor(color: string) {
    document.documentElement.style.setProperty('--color-primary-500', color);
    document.documentElement.style.setProperty(
      '--color-primary-600',
      this.adjustColor(color, -10)
    );
    document.documentElement.style.setProperty(
      '--color-primary-700',
      this.adjustColor(color, -20)
    );
  }

  private adjustColor(color: string, amount: number): string {
    // Simple color adjustment for hover states
    // This is a simplified version - you might want to use a proper color manipulation library
    const clamp = (num: number, min: number, max: number) =>
      Math.min(Math.max(num, min), max);

    // Convert hex to RGB
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Adjust brightness
    r = clamp(r + amount, 0, 255);
    g = clamp(g + amount, 0, 255);
    b = clamp(b + amount, 0, 255);

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}
