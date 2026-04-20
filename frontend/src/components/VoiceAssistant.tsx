import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, X, Mic, MicOff, Send, Sparkles, Volume2 } from 'lucide-react';
import { getAIResponse, getQuickSuggestions } from '@/lib/aiAssistant';
import {
  getSpeechRecognitionConstructor,
  getSpeechRecognitionErrorMessage,
  isIgnorableSpeechError,
  isSpeechRecognitionSupported,
} from '@/lib/speechRecognition';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  type: 'user' | 'assistant';
  text: string;
}

const VoiceAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const speechSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Auto-send after speech recognition
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        if (isIgnorableSpeechError(event.error)) {
          return;
        }

        toast({
          title: event.error === "not-allowed" ? "Microphone Access Needed" : "Voice Input Unavailable",
          description: getSpeechRecognitionErrorMessage(event.error),
          variant: event.error === "not-allowed" || event.error === "audio-capture" ? "destructive" : undefined,
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Load initial suggestions
    setQuickSuggestions(getQuickSuggestions([]));

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type: 'user' | 'assistant', text: string) => {
    setMessages(prev => [...prev, { type, text }]);
  };

  const handleQuestionClick = async (question: string) => {
    // Add user question to chat
    addMessage('user', question);
    setIsTyping(true);
    
    try {
      // Get AI response
      const response = await getAIResponse(question, messages);
      setIsTyping(false);
      addMessage('assistant', response);
      
      // Speak response if enabled
      if (isSpeaking) {
        speakText(response);
      }
      
      // Update suggestions
      setQuickSuggestions(getQuickSuggestions([...messages, { type: 'user', text: question }, { type: 'assistant', text: response }]));
    } catch (error) {
      setIsTyping(false);
      addMessage('assistant', "I'm having trouble connecting right now. Please try again!");
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;
    
    // Add user message
    addMessage('user', messageText);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Get AI response
      const response = await getAIResponse(messageText, messages);
      setIsTyping(false);
      addMessage('assistant', response);
      
      // Speak response if enabled
      if (isSpeaking) {
        speakText(response);
      }
      
      // Update suggestions
      setQuickSuggestions(getQuickSuggestions([...messages, { type: 'user', text: messageText }, { type: 'assistant', text: response }]));
    } catch (error) {
      setIsTyping(false);
      addMessage('assistant', "I'm having trouble connecting right now. Please try again!");
    }
  };

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      toast({
        title: "Not Supported",
        description: "Voice input works only in browsers that support speech recognition, such as Chrome or Edge.",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        toast({
          title: "Listening...",
          description: "Speak naturally. Your message will send after capture.",
        });
      } catch (error) {
        console.error('Recognition start error:', error);
        toast({
          title: "Error",
          description: "Could not start voice input. Check microphone permission and try again.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    toast({
      title: isSpeaking ? "Voice Off" : "Voice On",
      description: isSpeaking ? "Responses will not be spoken" : "Responses will be spoken aloud",
    });
  };

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full border border-primary/20 bg-gradient-to-br from-primary to-secondary text-white shadow-[0_18px_42px_hsl(var(--primary)/0.35)] hover:scale-105 hover:from-primary/90 hover:to-secondary/90"
            size="icon"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </Button>
        </DialogTrigger>

        <DialogContent className="flex h-[560px] max-w-md flex-col overflow-hidden border-primary/15 bg-background/95 p-0 backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-primary/10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_55%)] p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <MessageCircle className="w-5 h-5 text-primary" />
              Serenity Assistant
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A quick guide for using Serenity, finding features, and getting gentle next-step help.
            </p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,hsl(var(--background)),hsl(var(--primary)/0.03))] p-4">
            {messages.length === 0 && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <MessageCircle className="mx-auto mb-3 h-9 w-9 text-primary/60" />
                <p>Ask me anything about using Serenity!</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2.5 shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-primary to-secondary text-white'
                      : 'border border-primary/10 bg-card/90 text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="border-t border-primary/10 bg-background/95 p-4">
            {isTyping && (
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            <div className="mb-3 flex flex-wrap gap-2">
              {quickSuggestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-auto rounded-full border-primary/15 bg-background px-3 py-1.5 text-xs hover:bg-primary/5"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                className="flex-shrink-0 rounded-full"
                title={speechSupported ? "Voice Input" : "Voice input not supported in this browser"}
                disabled={!speechSupported || isTyping}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={toggleSpeaking}
                variant={isSpeaking ? "default" : "outline"}
                size="icon"
                className="flex-shrink-0 rounded-full"
                title="Voice Output"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type or speak your question..."
                className="flex-1 rounded-2xl border border-primary/10 bg-background px-3 py-2 text-sm"
              />
              
              <Button
                onClick={() => handleSendMessage()}
                size="icon"
                className="flex-shrink-0"
                disabled={!inputText.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoiceAssistant;
