import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../_services/loginService/auth.service';
import { TokenStorageService } from '../../_services/loginService/token-storage.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoreService } from '../../_services/core/core.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  signUpObj: any = {
    name: null,
    email: null,
    password: null
  };
  loginObj: any = {
    email: null,
    password: null
  };
  isSignDivVisible = false;
  isLoggedIn = false;
  isLoginFailed = false;
  isSuccessful = false; // Add this line
  isSignUpFailed = false; // Add this line
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private coreService: CoreService // Inject CoreService
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onRegister(): void {
    const { name, email, password } = this.signUpObj;
    this.authService.register(name, email, password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.isSignDivVisible = false;
        // Show success snackbar
        this.coreService.openSnackBar('Registration successful');
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        // Show error snackbar
        this.coreService.openSnackBar('Registration failed. Please try again.', 'Error');
      }
    );
  }

  onLogin(): void {
    const { email, password } = this.loginObj;
    this.authService.login(email, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigateByUrl('/home');
        // Show success snackbar
        this.coreService.openSnackBar('Login successful');
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        // Show error snackbar
        this.coreService.openSnackBar('Login failed. Please check your credentials.', 'Error');
      }
    );
  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const signInButton = document.getElementById('sign-in-button');
      const registerButton = document.getElementById('register-button');
      if (signInButton && registerButton) {
        if (signInButton.classList.contains('hidden')) {
          registerButton.click();
        }
      }
    }
  }
}