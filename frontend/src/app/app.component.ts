import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionWarningComponent } from './shared/components/session-warning/session-warning.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SessionWarningComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Tu Visión';
}
