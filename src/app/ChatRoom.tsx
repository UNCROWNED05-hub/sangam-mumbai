import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plan } from '../data/plans';
import { useAppStore } from '../store/useAppStore';
import { getPerson, CURRENT_USER } from '../data/people';
import { ChatMessage, AUTO_REPLY_POOL } from '../data/chats';
import { Avatar } from '../ui/Avatar';
import {
  Send,
  X,
  MapPin,
  Clock,
  Users,
  Smile,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface ChatRoomProps {
  plan: Plan;
  onClose: () => void;
  className?: string;
}

const QUICK_REACTION_EMOJIS = ['👍', '❤️', '🔥', '🏸', '☕', '🎉'];

export const ChatRoom: React.FC<ChatRoomProps> = ({
  plan,
  onClose,
  className = '',
}) => {
  const { chats, sendMessage, addReaction, votePoll } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingName, setTypingName] = useState('');
  const [showScrollBottomPill, setShowScrollBottomPill] = useState(false);
  const [activeReactionPickerMessageId, setActiveReactionPickerMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const messages: ChatMessage[] = chats[plan.id] || [
    {
      id: `sys_welcome_${plan.id}`,
      senderId: 'system',
      senderName: 'System',
      text: `Welcome to "${plan.title}" group chat! Say hello to the crew.`,
      time: 'Just now',
      isSystem: true,
    },
  ];

  // Auto scroll logic
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    if (!showScrollBottomPill) {
      scrollToBottom(false);
    }
  }, [messages.length]);

  const handleScroll = () => {
    if (!chatScrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatScrollContainerRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 120;
    setShowScrollBottomPill(isScrolledUp);
  };

  // Send message with scripted auto-reply
  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    sendMessage(plan.id, text);
    setInputText('');
    setShowScrollBottomPill(false);
    setTimeout(() => scrollToBottom(true), 50);

    // Auto reply simulation: 900 to 2200ms
    const otherMembers = plan.goingIds.filter((id) => id !== CURRENT_USER.id);
    if (otherMembers.length > 0) {
      const responderId = otherMembers[Math.floor(Math.random() * otherMembers.length)];
      const responder = getPerson(responderId);
      const replyDelay = 900 + Math.floor(Math.random() * 1300);

      setTimeout(() => {
        setIsTyping(true);
        setTypingName(responder.name.split(' ')[0]);

        setTimeout(() => {
          setIsTyping(false);
          const replyText =
            AUTO_REPLY_POOL[Math.floor(Math.random() * AUTO_REPLY_POOL.length)];
          const replyMessage: ChatMessage = {
            id: `m_${Date.now()}`,
            senderId: responder.id,
            senderName: responder.name,
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          const curChats = { ...useAppStore.getState().chats };
          const curPlanMsgs = curChats[plan.id] ? [...curChats[plan.id]] : [];
          curChats[plan.id] = [...curPlanMsgs, replyMessage];
          useAppStore.setState({ chats: curChats });

          setTimeout(() => scrollToBottom(true), 50);
        }, 1100);
      }, replyDelay);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      data-lenis-prevent
      className={`fixed inset-y-0 right-0 z-40 w-full lg:w-[440px] bg-paper dark:bg-night border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden max-h-[100dvh] ${className}`}
    >
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-black/10 dark:border-white/10 bg-paper/85 dark:bg-night/85 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl flex-shrink-0">{plan.emoji}</span>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-sm text-ink dark:text-white truncate">
              {plan.title}
            </h3>
            <p className="text-xs text-ink-muted flex items-center gap-1.5">
              <Users className="w-3 h-3 text-lagoon" />
              <span>{plan.goingIds.length} members</span>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close chat"
          className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all text-ink dark:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Pinned Where / When Strip */}
      <div className="px-4 py-2 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-ink-soft dark:text-ink-muted">
        <div className="flex items-center gap-1.5 truncate max-w-[200px]">
          <MapPin className="w-3.5 h-3.5 text-bougainvillea flex-shrink-0" />
          <span className="truncate font-medium">{plan.place.name}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Clock className="w-3.5 h-3.5 text-marigold" />
          <span className="font-medium">
            {plan.startsInMin <= 0 ? 'Live now' : `In ${plan.startsInMin}m`}
          </span>
        </div>
      </div>

      {/* Message List */}
      <div
        ref={chatScrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar relative"
      >
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[11px] font-semibold text-ink-muted">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isMe = msg.senderId === CURRENT_USER.id;
          const sender = isMe ? CURRENT_USER : getPerson(msg.senderId);

          return (
            <div
              key={msg.id}
              className={`group flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isMe && (
                <Avatar person={sender} size="xs" showVerifiedRing />
              )}

              <div
                className={`max-w-[78%] relative ${
                  isMe ? 'items-end' : 'items-start'
                } flex flex-col`}
              >
                {!isMe && (
                  <span className="text-[10px] font-bold text-ink-muted px-1 mb-0.5">
                    {msg.senderName}
                  </span>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs relative ${
                    isMe
                      ? 'bg-ink text-white rounded-br-xs dark:bg-marigold dark:text-ink'
                      : 'bg-white dark:bg-night/90 text-ink dark:text-white border border-black/5 dark:border-white/10 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Poll Component inside message */}
                  {msg.poll && (
                    <div className="mt-2.5 pt-2.5 border-t border-black/10 dark:border-white/10 space-y-2">
                      <p className="font-bold text-xs">{msg.poll.question}</p>
                      <div className="space-y-1.5">
                        {msg.poll.options.map((opt, idx) => {
                          const totalVotes = msg.poll!.options.reduce((acc, o) => acc + o.votes, 0) || 1;
                          const pct = Math.round((opt.votes / totalVotes) * 100);

                          return (
                            <button
                              key={idx}
                              onClick={() => votePoll(plan.id, msg.id, idx)}
                              className={`w-full relative overflow-hidden rounded-xl p-2 text-left text-xs font-semibold border transition-all ${
                                opt.votedByMe
                                  ? 'border-marigold bg-marigold/10'
                                  : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                            >
                              {/* Animated fill bar */}
                              <div
                                className="absolute inset-y-0 left-0 bg-marigold/20 dark:bg-marigold/30 transition-all duration-500 rounded-xl"
                                style={{ width: `${pct}%` }}
                              />
                              <div className="relative flex justify-between items-center z-10">
                                <span className="flex items-center gap-1.5">
                                  {opt.votedByMe && <CheckCircle2 className="w-3.5 h-3.5 text-marigold" />}
                                  {opt.text}
                                </span>
                                <span className="font-mono text-[10px] text-ink-muted">
                                  {pct}% ({opt.votes})
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isMe ? 'text-white/60 dark:text-ink/60' : 'text-ink-muted'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {/* Reaction Pills */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {msg.reactions.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => addReaction(plan.id, msg.id, r.emoji)}
                        className={`px-1.5 py-0.5 rounded-full text-[10px] border flex items-center gap-1 active:scale-95 transition-all ${
                          r.byMe
                            ? 'bg-marigold/20 border-marigold text-ink dark:text-marigold'
                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-ink-muted'
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span className="font-bold">{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Add Reaction Button on Hover */}
                <div
                  className={`opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 ${
                    isMe ? '-left-7' : '-right-7'
                  }`}
                >
                  <button
                    onClick={() =>
                      setActiveReactionPickerMessageId(
                        activeReactionPickerMessageId === msg.id ? null : msg.id
                      )
                    }
                    className="w-6 h-6 rounded-full bg-white dark:bg-night shadow-xs border border-black/10 dark:border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 text-ink-muted hover:text-ink transition-all"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reaction Picker Popover */}
                {activeReactionPickerMessageId === msg.id && (
                  <div className="absolute top-8 z-30 p-1.5 rounded-2xl bg-paper dark:bg-night border border-black/10 dark:border-white/10 shadow-lg flex items-center gap-1">
                    {QUICK_REACTION_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          addReaction(plan.id, msg.id, emoji);
                          setActiveReactionPickerMessageId(null);
                        }}
                        className="w-7 h-7 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-sm hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-ink-muted italic py-1">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-lagoon animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-lagoon animate-bounce"
                style={{ animationDelay: '0.15s' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-lagoon animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
              <span className="ml-1 text-[11px] not-italic font-semibold text-ink-soft dark:text-ink-muted">
                {typingName} is typing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll to Bottom Pill */}
      {showScrollBottomPill && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => {
              scrollToBottom(true);
              setShowScrollBottomPill(false);
            }}
            className="px-3 py-1.5 rounded-full bg-ink dark:bg-marigold text-white dark:text-ink text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <span>New messages</span>
          </button>
        </div>
      )}

      {/* Input Box Footer */}
      <div className="p-3 sm:p-4 border-t border-black/10 dark:border-white/10 bg-paper/90 dark:bg-night/90 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-2xl px-3 py-1.5 border border-black/5 dark:border-white/10 focus-within:border-lagoon transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message the crew... (Enter to send)"
            className="flex-1 bg-transparent py-1.5 text-xs sm:text-sm text-ink dark:text-white placeholder:text-ink-muted focus:outline-hidden"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            aria-label="Send message"
            className="w-8 h-8 rounded-full bg-lagoon text-white flex items-center justify-center disabled:opacity-30 hover:brightness-105 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
