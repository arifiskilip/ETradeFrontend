import { Component } from '@angular/core';
import { SharedModule } from '../../../../common/shared/shared.module';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  activeItem:string = "dashboard";


  setActiveItem(item:string){
    this.activeItem = item;
  }
}
