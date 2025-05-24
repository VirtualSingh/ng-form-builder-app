import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Form Builder Dashboard</h1>
          <div class="user-menu">
            <span *ngIf="user$ | async as user" class="welcome-text">
              Welcome, {{ user.displayName || user.email }}!
            </span>
            <button (click)="logout()" class="logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="dashboard-content">
          <div class="welcome-section">
            <h2>Welcome to your Form Builder</h2>
            <p>Start creating amazing forms with our intuitive drag-and-drop interface.</p>
          </div>

          <div class="quick-actions">
            <div class="action-card">
              <h3>Create New Form</h3>
              <p>Build a new form from scratch</p>
              <button class="action-btn primary">New Form</button>
            </div>

            <div class="action-card">
              <h3>My Forms</h3>
              <p>View and edit your existing forms</p>
              <button class="action-btn secondary">View Forms</button>
            </div>

            <div class="action-card">
              <h3>Templates</h3>
              <p>Start with pre-built templates</p>
              <button class="action-btn secondary">Browse Templates</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f8fafc;
    }

    .dashboard-header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 0 20px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      height: 70px;
    }

    .dashboard-header h1 {
      color: #1e293b;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .welcome-text {
      color: #64748b;
      font-weight: 500;
    }

    .logout-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .logout-btn:hover {
      background: #dc2626;
    }

    .dashboard-main {
      padding: 40px 20px;
    }

    .dashboard-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 50px;
    }

    .welcome-section h2 {
      color: #1e293b;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 12px 0;
    }

    .welcome-section p {
      color: #64748b;
      font-size: 18px;
      margin: 0;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }

    .action-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .action-card h3 {
      color: #1e293b;
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }

    .action-card p {
      color: #64748b;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }

    .action-btn {
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .action-btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .action-btn.secondary {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .action-btn.secondary:hover {
      background: #e2e8f0;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        height: auto;
        padding: 20px 0;
        gap: 15px;
      }

      .quick-actions {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .welcome-section h2 {
        font-size: 28px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(
    private authService: UserAuthService,
    private router: Router
  ) {
    this.user$ = this.authService.getCurrentUser();
  }

  ngOnInit() {
    // Check if user is authenticated
    this.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/auth']);
      }
    });
  }

  logout() {
    this.authService.signOut().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}