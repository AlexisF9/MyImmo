import { Component, input, output } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-button',
  imports: [LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  label = input.required<string>()
  clicked = output<void>()
  icon = input<LucideIconData | undefined>(undefined)
  iconPosition = input<"right" | "left" | null>(null)

  onClick(): void {
    this.clicked.emit();
  }
}
