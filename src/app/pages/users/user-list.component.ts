import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ফর্মের জন্য
import { AuthService } from '../../../../libs/core/services/auth.service';
import { RoleService } from '../../../../libs/core/services/role.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule], // ReactiveFormsModule ইমপোর্ট করুন
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    private authService = inject(AuthService);
    private roleService = inject(RoleService); // ইনজেক্ট করুন
    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);


    users: any[] = [];
    roles: any[] = []; // রোলগুলো জমা রাখার অ্যারে
    showModal = false; // মডাল দেখানোর জন্য ফ্ল্যাগ
    userForm: FormGroup;

    constructor() {
        // প্রফেশনাল ফর্ম ভ্যালিডেশন সেটআপ
        this.userForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            roleId: ['', [Validators.required]] // নতুন রোল আইডি কন্ট্রোল যুক্ত করা হলো
        });
    }

    ngOnInit() {
        this.loadUsers();
        this.loadRoles(); // পেজ লোড হওয়ার সময় রোলগুলো নিয়ে আসবে
    }

    loadUsers() {
        this.authService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.cdr.detectChanges();
            }
        });
    }

    loadRoles() {
        this.roleService.getRoles().subscribe({
            next: (data) => {
                this.roles = data;
            },
            error: (err) => console.error('Error loading roles:', err)
        });
    }

    // মডাল ওপেন করার ফাংশন
    openModal() {
        this.userForm.reset();
        this.showModal = true;
    }

    // মডাল ক্লোজ করার ফাংশন
    closeModal() {
        this.showModal = false;
    }

    // ফর্ম সাবমিট করার ফাংশন
    onSubmit() {
        if (this.userForm.valid) {
            this.authService.registerUser(this.userForm.value).subscribe({
                next: (res) => {
                    alert('Employee added successfully with assigned role!');
                    this.userForm.reset();
                    this.closeModal();
                    this.loadUsers(); // টেবিল রিফ্রেশ করা
                },
                error: (err) => {
                    alert(err.error?.message || 'Error creating user');
                }
            });
        }
    }
}