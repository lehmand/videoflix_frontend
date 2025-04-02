import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { ForgotPageComponent } from './forgot-page/forgot-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'signup', component: SignupPageComponent},
    { path: 'forgot-password', component: ForgotPageComponent},
];
