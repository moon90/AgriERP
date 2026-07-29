import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalService } from './animal.service';
import { Animal } from './animal.model';
import { TableModule } from 'primeng/table';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { AddAnimalFormComponent } from './add-animal-form.component';

@Component({
    selector: 'lib-animal-list',
    standalone: true,
    imports: [CommonModule, TableModule, DynamicDialogModule],
    providers: [DialogService],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.4rem; letter-spacing: -0.5px;">Livestock Biological Inventory</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Track animal tag numbers, biological species classification, fattening, and milk yields.</p>
        </div>
        <button (click)="openAddAnimalDialog()" class="btn-primary">
          ➕ Register New Animal
        </button>
      </div>

      <!-- Main Dark Slate Glass Table Container -->
      <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Tag Number</th>
              <th>Species</th>
              <th>Purpose</th>
              <th>Weight (KG)</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let animal of animals">
              <td><strong style="color: #ffffff;">{{ animal.tagNumber }}</strong></td>
              <td>{{ animal.species }}</td>
              <td>
                <span *ngIf="animal.purpose === 2" class="badge-pill badge-amber">Qurbani</span>
                <span *ngIf="animal.purpose === 1" class="badge-pill badge-emerald">Fattening</span>
                <span *ngIf="animal.purpose === 0" class="badge-pill badge-blue">Dairy</span>
              </td>
              <td><strong style="color: var(--primary-emerald);">{{ animal.currentWeight }} KG</strong></td>
              <td>{{ animal.dateOfBirth | date:'mediumDate' }}</td>
            </tr>
            <tr *ngIf="animals.length === 0">
              <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                No livestock records found. Click <strong>Register New Animal</strong> to log head count.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class AnimalListComponent implements OnInit {
    private animalService = inject(AnimalService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    private messageService = inject(MessageService);

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

        if (ref) {
            ref.onClose.subscribe((isSuccess: boolean) => {
                if (isSuccess) {
                    this.loadAnimals();
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