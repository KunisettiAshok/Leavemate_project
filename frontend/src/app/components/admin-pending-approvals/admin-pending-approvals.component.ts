import { Component } from '@angular/core';
import { LeaveService } from 'src/app/services/leave.service';

@Component({
  selector: 'app-admin-pending-approvals',
  templateUrl: './admin-pending-approvals.component.html',
  styleUrl: './admin-pending-approvals.component.scss'
})
export class AdminPendingApprovalsComponent {

  rows: any[] = [];
  msg = '';
  err = '';
  baseUrl = 'http://10.70.9.160:3000';

  selectedFile: string | null = null;

  constructor(private leave: LeaveService) { }

  ngOnInit() {
    this.load();
  }

  viewAttachment(file: string) {
    this.selectedFile = file;
  }

  isImage(file: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
  }

  isPdf(file: string): boolean {
    return /\.pdf$/i.test(file);
  }

  load() {
    this.leave.adminApprovals().subscribe({
      next: (r) => this.rows = r || [],
      error: (e) => this.err = e?.error?.message || 'Failed to load approvals'
    });
  }

  // FIXED HERE
  act(id: string, status: 'approved' | 'rejected') {
    this.msg = '';
    this.err = '';

    console.log("Sending ID:", id); // debug

    this.leave.updateApproval(id, status).subscribe({
      next: (r: any) => {
        this.msg = r.message || 'Updated successfully';
        this.load();
      },
      error: (e) => this.err = e?.error?.message || 'Failed to update'
    });
  }

  calcDays(start: string, end: string) {
    if (!start || !end) return 1;
    const d1 = new Date(start).getTime();
    const d2 = new Date(end).getTime();
    return Math.max(Math.round((d2 - d1) / (1000 * 3600 * 24)) + 1, 1);
  }
}