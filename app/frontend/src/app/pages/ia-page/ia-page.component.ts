import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Generic } from '../../consumer/generic.model';
import { IaService } from '../../consumer/ia.service';
import { AuthService } from '../../keycloak/auth.service';

@Component({
  selector: 'app-ia-page',
  templateUrl: './ia-page.component.html',
  styleUrls: ['./ia-page.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class IaPageComponent implements OnInit {
  iaList: Generic[] = [];

  constructor(private iaService: IaService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.getAll();
    this.authService.getUserProfile().then( (data : any) => console.table(data));
  }

  logout() {
    this.authService.logout();
  }

  private getById(id: number) {
    this.iaService.getById(id).subscribe({
      next: (ia: Generic) =>  console.log('Recieved movie', ia),
      error: (error: any) => console.log(error)
    });
  }

  getAll() {
    this.iaService.getAll().subscribe({
      next: (iaList: Generic[]) =>  this.iaList = iaList,
      error: (error: any) => console.log(error)
    });
  }

  public onSearchChange(event: any) {
    this.getById(event.target.value);
  }

}
