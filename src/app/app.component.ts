import { Component } from '@angular/core';
import { LayoutComponent } from "./admin/layout/layout.component";
import { SharedModule } from './common/shared/shared.module';
import { NavbarComponent } from "./ui/components/navbar/navbar.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [LayoutComponent, SharedModule, NavbarComponent]
})
export class AppComponent {
  title = 'ETradeFrontend';
}
