import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { nodeApi } from 'src/environments/environment.development';

export interface Announcement {
  id?: number;
  title: string;
  message: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})

export class AnnouncementsService {

  private apiUrl = `${nodeApi}/announcements`; //"/announcements";

  constructor(private http: HttpClient) { }

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

  addAnnouncement(announcement: Announcement): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, announcement);
  }

  deleteAnnouncement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
