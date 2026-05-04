import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar';
import { ToastService } from './services/toast';
import { CommonModule } from '@angular/common';
import { NgZone, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('frontend');

  toastMessage: string = '';
  private toastTimeout: any; // 🔥 IMPORTANT

  constructor(
  private toastService: ToastService,
  private ngZone: NgZone,
  private cdr: ChangeDetectorRef
) {

  this.toastService.toast$.subscribe((msg) => {

    if (!msg) return;

    this.ngZone.run(() => {

      this.toastMessage = msg;

      this.cdr.detectChanges(); // 🔥 FORCE FIRST RENDER

      clearTimeout(this.toastTimeout);

      this.toastTimeout = setTimeout(() => {
        this.toastMessage = '';
        this.cdr.detectChanges(); // 🔥 FORCE CLEANUP RENDER
      }, 2000);

    });

  });

}
}
