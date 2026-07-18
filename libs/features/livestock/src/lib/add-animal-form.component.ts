import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AnimalService } from './animal.service';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'lib-add-animal-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        InputNumberModule,
        ButtonModule
    ],
    template: `
    <form [formGroup]="animalForm" (ngSubmit)="onSubmit()" class="p-fluid">
      
      <!-- Flexbox ব্যবহার করে নিচে নিচে সাজানো হলো -->
      <div class="flex flex-column gap-2 mb-3">
        <label for="tagNumber" class="font-bold">Tag Number</label>
        <input pInputText id="tagNumber" formControlName="tagNumber" placeholder="e.g. QURBANI-2026-002" />
        <small class="p-error" *ngIf="animalForm.get('tagNumber')?.invalid && animalForm.get('tagNumber')?.touched">
          Tag Number is required.
        </small>
      </div>

      <div class="flex flex-column gap-2 mb-3">
        <label for="species" class="font-bold">Species</label>
        <input pInputText id="species" formControlName="species" placeholder="e.g. Cow, Goat" />
      </div>

      <div class="flex flex-column gap-2 mb-3">
        <label for="purpose" class="font-bold">Purpose</label>
        <!-- মডালের ভেতর ড্রপডাউন যেন কেটে না যায় তাই appendTo="body" দেওয়া হলো -->
        <p-select [options]="purposeOptions" formControlName="purpose" optionLabel="label" optionValue="value" placeholder="Select a Purpose" appendTo="body"></p-select>
      </div>

      <div class="flex flex-column gap-2 mb-3">
        <label for="dateOfBirth" class="font-bold">Date of Birth</label>
        <p-datepicker formControlName="dateOfBirth" [showIcon]="true" appendTo="body"></p-datepicker>
      </div>

      <div class="flex flex-column gap-2 mb-4">
        <label for="initialWeight" class="font-bold">Initial Weight (KG)</label>
        <p-inputNumber formControlName="initialWeight" inputId="initialWeight" mode="decimal" [minFractionDigits]="2"></p-inputNumber>
      </div>

      <div class="flex justify-content-end gap-2">
        <p-button label="Cancel" severity="secondary" (click)="closeDialog()"></p-button>
        <p-button label="Save Animal" type="submit" [disabled]="animalForm.invalid"></p-button>
      </div>
      
    </form>
  `
})
export class AddAnimalFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private animalService = inject(AnimalService);
    private ref = inject(DynamicDialogRef); // মডালটি ক্লোজ করার জন্য

    animalForm!: FormGroup;

    purposeOptions = [
        { label: 'Fattening', value: 1 },
        { label: 'Qurbani', value: 2 },
        { label: 'Dairy', value: 0 }
    ];

    ngOnInit() {
        this.animalForm = this.fb.group({
            tagNumber: ['', Validators.required],
            species: ['', Validators.required],
            purpose: [null, Validators.required],
            dateOfBirth: [null, Validators.required],
            initialWeight: [null, [Validators.required, Validators.min(1)]]
        });
    }

    onSubmit() {
        if (this.animalForm.valid) {
            const formValue = this.animalForm.value;

            // API তে পাঠানোর জন্য ডেটা ফরম্যাট করা (বিশেষ করে ডেট)
            const payload = {
                ...formValue,
                // Backend এ UTC ফরমেটে পাঠালে ভালো
                dateOfBirth: new Date(formValue.dateOfBirth).toISOString()
            };

            this.animalService.addAnimal(payload).subscribe({
                next: (res) => {
                    // সফল হলে মডাল বন্ধ করে দিব এবং true রিটার্ন করব
                    this.ref.close(true);
                },
                error: (err) => {
                    console.error('Error adding animal:', err);
                    // ভবিষ্যতে এখানে Toast Notification অ্যাড করব
                }
            });
        }
    }

    closeDialog() {
        this.ref.close(false);
    }
}