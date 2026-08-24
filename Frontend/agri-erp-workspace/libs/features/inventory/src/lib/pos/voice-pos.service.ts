import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';

export interface PosProduct {
    id: string;
    sku: string;
    name: string;
    category: string;
    unitPrice: number;
    stockQuantity: number;
    unit: string;
}

export interface PosCartItem {
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

export interface PosCheckoutRequest {
    customerName: string;
    paymentMethod: string;
    items: PosCartItem[];
    discountAmount: number;
    amountTendered: number;
    notes?: string;
}

export interface PosReceipt {
    receiptNumber: string;
    transactionDate: string;
    customerName: string;
    paymentMethod: string;
    items: PosCartItem[];
    subTotal: number;
    taxAmount: number;
    discountAmount: number;
    grandTotal: number;
    amountTendered: number;
    changeDue: number;
    footerNote: string;
}

export interface VoiceParseResponse {
    rawTranscript: string;
    extractedItems: { itemName: string; quantity: number }[];
}

@Injectable({
    providedIn: 'root'
})
export class VoicePosService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/inventory/pos`;

    isListening = signal<boolean>(false);
    transcript = signal<string>('');
    recognition: any = null;

    constructor() {
        this.initSpeechRecognition();
    }

    private initSpeechRecognition(): void {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = true;
                this.recognition.interimResults = true;
                this.recognition.lang = 'en-US';

                this.recognition.onresult = (event: any) => {
                    let currentTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    this.transcript.set(currentTranscript);
                };

                this.recognition.onerror = (event: any) => {
                    console.warn('Speech recognition error:', event.error);
                    this.isListening.set(false);
                };

                this.recognition.onend = () => {
                    this.isListening.set(false);
                };
            }
        }
    }

    startListening(): void {
        if (this.recognition && !this.isListening()) {
            this.transcript.set('');
            this.isListening.set(true);
            try {
                this.recognition.start();
            } catch (e) {
                console.warn('Speech recognition start failed:', e);
            }
        }
    }

    stopListening(): void {
        if (this.recognition && this.isListening()) {
            this.isListening.set(false);
            try {
                this.recognition.stop();
            } catch (e) {
                console.warn('Speech recognition stop failed:', e);
            }
        }
    }

    speak(text: string): void {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    getProducts(): Observable<PosProduct[]> {
        return this.http.get<PosProduct[]>(`${this.apiUrl}/products`);
    }

    parseVoice(transcript: string): Observable<VoiceParseResponse> {
        return this.http.post<VoiceParseResponse>(`${this.apiUrl}/voice-parse`, { transcript });
    }

    checkout(request: PosCheckoutRequest): Observable<PosReceipt> {
        return this.http.post<PosReceipt>(`${this.apiUrl}/checkout`, request);
    }
}
