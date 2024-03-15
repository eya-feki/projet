import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { observable } from 'mobx';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
export type MenuItem = {
  icon: string;
  label: string;
  route: string;
};
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit{
  username?: string; // Initialisez les propriétés ou déclarez-les comme optionnelles en ajoutant ? après leur nom
  email?: string;
  profilePicUrl?: string = "assets/images/user.png";
  roles: string[] = [];
  isLoggedIn = false;
  sideNavCollapsed = signal(false);
  @Input() set isCollapsed(val: boolean){
    this.sideNavCollapsed.set(val)
  }
  @observable menuItems: MenuItem[] = [
    {
      icon: 'home',
      label: 'Home',
      route: 'home'
    },
    {
      icon: 'person',
      label: 'Profil',
      route: 'profile'
    },
    {
      icon: 'list',
      label: 'List',
      route: 'list'
    },
    {
      icon: 'preview',
      label: 'damande congé',
      route: 'congé'
    },
    {
      icon: 'maps',
      label: 'map',
      route: 'maps'
    }
  ];
  profilePicSize = computed(() => this.sideNavCollapsed() ? '50' : '100')
  constructor(private tokenStorageService: TokenStorageService
  ) {}
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.profilePicUrl = user.profilePicUrl;
      this.username = user.username;
      this.email = user.email

    }
  }
  getProfileImage(): string {
    if (this.profilePicUrl) {
      return this.profilePicUrl;
    } else {
      const firstLetter = this.username ? this.username.charAt(0).toUpperCase() : '';
      const size = this.isCollapsed ? '32' : '100';
      return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&color=fff&size=${size}`;
    }
  }
  
}
