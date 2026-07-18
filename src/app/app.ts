import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'; // এটি ইমপোর্ট করা হলো

@Component({
  standalone: true,
  imports: [RouterModule, ToastModule],
  providers: [MessageService], // এখানে প্রোভাইডারটি যুক্ত করা হলো
  selector: 'app-root',
  template: `
    <p-toast position="top-right"></p-toast> 
    <router-outlet></router-outlet>
  `
})
export class App {
  // এখানে আর কোনো api call বা onInit থাকবে না
}