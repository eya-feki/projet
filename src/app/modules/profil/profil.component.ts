import { Component, Input, signal } from '@angular/core';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {
  user = {
    name: 'John Doe',
    title: 'Software Developer',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.',
    profileImage: 'https://via.placeholder.com/150'
  };
  username?: string; // Initialisez les propriétés ou déclarez-les comme optionnelles en ajoutant ? après leur nom
  email?: string;
  profilePicUrl?: string = "assets/images/user.png";
  roles: string[] = [];
  isLoggedIn = false;
  sideNavCollapsed = signal(false);
 isCardActive : boolean = false;

  openCard() {
    console.log('Opening card...');
    this.isCardActive = true;
  }

  closeCard() {
    console.log('Closing card...');
    this.isCardActive = false;
  }
  
  @Input() set isCollapsed(val: boolean){
    this.sideNavCollapsed.set(val)
  }
  constructor(private tokenStorageService: TokenStorageService) {}
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

