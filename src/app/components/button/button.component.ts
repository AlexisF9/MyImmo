import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  label = input.required<string>()
  clicked = output<void>()

  onClick(): void {
    this.clicked.emit();
  }
}
