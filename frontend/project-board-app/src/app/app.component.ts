import { Component, DoCheck, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { AuthConfig, JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import * as $ from 'jquery';
import { environment } from '../environments/environment';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { EmployeeService } from './_services/employee.service';
import { style } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, DoCheck {
  faChevronUp = faChevronUp;
  username = 'default';
  @ViewChild('snav') sidenav: MatSidenav;

  constructor(private oAuthService: OAuthService,
              private authenticationService: AuthenticationService,
              private employeeService: EmployeeService,
              private alertService: AlertService) {
    this.configureWithNewConfigApi();
  }

  private configureWithNewConfigApi() {
    this.oAuthService.configure(authConfig);
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndLogin();
  }

  /* Sidenav responsive */

  NavToggle() {

      if (this.sidenav.opened) {
        this.sidenav.close();
      } else {
        this.sidenav.open();
      }
  }

  openNav() {
    if (window.innerWidth < 992) {
      this.sidenav.open();
    }
  }

  closeNav() {
    if (window.innerWidth < 992) {
      this.sidenav.close();
    }
  }

  onNavOpen() {
    if (/Mobi/.test(navigator.userAgent)) {
      $('body').css('overflow', 'hidden');
      document.getElementById('top-badge').style.visibility = 'hidden';
    }
  }

  onNavClosed() {
    if (/Mobi/.test(navigator.userAgent)) {
      $('body').css('overflow', 'auto');
      document.getElementById('top-badge').style.visibility = 'visible';
    }
  }

  onResize() {
    this.sidenav.close();
    $('body').css('overflow', 'auto');
    document.getElementById('top-badge').style.visibility = 'visible';
    this.miniNavVisibility();
    this.mainNavPosition();
  }

  miniNavVisibility(){
    if (/Mobi/.test(navigator.userAgent) || (window.innerWidth < 992)) {
      document.getElementById("mini-nav").style.display = "none";
    } else {
      document.getElementById("mini-nav").style.display = "block";
    }
  }

  mainNavPosition() {
    if (!(/Mobi/.test(navigator.userAgent) || (window.innerWidth < 992))){
      document.getElementById("main-nav").style.position = "relative";
    } else {
      document.getElementById("main-nav").style.position = "sticky";
    }
  }

  getUsername() {
    return this.authenticationService.username;
  }

  ngOnInit() {
    this.sidenav.openedStart.subscribe(() => this.onNavOpen());
    this.sidenav.closedStart.subscribe(() => this.onNavClosed());
    this.miniNavVisibility();
    this.mainNavPosition(); 
  }

  ngDoCheck() {
    this.username = this.getUsername();
  }

  logout() {
    this.oAuthService.logOut();
    sessionStorage.clear();
    /* this.alertService.success('Du wurdest erfolgreich ausgeloggt.'); */
  }

  isUserAuthenticated() {
    return this.oAuthService.hasValidAccessToken();
  }

  get isAdmin() {
    return this.authenticationService.isAdmin;
  }

  get isBoss() {
    return this.employeeService.isUserBoss(this.authenticationService.username);
  }

  @HostListener('window:scroll') onScroll() {

    //Toggle for the mini-menu

      if (document.documentElement.scrollTop > 340) {  
        if((document.getElementById('mini-nav').offsetLeft === -45) && !($("#mini-nav").is(':animated'))){
        $("#mini-nav").animate({left: '0px'}, function() {
          if(document.documentElement.scrollTop <= 340) {
            $("#mini-nav").animate({left: '-45px'});
          }
        });
        }
      } else {
        if((document.getElementById('mini-nav').offsetLeft === 0) && !($("#mini-nav").is(':animated'))){
        $("#mini-nav").animate({left: '-45px'}, function() {
          if(document.documentElement.scrollTop > 340) {
          $("#mini-nav").animate({left: '0px'});
          }
        });
        }
      }

    if (/Mobi/.test(navigator.userAgent)) {
      // mobile!
      if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        document.getElementById('top-badge').style.setProperty('display', 'inline');
      } else {
        document.getElementById('top-badge').style.setProperty('display', 'none');
      }
    }
  }

  scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}

export const authConfig: AuthConfig = {

  // Url of the Identity Provider
  issuer: `${environment.authHost}/auth/realms/adesso`,

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/index.html',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: 'projekt-boerse-frontend',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email',
  oidc: true

  // requireHttps: false,
};
