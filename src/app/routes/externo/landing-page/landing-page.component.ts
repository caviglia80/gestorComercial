import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { GlobalVariables } from 'src/app/app.component';
import { TokenService } from '@services/token/token.service';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements AfterViewInit {
  public isNavbarOpen = false;
  public WspNumber = GlobalVariables.wspNumer;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngAfterViewInit(): void {
    // Navbar shrink function
    const navbarShrink = () => {
      const navbarCollapsible = document.body.querySelector('#mainNav');
      if (!navbarCollapsible) {
        return;
      }
      if (window.scrollY === 0) {
        navbarCollapsible.classList.remove('navbar-shrink');
      } else {
        navbarCollapsible.classList.add('navbar-shrink');
      }
    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
      new bootstrap.ScrollSpy(document.body, {
        target: '#mainNav',
        rootMargin: '0px 0px -40%',
      });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = Array.from(document.querySelectorAll('#navbarResponsive .nav-link'));
    responsiveNavItems.map((responsiveNavItem: Element) => {
      responsiveNavItem.addEventListener('click', () => {
        if (window.getComputedStyle(navbarToggler as Element).display !== 'none') {
          (navbarToggler as HTMLElement).click();
        }
      });
    });
  }

  navigateToSidebar(str: string) {
    this.router.navigate([str]);
  }

  login() {
    const token = localStorage.getItem('jwt');
    if (token && token.split('.').length === 3)
      if (!this.tokenService.isExpired(token)) {
        this.authService.refreshUserInfo().then(() => {
          const firstRoute = this.authService.getFirstEnabledRoute();
          this.router.navigate([firstRoute]);
        });
        return;
      }
    this.tokenService.logout();
  }
}
