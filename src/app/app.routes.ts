import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { ForgotPageComponent } from './forgot-page/forgot-page.component';
import { ResetPageComponent } from './reset-page/reset-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ToastMessageComponent } from './shared/components/toast-message/toast-message.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'signup', component: SignupPageComponent},
    { path: 'main', component: MainPageComponent },
    { path: 'forgot-password', component: ForgotPageComponent },
    { path: 'reset-password', component: ResetPageComponent },
];
