import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
