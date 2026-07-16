import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { nodeApi } from 'src/environments/environment.development';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  
  private nodeApi = nodeApi;

  constructor(private http: HttpClient) {}

  // Apply Leave
  applyLeave(data: FormData): Observable<any> {
    return this.http.post(`${this.nodeApi}/leaves/applyleave`, data);
  }

  // My Leaves
  myLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.nodeApi}/leaves/myleaves`);
  }

  // Admin Pending
  adminApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.nodeApi}/leaves/pending`);
  }

  // Approve / Reject
  updateApproval(id: string, status: 'approved' | 'rejected', comment?: string) {
    return this.http.put(`${this.nodeApi}/${id}/leaves/status`, {
      status,
      manager_comment: comment || ''
    });
  }

  // Balance API
  getBalance(): Observable<any> {
    return this.http.get(`${nodeApi}/profile/balance`);
  }

  getApprovedLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.nodeApi}/leaves/approved`);
  }

  getRejectedLeaves(): Observable<any[]> {
    return this.http.get<any[]>(`${this.nodeApi}/leaves/rejected`);
  }
}