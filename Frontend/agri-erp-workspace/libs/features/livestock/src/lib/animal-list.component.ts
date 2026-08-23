import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalService } from './animal.service';
import { Animal } from './animal.model';
import { VeterinaryService, VaccinationSchedule, BreedingCycle } from './veterinary.service';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { AddAnimalFormComponent } from './add-animal-form.component';

@Component({
    selector: 'lib-animal-list',
    standalone: true,
    imports: [CommonModule, FormsModule, DynamicDialogModule],
    providers: [DialogService],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Livestock, Veterinary & Breeding Manager</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Automated vaccination booster reminders, gestation milestone tracking, and cattle biological inventory.</p>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button *ngIf="activeTab === 'inventory'" (click)="openAddAnimalDialog()" class="btn-primary">
            ➕ Register Animal
          </button>
          <button *ngIf="activeTab === 'vaccination'" (click)="openScheduleVaccinationModal()" class="btn-primary">
            💉 Schedule Vaccine
          </button>
          <button *ngIf="activeTab === 'breeding'" (click)="openRecordInseminationModal()" class="btn-primary">
            🧬 Log Insemination
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem;">
        <button (click)="activeTab = 'inventory'"
                [style.background]="activeTab === 'inventory' ? 'var(--primary-emerald)' : 'rgba(30, 41, 59, 0.6)'"
                [style.color]="activeTab === 'inventory' ? '#0f172a' : 'var(--text-muted)'"
                [style.border]="activeTab === 'inventory' ? '1px solid var(--primary-emerald)' : '1px solid var(--border-glass)'"
                style="padding: 8px 18px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s;">
          🐄 Herd Inventory ({{ animals.length }})
        </button>

        <button (click)="activeTab = 'vaccination'"
                [style.background]="activeTab === 'vaccination' ? 'var(--primary-emerald)' : 'rgba(30, 41, 59, 0.6)'"
                [style.color]="activeTab === 'vaccination' ? '#0f172a' : 'var(--text-muted)'"
                [style.border]="activeTab === 'vaccination' ? '1px solid var(--primary-emerald)' : '1px solid var(--border-glass)'"
                style="padding: 8px 18px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s;">
          💉 Vaccination & Health Scheduler ({{ vaccinations.length }})
        </button>

        <button (click)="activeTab = 'breeding'"
                [style.background]="activeTab === 'breeding' ? 'var(--primary-emerald)' : 'rgba(30, 41, 59, 0.6)'"
                [style.color]="activeTab === 'breeding' ? '#0f172a' : 'var(--text-muted)'"
                [style.border]="activeTab === 'breeding' ? '1px solid var(--primary-emerald)' : '1px solid var(--border-glass)'"
                style="padding: 8px 18px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s;">
          🧬 Breeding & Gestation Lifecycle ({{ breedingCycles.length }})
        </button>
      </div>

      <!-- TAB 1: HERD INVENTORY -->
      <div *ngIf="activeTab === 'inventory'" style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Tag Number</th>
              <th>Species</th>
              <th>Purpose</th>
              <th>Current Weight</th>
              <th>Date of Birth</th>
              <th style="text-align: center;">Actions</th>
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
              <td style="text-align: center;">
                <button (click)="quickScheduleVaccineForAnimal(animal)" class="btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;">
                  💉 Schedule Dose
                </button>
              </td>
            </tr>
            <tr *ngIf="animals.length === 0">
              <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                No livestock records found. Click <strong>Register Animal</strong> to add head count.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB 2: VACCINATION SCHEDULER -->
      <div *ngIf="activeTab === 'vaccination'" style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="color: #ffffff; margin: 0; font-size: 1.1rem; font-weight: 700;">💉 Immunization Schedule & Overdue Tracker</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Automated booster rules & health compliance</span>
        </div>

        <table class="modern-table">
          <thead>
            <tr>
              <th>Animal Tag</th>
              <th>Vaccine Dose</th>
              <th>Scheduled Date</th>
              <th>Administered Date</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: center;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of vaccinations">
              <td><strong style="color: #ffffff;">{{ item.animalTag }}</strong></td>
              <td><span class="badge-pill badge-blue">{{ item.vaccineName }}</span></td>
              <td>{{ item.scheduledDate | date:'mediumDate' }}</td>
              <td>{{ item.administeredDate ? (item.administeredDate | date:'mediumDate') : '—' }}</td>
              <td style="text-align: center;">
                <span *ngIf="item.status === 'Completed'" class="badge-pill badge-emerald">✅ Completed</span>
                <span *ngIf="item.status === 'Scheduled'" class="badge-pill badge-amber">⏳ Scheduled</span>
                <span *ngIf="item.status === 'Overdue'" class="badge-pill badge-rose">⚠️ Overdue</span>
              </td>
              <td style="text-align: center;">
                <button *ngIf="item.status !== 'Completed'" (click)="completeVaccination(item.id)" class="btn-primary" style="padding: 4px 12px; font-size: 0.75rem;">
                  Mark Administered
                </button>
                <span *ngIf="item.status === 'Completed'" style="color: var(--text-muted); font-size: 0.8rem;">Done</span>
              </td>
            </tr>
            <tr *ngIf="vaccinations.length === 0">
              <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                No vaccination schedules on file. Click <strong>Schedule Vaccine</strong> to log upcoming health intervention.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB 3: BREEDING & GESTATION LIFECYCLE -->
      <div *ngIf="activeTab === 'breeding'" style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="color: #ffffff; margin: 0; font-size: 1.1rem; font-weight: 700;">🧬 Insemination, Pregnancy Verification & Calving</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted);">283-Day Automated Gestation Timeline</span>
        </div>

        <table class="modern-table">
          <thead>
            <tr>
              <th>Dam (Mother)</th>
              <th>Sire (Father)</th>
              <th>Insemination</th>
              <th>Pregnancy Test</th>
              <th>Expected Calving</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cycle of breedingCycles">
              <td><strong style="color: #ffffff;">{{ cycle.femaleAnimalTag }}</strong></td>
              <td>{{ cycle.maleAnimalTag || 'Artificial Insemination (Straw)' }}</td>
              <td>
                <div>{{ cycle.inseminationDate | date:'mediumDate' }}</div>
                <span style="font-size: 0.75rem; color: var(--text-muted);">{{ cycle.inseminationType }}</span>
              </td>
              <td>
                <span *ngIf="cycle.pregnancyResult === 'Positive'" class="badge-pill badge-emerald">Confirmed Pregnant</span>
                <span *ngIf="cycle.pregnancyResult === 'Negative'" class="badge-pill badge-rose">Not Pregnant</span>
                <span *ngIf="!cycle.pregnancyResult" class="badge-pill badge-amber">Pending Check</span>
              </td>
              <td>
                <strong style="color: var(--primary-emerald);">{{ cycle.expectedCalvingDate | date:'mediumDate' }}</strong>
              </td>
              <td style="text-align: center;">
                <span *ngIf="cycle.status === 'Active'" class="badge-pill badge-blue">Active Cycle</span>
                <span *ngIf="cycle.status === 'Successful'" class="badge-pill badge-emerald">Calved</span>
                <span *ngIf="cycle.status === 'Failed'" class="badge-pill badge-rose">Failed</span>
              </td>
              <td style="text-align: center; white-space: nowrap;">
                <button *ngIf="!cycle.pregnancyResult" (click)="openPregnancyCheckModal(cycle)" class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem; margin-right: 4px;">
                  🔬 Record Test
                </button>
                <button *ngIf="cycle.pregnancyResult === 'Positive' && cycle.status === 'Active'" (click)="openCalvingModal(cycle)" class="btn-primary" style="padding: 4px 8px; font-size: 0.75rem;">
                  🍼 Log Calving
                </button>
              </td>
            </tr>
            <tr *ngIf="breedingCycles.length === 0">
              <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                No breeding cycles recorded. Click <strong>Log Insemination</strong> to begin gestation tracking.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MODAL 1: Schedule Vaccination -->
      <div *ngIf="showVaccineModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.5rem; width: 420px; max-width: 90vw;">
          <h4 style="color: #ffffff; margin-top: 0; font-size: 1.2rem;">Schedule Vaccination Dose</h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Target Animal</label>
              <select [(ngModel)]="newVaccine.animalId" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;">
                <option *ngFor="let a of animals" [value]="a.id">{{ a.tagNumber }} ({{ a.species }})</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Scheduled Administration Date</label>
              <input type="date" [(ngModel)]="newVaccine.scheduledDate" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;" />
            </div>
          </div>
          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button (click)="showVaccineModal = false" class="btn-secondary">Cancel</button>
            <button (click)="submitScheduleVaccination()" class="btn-primary">Save Schedule</button>
          </div>
        </div>
      </div>

      <!-- MODAL 2: Record Insemination -->
      <div *ngIf="showInseminationModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.5rem; width: 440px; max-width: 90vw;">
          <h4 style="color: #ffffff; margin-top: 0; font-size: 1.2rem;">Log Insemination & Gestation</h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Dam (Female Cow)</label>
              <select [(ngModel)]="newInsemination.femaleAnimalId" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;">
                <option *ngFor="let a of animals" [value]="a.id">{{ a.tagNumber }} ({{ a.species }})</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Insemination Method</label>
              <select [(ngModel)]="newInsemination.inseminationType" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;">
                <option value="Artificial">Artificial Insemination (AI Semen Straw)</option>
                <option value="Natural">Natural Breeding (Sire Bull)</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Insemination Date</label>
              <input type="date" [(ngModel)]="newInsemination.inseminationDate" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;" />
            </div>
          </div>
          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button (click)="showInseminationModal = false" class="btn-secondary">Cancel</button>
            <button (click)="submitInsemination()" class="btn-primary">Register Breeding</button>
          </div>
        </div>
      </div>

      <!-- MODAL 3: Record Pregnancy Check -->
      <div *ngIf="showPregnancyModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.5rem; width: 400px; max-width: 90vw;">
          <h4 style="color: #ffffff; margin-top: 0; font-size: 1.2rem;">Record Pregnancy Ultrasound / Palpation</h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Check Date</label>
              <input type="date" [(ngModel)]="pregCheck.checkDate" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Diagnosis Result</label>
              <select [(ngModel)]="pregCheck.result" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;">
                <option value="Positive">Positive (Confirmed Pregnant)</option>
                <option value="Negative">Negative (Not Pregnant / Open)</option>
              </select>
            </div>
          </div>
          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button (click)="showPregnancyModal = false" class="btn-secondary">Cancel</button>
            <button (click)="submitPregnancyCheck()" class="btn-primary">Save Diagnosis</button>
          </div>
        </div>
      </div>

      <!-- MODAL 4: Log Calving Delivery -->
      <div *ngIf="showCalvingModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.5rem; width: 440px; max-width: 90vw;">
          <h4 style="color: #ffffff; margin-top: 0; font-size: 1.2rem;">Record Calving & Calf Birth</h4>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Calving Date</label>
              <input type="date" [(ngModel)]="calvingData.calvingDate" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">New Calf Ear Tag Number</label>
              <input type="text" [(ngModel)]="calvingData.tagNumber" placeholder="e.g. CALF-2026-09" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Gender</label>
                <select [(ngModel)]="calvingData.gender" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;">
                  <option value="Heifer">Heifer (Female)</option>
                  <option value="Bull">Bull (Male)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px;">Birth Weight (KG)</label>
                <input type="number" [(ngModel)]="calvingData.birthWeight" style="width: 100%; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px; color: #ffffff;" />
              </div>
            </div>
          </div>
          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button (click)="showCalvingModal = false" class="btn-secondary">Cancel</button>
            <button (click)="submitCalving()" class="btn-primary">Register Calf Birth</button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AnimalListComponent implements OnInit {
    private animalService = inject(AnimalService);
    private veterinaryService = inject(VeterinaryService);
    private cdr = inject(ChangeDetectorRef);
    private dialogService = inject(DialogService);
    private messageService = inject(MessageService);

    activeTab: 'inventory' | 'vaccination' | 'breeding' = 'inventory';

    animals: Animal[] = [];
    vaccinations: VaccinationSchedule[] = [];
    breedingCycles: BreedingCycle[] = [];

    // Modals
    showVaccineModal = false;
    showInseminationModal = false;
    showPregnancyModal = false;
    showCalvingModal = false;

    selectedCycleId: string = '';

    newVaccine = {
        animalId: '',
        vaccineItemId: '00000000-0000-0000-0000-000000000000',
        scheduledDate: new Date().toISOString().split('T')[0]
    };

    newInsemination = {
        femaleAnimalId: '',
        inseminationType: 'Artificial',
        inseminationDate: new Date().toISOString().split('T')[0]
    };

    pregCheck = {
        checkDate: new Date().toISOString().split('T')[0],
        result: 'Positive'
    };

    calvingData = {
        calvingDate: new Date().toISOString().split('T')[0],
        tagNumber: '',
        gender: 'Heifer',
        birthWeight: 32.5,
        status: 'Healthy'
    };

    ngOnInit(): void {
        this.loadAllData();
    }

    loadAllData() {
        this.loadAnimals();
        this.loadVaccinations();
        this.loadBreedingCycles();
    }

    loadAnimals() {
        this.animalService.getAnimals().subscribe({
            next: (data) => {
                this.animals = data;
                if (data.length > 0) {
                    this.newVaccine.animalId = data[0].id;
                    this.newInsemination.femaleAnimalId = data[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching animals:', err)
        });
    }

    loadVaccinations() {
        this.veterinaryService.getVaccinations().subscribe({
            next: (data) => {
                this.vaccinations = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching vaccinations:', err)
        });
    }

    loadBreedingCycles() {
        this.veterinaryService.getBreedingCycles().subscribe({
            next: (data) => {
                this.breedingCycles = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching breeding cycles:', err)
        });
    }

    openScheduleVaccinationModal() {
        this.showVaccineModal = true;
    }

    quickScheduleVaccineForAnimal(animal: Animal) {
        this.newVaccine.animalId = animal.id;
        this.showVaccineModal = true;
    }

    submitScheduleVaccination() {
        this.veterinaryService.scheduleVaccination(this.newVaccine).subscribe({
            next: () => {
                this.showVaccineModal = false;
                this.loadVaccinations();
                this.messageService.add({ severity: 'success', summary: 'Vaccine Scheduled', detail: 'Vaccination dose logged successfully.' });
            },
            error: (err) => console.error(err)
        });
    }

    completeVaccination(id: string) {
        const today = new Date().toISOString();
        this.veterinaryService.completeVaccination(id, today).subscribe({
            next: () => {
                this.loadVaccinations();
                this.messageService.add({ severity: 'success', summary: 'Dose Administered', detail: 'Vaccination completed.' });
            },
            error: (err) => console.error(err)
        });
    }

    openRecordInseminationModal() {
        this.showInseminationModal = true;
    }

    submitInsemination() {
        this.veterinaryService.recordInsemination(this.newInsemination).subscribe({
            next: () => {
                this.showInseminationModal = false;
                this.loadBreedingCycles();
                this.messageService.add({ severity: 'success', summary: 'Insemination Registered', detail: 'Expected calving timeline calculated.' });
            },
            error: (err) => console.error(err)
        });
    }

    openPregnancyCheckModal(cycle: BreedingCycle) {
        this.selectedCycleId = cycle.id;
        this.showPregnancyModal = true;
    }

    submitPregnancyCheck() {
        this.veterinaryService.recordPregnancyCheck(this.selectedCycleId, this.pregCheck.checkDate, this.pregCheck.result).subscribe({
            next: () => {
                this.showPregnancyModal = false;
                this.loadBreedingCycles();
                this.messageService.add({ severity: 'success', summary: 'Diagnosis Saved', detail: 'Pregnancy state updated.' });
            },
            error: (err) => console.error(err)
        });
    }

    openCalvingModal(cycle: BreedingCycle) {
        this.selectedCycleId = cycle.id;
        this.calvingData.tagNumber = `CALF-${Math.floor(1000 + Math.random() * 9000)}`;
        this.showCalvingModal = true;
    }

    submitCalving() {
        this.veterinaryService.recordCalving(this.selectedCycleId, this.calvingData).subscribe({
            next: () => {
                this.showCalvingModal = false;
                this.loadAllData();
                this.messageService.add({ severity: 'success', summary: 'Calf Registered', detail: 'Calf delivered and added to herd inventory.' });
            },
            error: (err) => console.error(err)
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
                    this.loadAllData();
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