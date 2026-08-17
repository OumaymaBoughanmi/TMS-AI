import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatConversation, ChatMessageData } from '../../services/chatbot';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot implements OnInit {
  conversations: ChatConversation[] = [];
  activeConversation: ChatConversation | null = null;
  currentQuestion = '';
  isLoading = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    this.loadConversations();
  }

  loadConversations() {
    this.chatbotService.getConversations().subscribe((data) => {
      this.conversations = data;

      // Auto-select the most recent conversation, or create one if none exist
      if (data.length > 0) {
        this.selectConversation(data[0]);
      } else {
        this.startNewConversation();
      }
    });
  }

  selectConversation(conversation: ChatConversation) {
    this.chatbotService.getConversation(conversation.id).subscribe((full) => {
      this.activeConversation = full;
    });
  }

  startNewConversation() {
    this.chatbotService.createConversation().subscribe((newConv) => {
      this.conversations.unshift(newConv);
      this.activeConversation = newConv;
    });
  }

  deleteConversation(conversation: ChatConversation, event: Event) {
    event.stopPropagation();
    const confirmed = confirm(`Delete conversation "${conversation.title}"?`);
    if (!confirmed) return;

    this.chatbotService.deleteConversation(conversation.id).subscribe(() => {
      this.conversations = this.conversations.filter((c) => c.id !== conversation.id);

      if (this.activeConversation?.id === conversation.id) {
        if (this.conversations.length > 0) {
          this.selectConversation(this.conversations[0]);
        } else {
          this.startNewConversation();
        }
      }
    });
  }

  sendMessage() {
    const question = this.currentQuestion.trim();
    if (!question || this.isLoading || !this.activeConversation) return;

    const userMessage: ChatMessageData = {
      role: 'user',
      text: question,
      timestamp: new Date().toISOString(),
    };
    this.activeConversation.messages.push(userMessage);

    this.currentQuestion = '';
    this.isLoading = true;

    this.chatbotService.ask(question, this.activeConversation.id).subscribe({
      next: (response) => {
        this.activeConversation!.messages.push({
          role: 'assistant',
          text: response.answer,
          timestamp: new Date().toISOString(),
        });
        this.isLoading = false;

        // Refresh sidebar list (title may have auto-updated, order may have changed)
        this.chatbotService.getConversations().subscribe((data) => {
          this.conversations = data;
        });
      },
      error: () => {
        this.activeConversation!.messages.push({
          role: 'assistant',
          text: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        });
        this.isLoading = false;
      }
    });
  }
}