import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SharedModule } from '../../common/shared/shared.module';

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
    imports: [HeaderComponent, SidebarComponent, FooterComponent,SharedModule]
})
export class LayoutComponent {

}
