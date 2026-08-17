import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessageData {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: number;
  title: string;
  messages: ChatMessageData[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private conversationsUrl = 'http://localhost:3000/chat-conversations';
  private askUrl = 'http://localhost:3000/chatbot/ask';

  constructor(private http: HttpClient) {}

  getConversations(): Observable<ChatConversation[]> {
    return this.http.get<ChatConversation[]>(this.conversationsUrl);
  }

  getConversation(id: number): Observable<ChatConversation> {
    return this.http.get<ChatConversation>(`${this.conversationsUrl}/${id}`);
  }

  createConversation(): Observable<ChatConversation> {
    return this.http.post<ChatConversation>(this.conversationsUrl, {});
  }

  deleteConversation(id: number): Observable<any> {
    return this.http.delete(`${this.conversationsUrl}/${id}`);
  }

  ask(question: string, conversationId: number): Observable<{ answer: string }> {
    return this.http.post<{ answer: string }>(this.askUrl, { question, conversationId });
  }
}