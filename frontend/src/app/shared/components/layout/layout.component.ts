import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: ('admin' | 'vendedor')[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isMobile = false;
  private subscription = new Subscription();
  private authService = inject(AuthService);
  private router = inject(Router);

  navItems: NavItem[] = [
    { label: 'Órdenes de Trabajo', icon: 'clipboard', route: '/work-orders', roles: ['admin', 'vendedor'] },
    { label: 'Usuarios', icon: 'users', route: '/admin/users', roles: ['admin'] },
  ];

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  ngOnInit(): void {
    this.checkMobile();
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        if (this.isMobile) {
          this.isMobileMenuOpen = false;
        }
      })
    );
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get filteredNavItems(): NavItem[] {
    if (!this.currentUser) return [];
    return this.navItems.filter(item => 
      item.roles.includes(this.currentUser!.role)
    );
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
