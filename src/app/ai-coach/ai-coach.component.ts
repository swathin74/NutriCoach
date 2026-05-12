import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoachService } from '../core/services/coach.service';
import { CoachChatResponse } from '../shared/models/models';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const QUICK_CHIPS = [
  'Analyze my meals today',
  'Suggest a high-protein dinner',
  'How do I hit my protein goal?',
  'What should I eat for a snack?',
  'Give me a weekly summary'
];

@Component({
  selector: 'app-ai-coach',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">

      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">AI Coach</h1>
          <p class="page-subtitle">Powered by Claude · Knows your nutrition history</p>
        </div>
        <div class="status-pill">
          <span class="status-dot"></span> Online
        </div>
      </div>

      <div class="coach-layout">

        <!-- Chat panel -->
        <div class="card chat-card">

          <!-- Quick chips -->
          <div class="chips-row">
            <button
              class="chip"
              *ngFor="let chip of chips"
              (click)="sendChip(chip)"
              [disabled]="loading"
            >{{ chip }}</button>
          </div>

          <!-- Messages -->
          <div class="messages" #messagesContainer>
            <div
              class="msg-wrap"
              *ngFor="let msg of messages"
              [class.user-wrap]="msg.role === 'user'"
            >
              <!-- Avatar -->
              <div class="msg-avatar" [class.ai-avatar]="msg.role === 'assistant'">
                {{ msg.role === 'assistant' ? 'NC' : 'AJ' }}
              </div>

              <!-- Bubble -->
              <div class="msg-bubble" [class.user-bubble]="msg.role === 'user'">
                <div class="msg-text" [innerHTML]="msg.text"></div>
                <div class="msg-time">{{ msg.time }}</div>
              </div>
            </div>

            <!-- Typing indicator -->
            <div class="msg-wrap" *ngIf="loading">
              <div class="msg-avatar ai-avatar">NC</div>
              <div class="msg-bubble typing-bubble">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="input-row">
            <input
              #msgInput
              class="msg-input"
              type="text"
              [(ngModel)]="inputText"
              placeholder="Ask your coach anything…"
              (keydown.enter)="send()"
              [disabled]="loading"
            />
            <button
              class="send-btn"
              (click)="send()"
              [disabled]="!inputText.trim() || loading"
            >↑</button>
          </div>

        </div>

        <!-- Side panel -->
        <div class="side-panel">

          <div class="card side-card">
            <div class="card-title">Your goals</div>
            <div class="goal-list">
              <div class="goal-row"><span>🎯 Goal</span><strong>Weight loss</strong></div>
              <div class="goal-row"><span>⚡ Calories</span><strong>2,100 kcal</strong></div>
              <div class="goal-row"><span>💪 Protein</span><strong>150g / day</strong></div>
              <div class="goal-row"><span>📅 Active since</span><strong>Apr 28</strong></div>
            </div>
          </div>

          <div class="card side-card">
            <div class="card-title">This week</div>
            <div class="goal-list">
              <div class="goal-row"><span>Avg calories</span><strong>1,940</strong></div>
              <div class="goal-row"><span>Avg protein</span><strong>118g</strong></div>
              <div class="goal-row"><span>Best day</span><strong style="color:var(--nc-green)">Thursday</strong></div>
              <div class="goal-row"><span>Needs work</span><strong style="color:var(--nc-coral)">Fiber</strong></div>
            </div>
          </div>

          <div class="card side-card">
            <div class="card-title">Today so far</div>
            <div class="goal-list">
              <div class="goal-row"><span>Calories</span><strong>1,480 / 2,100</strong></div>
              <div class="goal-row"><span>Protein</span><strong>82 / 150g</strong></div>
              <div class="goal-row"><span>Meals logged</span><strong>3 of 4</strong></div>
            </div>
            <div class="bar-track" style="margin-top:10px">
              <div class="bar-fill" style="width:70%;background:var(--nc-green)"></div>
            </div>
            <div style="font-size:11px;color:var(--nc-text-muted);margin-top:4px">70% of daily calories</div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .coach-layout {
      display: grid;
      grid-template-columns: 1fr 260px;
      gap: 16px;
      align-items: start;
    }

    /* Status */
    .status-pill {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; color: var(--nc-green);
      background: var(--nc-green-light);
      padding: 5px 12px; border-radius: 20px; font-weight: 500;
    }
    .status-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--nc-green);
      animation: pulse 1.8s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    /* Chat card */
    .chat-card {
      display: flex; flex-direction: column;
      height: calc(100vh - 160px);
      min-height: 500px;
      padding: 16px;
    }

    /* Chips */
    .chips-row {
      display: flex; gap: 7px; flex-wrap: wrap;
      margin-bottom: 14px; padding-bottom: 14px;
      border-bottom: 1px solid var(--nc-border);
    }
    .chip {
      padding: 5px 13px; border-radius: 20px; font-size: 12px;
      border: 1px solid var(--nc-border); background: transparent;
      cursor: pointer; font-family: var(--font); color: var(--nc-text-muted);
      transition: all 0.15s;
      &:hover:not([disabled]) { border-color: var(--nc-green); color: var(--nc-green); background: var(--nc-green-light); }
      &[disabled] { opacity: 0.5; cursor: not-allowed; }
    }

    /* Messages */
    .messages {
      flex: 1; overflow-y: auto;
      padding: 4px 0; margin-bottom: 14px;
      display: flex; flex-direction: column; gap: 16px;
    }
    .msg-wrap {
      display: flex; align-items: flex-end; gap: 8px;
      &.user-wrap { flex-direction: row-reverse; }
    }
    .msg-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: #f3f4f6; color: var(--nc-text-muted);
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 600; flex-shrink: 0;
    }
    .ai-avatar { background: var(--nc-green-light); color: var(--nc-green-dark); }

    .msg-bubble {
      max-width: 75%;
      background: #f3f4f6;
      padding: 10px 14px;
      border-radius: 16px 16px 16px 4px;
      font-size: 14px; line-height: 1.55;
    }
    .user-bubble {
      background: var(--nc-green);
      color: white;
      border-radius: 16px 16px 4px 16px;
    }
    .msg-text { margin-bottom: 4px; }
    .msg-time { font-size: 10px; opacity: 0.6; text-align: right; }

    /* Typing */
    .typing-bubble {
      display: flex; align-items: center; gap: 4px;
      padding: 12px 16px; border-radius: 16px 16px 16px 4px;
    }
    .dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--nc-text-muted);
      animation: bounce 1.2s ease-in-out infinite;
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    /* Input */
    .input-row {
      display: flex; gap: 8px;
      border-top: 1px solid var(--nc-border); padding-top: 14px;
    }
    .msg-input {
      flex: 1; padding: 10px 16px;
      border: 1px solid var(--nc-border); border-radius: 24px;
      font-size: 14px; font-family: var(--font);
      background: #f9fafb;
      transition: border-color 0.15s, box-shadow 0.15s;
      &:focus { outline: none; border-color: var(--nc-green); box-shadow: 0 0 0 3px rgba(29,158,117,0.1); background: white; }
      &:disabled { opacity: 0.6; }
    }
    .send-btn {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--nc-green); color: white; border: none;
      font-size: 18px; cursor: pointer; flex-shrink: 0;
      transition: background 0.15s, transform 0.1s;
      &:hover:not([disabled]) { background: var(--nc-green-dark); }
      &:active { transform: scale(0.95); }
      &[disabled] { opacity: 0.4; cursor: not-allowed; }
    }

    /* Side panel */
    .side-panel { display: flex; flex-direction: column; gap: 14px; }
    .side-card { padding: 14px 16px; }
    .goal-list { display: flex; flex-direction: column; gap: 8px; }
    .goal-row {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 13px;
      span { color: var(--nc-text-muted); }
      strong { font-weight: 500; }
    }
  `]
})
export class AiCoachComponent implements OnInit, AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  inputText = '';
  loading   = false;
  chips     = QUICK_CHIPS;

  private shouldScroll = false;

  constructor(private coachService: CoachService) {}

  ngOnInit(): void {
    this.coachService.getHistory().subscribe(history => {
      this.messages = history.map(m => this.toChat(m));
      this.shouldScroll = true;
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    this.messages.push({ role: 'user', text, time: this.nowTime() });
    this.inputText  = '';
    this.loading    = true;
    this.shouldScroll = true;

    this.coachService.sendMessage(text).subscribe({
      next: res => {
        this.messages.push(this.toChat(res));
        this.loading      = false;
        this.shouldScroll = true;
      },
      error: () => {
        this.messages.push({ role: 'assistant', text: 'Sorry, something went wrong. Please try again.', time: this.nowTime() });
        this.loading      = false;
        this.shouldScroll = true;
      }
    });
  }

  sendChip(chip: string): void {
    this.inputText = chip;
    this.send();
  }

  private toChat(res: CoachChatResponse): ChatMessage {
    return { role: res.role, text: res.message, time: this.nowTime() };
  }

  private nowTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }
}