import { Injectable, signal, inject } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private overlayContainer = inject(OverlayContainer);
  constructor() { }
  themeSignal = signal<String>("light");
  logger: LoggerService = inject(LoggerService);

  setTheme(theme: String) {
    this.themeSignal.set(theme);
    // force theme on CDK overlay container
    this.forceOverlayTheme()
  }
  updateTheme() {
    this.logger.log("THEME UPDATED")
    this.themeSignal.update((value) => (value === "light" ? "dark" : "light"));
    // force theme on CDK overlay container
    this.forceOverlayTheme()
  }
  forceOverlayTheme() {
    const currentTheme = this.themeSignal();

    // prevent having "light" and "dark" at same time
    document.body.classList.remove('light', 'dark');
    // this to make sure the theme is getting applied to CDK overlay container itself
    document.body.classList.add(currentTheme.toString());

    // get CDK overlay container element
    const overlayElement = this.overlayContainer.getContainerElement();
    // make sure to have either mods not both at same time
    overlayElement.classList.remove('light', 'dark');
    // this appy theme to element under CDK overlay
    overlayElement.classList.add(currentTheme.toString());

  }
}
