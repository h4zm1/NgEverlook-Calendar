import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }
  themeSignal = signal<String>("light");

  setTheme(theme: String) {
    this.themeSignal.set(theme);
  }
  updateTheme() {
    this.themeSignal.update((value) => (value === "light" ? "dark" : "light"));
  }
}
