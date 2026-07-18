import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalService } from './animal.service';
import { Animal } from './animal.model';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api'; // নতুন ইমপোর্ট
import { AddAnimalFormComponent } from './add-animal-form.component'; // নতুন ফর্ম

@Component({
    selector: 'lib-animal-list',
    standalone: true,
    imports: [CommonModule, TableModule, CardModule, ButtonModule, DynamicDialogModule],
    providers: [DialogService], // DynamicDialog চালানোর জন্য প্রোভাইডার
    template: `
    <p-card header="Livestock Inventory">
      <div class="flex justify-content-end mb-3">
        <p-button label="Add New Animal" icon="pi pi-plus" (click)="openAddAnimalDialog()"></p-button>
      </div>

      <p-table [value]="animals" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr>
            <th>Tag Number</th>
            <th>Species</th>
            <th>Purpose</th>
            <th>Weight (KG)</th>
            <th>Date of Birth</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-animal>
          <tr>
            <td><strong>{{ animal.tagNumber }}</strong></td>
            <td>{{ animal.species }}</td>
            <td>
              <span *ngIf="animal.purpose === 2" class="p-badge p-badge-warning">Qurbani</span>
              <span *ngIf="animal.purpose === 1" class="p-badge p-badge-success">Fattening</span>
              <span *ngIf="animal.purpose === 0" class="p-badge p-badge-info">Dairy</span>
            </td>
            <td>{{ animal.currentWeight }}</td>
            <td>{{ animal.dateOfBirth | date:'mediumDate' }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
})
export class AnimalListComponent implements OnInit {
    private animalService = inject(AnimalService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    private messageService = inject(MessageService); // MessageService ইনজেক্ট করা হলো

    animals: Animal[] = [];

    ngOnInit(): void {
        this.loadAnimals();
    }

    loadAnimals() {
        this.animalService.getAnimals().subscribe({
            next: (data) => {
                this.animals = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching animals:', err)
        });
    }

    openAddAnimalDialog() {
        const ref = this.dialogService.open(AddAnimalFormComponent, {
            header: 'Register New Animal',
            width: '30vw',
            breakpoints: { '960px': '75vw', '640px': '90vw' },
            modal: true,
            closable: true
        });

        // মডালটি বন্ধ হওয়ার পর চেক করা ডেটা সেভ হয়েছে কি না
        if (ref) {
            ref.onClose.subscribe((isSuccess: boolean) => {
                if (isSuccess) {
                    // সফল হলে আবার এপিআই কল করে লিস্ট রিফ্রেশ করব
                    this.loadAnimals();

                    // সফলভাবে সেভ হলে Toast মেসেজ দেখানো
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Registration Successful',
                        detail: 'The new animal has been added to the inventory.'
                    });
                }
            });
        }
    }
}