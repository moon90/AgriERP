import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoicePosService, PosProduct, PosCartItem, PosReceipt } from './voice-pos.service';

@Component({
    selector: 'app-voice-pos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.8rem;">🎙️</span>
            <h3 style="color: #ffffff; margin: 0; font-weight: 800; font-size: 1.6rem; letter-spacing: -0.5px;">Voice-to-Inventory POS Counter</h3>
          </div>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Hands-free speech order recognition, rapid barcode lookup, and instant multi-currency checkout.</p>
        </div>

        <div style="display: flex; align-items: center; gap: 1rem;">
          <span *ngIf="posService.isListening()" class="badge-pill badge-rose" style="font-size: 0.8rem; animation: pulse 1.5s infinite;">
            🔴 Live Listening Mode Active
          </span>
          <button (click)="toggleVoiceListening()"
                  [style.background]="posService.isListening() ? 'var(--accent-rose)' : 'linear-gradient(135deg, #10b981, #059669)'"
                  style="border: none; color: #ffffff; padding: 10px 22px; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); transition: transform 0.2s;">
            <span>{{ posService.isListening() ? '⏹️ Stop Mic' : '🎙️ Speak Voice Order' }}</span>
          </button>
        </div>
      </div>

      <!-- Live Voice Command Banner -->
      <div style="background: rgba(10, 35, 24, 0.85); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 16px; padding: 1.25rem; margin-bottom: 1.5rem; backdrop-filter: blur(16px); position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #86efac;">Speech Recognition Engine</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Web Speech API v2.0 • Zero Cloud Latency</span>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 10px; padding: 10px 14px; color: #ffffff; font-size: 0.95rem; min-height: 44px; display: flex; align-items: center;">
            <span *ngIf="posService.transcript()" style="color: #34d399; font-weight: 600;">"{{ posService.transcript() }}"</span>
            <span *ngIf="!posService.transcript()" style="color: var(--text-muted); font-style: italic;">
              Click microphone and speak (e.g. "Add 5 bags of Wheat Feed and 2 NPK Fertilizer")...
            </span>
          </div>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button (click)="simulateVoiceCommand('Add 3 bags of Winter Wheat Feed')" class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;">
              🗣️ +3 Wheat Feed
            </button>
            <button (click)="simulateVoiceCommand('Add 2 bags of NPK Fertilizer')" class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;">
              🗣️ +2 NPK Fertilizer
            </button>
            <button (click)="simulateVoiceCommand('Add 1 bottle of Ivermectin')" class="btn-secondary" style="padding: 6px 12px; font-size: 0.75rem;">
              🗣️ +1 Ivermectin
            </button>
            <button (click)="processCurrentTranscript()" class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem;">
              ⚡ Parse Speech
            </button>
          </div>
        </div>
      </div>

      <!-- Main Two-Column POS Layout -->
      <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.5rem; align-items: start;">
        
        <!-- Left: Shopping Cart & Totals -->
        <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 16px; padding: 1.5rem; backdrop-filter: blur(16px);">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem; margin-bottom: 1rem;">
            <h4 style="margin: 0; color: #ffffff; font-size: 1.15rem; font-weight: 700;">🛒 Active Cart ({{ cartItems.length }})</h4>
            <button (click)="clearCart()" style="background: none; border: none; color: var(--accent-rose); font-size: 0.8rem; font-weight: 600; cursor: pointer;">
              🧹 Clear Cart
            </button>
          </div>

          <!-- Cart Items Table -->
          <div style="max-height: 320px; overflow-y: auto; margin-bottom: 1.25rem;">
            <table class="modern-table" style="font-size: 0.85rem;">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of cartItems; let i = index">
                  <td>
                    <div style="font-weight: 600; color: #ffffff;">{{ item.name }}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">{{ item.sku }}</div>
                  </td>
                  <td style="text-align: center;">
                    <div style="display: inline-flex; align-items: center; gap: 4px; background: rgba(6, 26, 18, 0.8); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 6px; padding: 2px 6px;">
                      <button (click)="changeQty(item, -1)" style="background: none; border: none; color: #ffffff; cursor: pointer; font-weight: 700;">-</button>
                      <span style="font-weight: 700; color: #34d399; min-width: 20px;">{{ item.quantity }}</span>
                      <button (click)="changeQty(item, 1)" style="background: none; border: none; color: #ffffff; cursor: pointer; font-weight: 700;">+</button>
                    </div>
                  </td>
                  <td>\${{ item.unitPrice | number:'1.2-2' }}</td>
                  <td><strong style="color: #34d399;">\${{ item.lineTotal | number:'1.2-2' }}</strong></td>
                  <td>
                    <button (click)="removeItem(i)" style="background: none; border: none; color: var(--accent-rose); cursor: pointer; font-size: 0.9rem;">✕</button>
                  </td>
                </tr>
                <tr *ngIf="cartItems.length === 0">
                  <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2.5rem 1rem;">
                    Your POS cart is empty.<br><span style="font-size: 0.75rem;">Speak a voice order or click a product on the right.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Financial Summary Box -->
          <div style="background: rgba(6, 26, 18, 0.9); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #a7f3d0; margin-bottom: 0.5rem;">
              <span>Subtotal</span>
              <span>\${{ subTotal | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #a7f3d0; margin-bottom: 0.5rem;">
              <span>VAT / Tax (5%)</span>
              <span>\${{ taxAmount | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--accent-amber); margin-bottom: 0.75rem;">
              <span>Discount</span>
              <span>-\${{ discountAmount | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 800; color: #ffffff; border-top: 1px solid rgba(52, 211, 153, 0.2); padding-top: 0.75rem;">
              <span>Grand Total</span>
              <span style="color: #34d399;">\${{ grandTotal | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Checkout Trigger Button -->
          <button (click)="openCheckoutModal()"
                  [disabled]="cartItems.length === 0"
                  class="btn-primary" style="width: 100%; justify-content: center; padding: 14px; font-size: 1.05rem; font-weight: 800;">
            💳 Complete POS Checkout (\${{ grandTotal | number:'1.2-2' }})
          </button>
        </div>

        <!-- Right: Fast Product Catalog & Barcode Scanner -->
        <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 16px; padding: 1.5rem; backdrop-filter: blur(16px);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h4 style="margin: 0; color: #ffffff; font-size: 1.15rem; font-weight: 700;">📦 Product Catalog</h4>
            
            <input type="text" [(ngModel)]="searchQuery" (input)="filterProducts()" placeholder="🔍 Search product or SKU..." style="padding: 8px 12px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 8px; color: #ffffff; font-size: 0.85rem; width: 200px;" />
          </div>

          <!-- Category Filter Pills -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
            <button *ngFor="let cat of categories"
                    (click)="selectCategory(cat)"
                    [style.background]="selectedCategory === cat ? '#10b981' : 'rgba(6, 26, 18, 0.8)'"
                    [style.color]="selectedCategory === cat ? '#061a12' : '#a7f3d0'"
                    style="padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(52, 211, 153, 0.25); font-size: 0.75rem; font-weight: 700; cursor: pointer;">
              {{ cat }}
            </button>
          </div>

          <!-- Product Grid Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; max-height: 480px; overflow-y: auto; padding-right: 4px;">
            <div *ngFor="let p of filteredProducts"
                 (click)="addToCart(p)"
                 style="background: rgba(6, 26, 18, 0.85); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; justify-content: space-between;"
                 onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-2px)'"
                 onmouseout="this.style.borderColor='rgba(52, 211, 153, 0.2)'; this.style.transform='none'">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <span class="badge-pill badge-emerald" style="font-size: 0.65rem;">{{ p.category }}</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted);">{{ p.stockQuantity }} in stock</span>
                </div>
                <div style="font-weight: 700; color: #ffffff; font-size: 0.9rem; margin-bottom: 0.25rem;">{{ p.name }}</div>
                <div style="font-size: 0.7rem; color: var(--text-muted); font-family: monospace;">{{ p.sku }}</div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid rgba(52, 211, 153, 0.15); padding-top: 0.5rem;">
                <span style="font-size: 1.1rem; font-weight: 800; color: #34d399;">\${{ p.unitPrice | number:'1.2-2' }}</span>
                <span style="font-size: 0.8rem; background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 4px 8px; border-radius: 6px; font-weight: 700;">+ Add</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      <!-- Checkout Payment Modal -->
      <div *ngIf="showCheckoutModal"
           style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; backdrop-filter: blur(12px);">
        <div style="width: 100%; max-width: 500px; background: rgba(10, 35, 24, 0.95); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 20px; padding: 2rem; box-shadow: 0 25px 60px rgba(0,0,0,0.8);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
            <h3 style="margin: 0; color: #ffffff; font-size: 1.3rem;">💳 POS Payment Processing</h3>
            <button (click)="showCheckoutModal = false" style="background: none; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer;">✕</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Customer Name</label>
              <input type="text" [(ngModel)]="checkoutCustomer" style="width: 100%; padding: 10px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 8px; color: #ffffff;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Payment Method</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <button *ngFor="let method of paymentMethods"
                        (click)="selectedPaymentMethod = method"
                        [style.background]="selectedPaymentMethod === method ? '#10b981' : 'rgba(6, 26, 18, 0.8)'"
                        [style.color]="selectedPaymentMethod === method ? '#061a12' : '#a7f3d0'"
                        style="padding: 10px; border-radius: 8px; border: 1px solid rgba(52, 211, 153, 0.25); font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                  {{ method }}
                </button>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Amount Tendered</label>
                <input type="number" [(ngModel)]="amountTendered" style="width: 100%; padding: 10px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 8px; color: #ffffff; font-size: 1.1rem; font-weight: 700;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Change Due</label>
                <div style="padding: 10px; background: rgba(6, 26, 18, 0.8); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 8px; color: #34d399; font-size: 1.1rem; font-weight: 800;">
                  \${{ calculateChange() | number:'1.2-2' }}
                </div>
              </div>
            </div>
          </div>

          <button (click)="submitCheckout()" class="btn-primary" style="width: 100%; justify-content: center; padding: 14px; font-size: 1rem; font-weight: 800;">
            ✅ Confirm & Print Thermal Receipt
          </button>
        </div>
      </div>

      <!-- Thermal Printable Receipt Modal -->
      <div *ngIf="showReceiptModal && latestReceipt"
           style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; backdrop-filter: blur(12px);">
        <div style="width: 100%; max-width: 420px; background: #ffffff; color: #1e293b; border-radius: 16px; padding: 2rem; box-shadow: 0 25px 60px rgba(0,0,0,0.8); font-family: monospace;">
          
          <div style="text-align: center; border-bottom: 2px dashed #94a3b8; padding-bottom: 1rem; margin-bottom: 1rem;">
            <div style="font-size: 1.3rem; font-weight: 800;">🌾 AGRIERP FARM STORE</div>
            <div style="font-size: 0.75rem; color: #64748b;">Enterprise Farm Supply & Agronomy</div>
            <div style="font-size: 0.8rem; margin-top: 4px;">Receipt #: <strong>{{ latestReceipt.receiptNumber }}</strong></div>
            <div style="font-size: 0.75rem; color: #64748b;">{{ latestReceipt.transactionDate | date:'medium' }}</div>
          </div>

          <div style="margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; margin-bottom: 4px;">Customer: <strong>{{ latestReceipt.customerName }}</strong></div>
            <div style="font-size: 0.8rem;">Payment: <strong>{{ latestReceipt.paymentMethod }}</strong></div>
          </div>

          <!-- Receipt Items -->
          <div style="border-bottom: 2px dashed #94a3b8; padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
            <div *ngFor="let item of latestReceipt.items" style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
              <span>{{ item.quantity }}x {{ item.name }}</span>
              <span>\${{ item.lineTotal | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Receipt Totals -->
          <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>Subtotal:</span>
              <span>\${{ latestReceipt.subTotal | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>VAT (5%):</span>
              <span>\${{ latestReceipt.taxAmount | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; border-top: 1px solid #cbd5e1; padding-top: 4px;">
              <span>Total Paid:</span>
              <span>\${{ latestReceipt.grandTotal | number:'1.2-2' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #64748b; font-size: 0.8rem;">
              <span>Change Returned:</span>
              <span>\${{ latestReceipt.changeDue | number:'1.2-2' }}</span>
            </div>
          </div>

          <div style="text-align: center; font-size: 0.75rem; color: #64748b; margin-bottom: 1.25rem;">
            {{ latestReceipt.footerNote }}
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <button (click)="printReceipt()" class="btn-primary" style="flex: 1; justify-content: center; padding: 10px;">
              🖨️ Print Receipt
            </button>
            <button (click)="showReceiptModal = false" class="btn-secondary" style="padding: 10px 16px;">
              Close
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class VoicePosComponent implements OnInit {
    posService = inject(VoicePosService);
    cdr = inject(ChangeDetectorRef);

    products: PosProduct[] = [];
    filteredProducts: PosProduct[] = [];
    cartItems: PosCartItem[] = [];

    categories = ['All', 'Feed', 'Fertilizer', 'Medicine', 'Seed', 'Equipment'];
    selectedCategory = 'All';
    searchQuery = '';

    showCheckoutModal = false;
    showReceiptModal = false;
    checkoutCustomer = 'Local Retail Farmer';
    paymentMethods = ['Cash', 'Credit Card', 'Farmer Account', 'Mobile Money / bKash'];
    selectedPaymentMethod = 'Cash';
    amountTendered = 100;
    latestReceipt: PosReceipt | null = null;

    get subTotal(): number {
        return this.cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
    }

    get taxAmount(): number {
        return Math.round(this.subTotal * 0.05 * 100) / 100;
    }

    get discountAmount(): number {
        return 0;
    }

    get grandTotal(): number {
        return this.subTotal + this.taxAmount - this.discountAmount;
    }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts(): void {
        this.posService.getProducts().subscribe({
            next: (data) => {
                this.products = data;
                this.filteredProducts = data;
                this.cdr.detectChanges();
            },
            error: () => {
                // Seed fallback
                this.products = [
                    { id: '1', sku: 'FEED-WHEAT-50KG', name: 'Winter Wheat Organic Feed (50KG)', category: 'Feed', unitPrice: 28.50, stockQuantity: 120, unit: 'Bag' },
                    { id: '2', sku: 'CHEM-NPK-20-20', name: 'NPK 20-20-20 Crop Fertilizer', category: 'Fertilizer', unitPrice: 42.00, stockQuantity: 85, unit: 'Bag' },
                    { id: '3', sku: 'MED-IVERMECTIN', name: 'Ivermectin 1% Injectable Dewormer', category: 'Medicine', unitPrice: 34.00, stockQuantity: 40, unit: 'Bottle' },
                    { id: '4', sku: 'SEED-CORN-HYBRID', name: 'Hybrid Grain Corn Seed', category: 'Seed', unitPrice: 65.00, stockQuantity: 95, unit: 'Bag' },
                    { id: '5', sku: 'TAG-RFID-CATTLE', name: 'UHF RFID Cattle Ear Tag (Pack 20)', category: 'Equipment', unitPrice: 22.00, stockQuantity: 200, unit: 'Pack' }
                ];
                this.filteredProducts = [...this.products];
                this.cdr.detectChanges();
            }
        });
    }

    selectCategory(cat: string): void {
        this.selectedCategory = cat;
        this.filterProducts();
    }

    filterProducts(): void {
        this.filteredProducts = this.products.filter(p => {
            const matchesCat = this.selectedCategory === 'All' || p.category === this.selectedCategory;
            const matchesQuery = !this.searchQuery || p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchesCat && matchesQuery;
        });
    }

    addToCart(product: PosProduct, quantity = 1): void {
        const existing = this.cartItems.find(i => i.productId === product.id);
        if (existing) {
            existing.quantity += quantity;
            existing.lineTotal = existing.quantity * existing.unitPrice;
        } else {
            this.cartItems.push({
                productId: product.id,
                sku: product.sku,
                name: product.name,
                quantity,
                unitPrice: product.unitPrice,
                lineTotal: product.unitPrice * quantity
            });
        }
        this.amountTendered = Math.ceil(this.grandTotal);
        this.posService.speak(`Added ${quantity} ${product.name}`);
        this.cdr.detectChanges();
    }

    changeQty(item: PosCartItem, delta: number): void {
        item.quantity += delta;
        if (item.quantity <= 0) {
            this.cartItems = this.cartItems.filter(i => i !== item);
        } else {
            item.lineTotal = item.quantity * item.unitPrice;
        }
        this.amountTendered = Math.ceil(this.grandTotal);
    }

    removeItem(index: number): void {
        this.cartItems.splice(index, 1);
        this.amountTendered = Math.ceil(this.grandTotal);
    }

    clearCart(): void {
        this.cartItems = [];
        this.amountTendered = 0;
    }

    toggleVoiceListening(): void {
        if (this.posService.isListening()) {
            this.posService.stopListening();
            this.processCurrentTranscript();
        } else {
            this.posService.startListening();
        }
    }

    simulateVoiceCommand(transcript: string): void {
        this.posService.transcript.set(transcript);
        this.processCurrentTranscript();
    }

    processCurrentTranscript(): void {
        const text = this.posService.transcript();
        if (!text) return;

        this.posService.parseVoice(text).subscribe({
            next: (res) => {
                if (res.extractedItems && res.extractedItems.length > 0) {
                    for (const item of res.extractedItems) {
                        // Find matching product
                        const match = this.products.find(p => p.name.toLowerCase().includes(item.itemName.toLowerCase()) || p.category.toLowerCase().includes(item.itemName.toLowerCase()));
                        if (match) {
                            this.addToCart(match, Number(item.quantity) || 1);
                        }
                    }
                }
            },
            error: () => {
                // Client-side regex match fallback
                if (text.toLowerCase().includes('wheat')) {
                    const wheat = this.products.find(p => p.sku.includes('WHEAT'));
                    if (wheat) this.addToCart(wheat, 3);
                } else if (text.toLowerCase().includes('fertilizer')) {
                    const fert = this.products.find(p => p.sku.includes('NPK'));
                    if (fert) this.addToCart(fert, 2);
                } else if (text.toLowerCase().includes('ivermectin')) {
                    const med = this.products.find(p => p.sku.includes('IVERMECTIN'));
                    if (med) this.addToCart(med, 1);
                }
            }
        });
    }

    calculateChange(): number {
        return Math.max(0, this.amountTendered - this.grandTotal);
    }

    openCheckoutModal(): void {
        this.amountTendered = Math.ceil(this.grandTotal);
        this.showCheckoutModal = true;
    }

    submitCheckout(): void {
        const request = {
            customerName: this.checkoutCustomer,
            paymentMethod: this.selectedPaymentMethod,
            items: this.cartItems,
            discountAmount: this.discountAmount,
            amountTendered: this.amountTendered
        };

        this.posService.checkout(request).subscribe({
            next: (receipt) => {
                this.latestReceipt = receipt;
                this.showCheckoutModal = false;
                this.showReceiptModal = true;
                this.cartItems = [];
                this.posService.speak('Checkout complete. Thank you for your order.');
                this.cdr.detectChanges();
            },
            error: () => {
                // Offline fallback receipt
                this.latestReceipt = {
                    receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
                    transactionDate: new Date().toISOString(),
                    customerName: this.checkoutCustomer,
                    paymentMethod: this.selectedPaymentMethod,
                    items: [...this.cartItems],
                    subTotal: this.subTotal,
                    taxAmount: this.taxAmount,
                    discountAmount: this.discountAmount,
                    grandTotal: this.grandTotal,
                    amountTendered: this.amountTendered,
                    changeDue: this.calculateChange(),
                    footerNote: 'Thank you for supporting sustainable local agriculture!'
                };
                this.showCheckoutModal = false;
                this.showReceiptModal = true;
                this.cartItems = [];
                this.posService.speak('Checkout complete. Thank you for your order.');
                this.cdr.detectChanges();
            }
        });
    }

    printReceipt(): void {
        window.print();
    }
}
