import { Routes } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { LoginComponent } from './start-screen/login/login.component';
import { SignInComponent } from './start-screen/sign-in/sign-in.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ChooseAvatarComponent } from './start-screen/choose-avatar/choose-avatar.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: 'choose-avatar', component: ChooseAvatarComponent },
    { path: 'home/:id', component: HomeScreenComponent },
    { path: 'home', component: HomeScreenComponent },
    { path: 'legal-notice', component: LegalNoticeComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent }
];
