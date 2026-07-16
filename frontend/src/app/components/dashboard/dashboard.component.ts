import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  qrData = '';
  today = new Date().toISOString().slice(0, 10);

  // ✅ FIXED DEFAULT VALUE
  leaveBalance: any = { sick: 0, casual: 0, earned: 0 };

  constructor(
    public auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const empId = user?.empId || '';

    this.qrData = JSON.stringify({
      empId: empId,
      log_date: this.today,
      token: localStorage.getItem('token'),
    });

    this.loadBalance();
  }

  loadBalance() {
    this.http.get<any>('http://localhost:3000/api/profile/balance', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).subscribe({
      next: (data) => {
        console.log('Balance:', data);
        this.leaveBalance = data;
      },
      error: (err) => console.error(err)
    });
  }
}