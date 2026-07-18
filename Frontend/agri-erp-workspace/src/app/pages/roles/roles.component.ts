import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef ইমপোর্ট করুন
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService, PermissionDto } from '../../../../libs/core/services/role.service';

@Component({
    selector: 'app-roles',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
    private fb = inject(FormBuilder);
    private roleService = inject(RoleService);
    private cdr = inject(ChangeDetectorRef); // UI ফোর্স আপডেট করার জন্য

    roleForm!: FormGroup;

    // এখন আর Object নয়, আমরা Array ব্যবহার করব
    groupedModules: { moduleName: string, permissions: PermissionDto[] }[] = [];
    selectedPermissions: Set<string> = new Set();

    ngOnInit(): void {
        this.initForm();
        this.loadPermissions();
    }

    initForm() {
        this.roleForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['']
        });
    }

    loadPermissions() {
        this.roleService.getPermissions().subscribe({
            next: (data: any[]) => {
                // ১. প্রথমে আগের মতোই মডিউল অনুযায়ী গ্রুপ করা
                const grouped = data.reduce((acc, curr) => {
                    const moduleName = curr.module || curr.Module || 'Uncategorized';
                    if (!acc[moduleName]) {
                        acc[moduleName] = [];
                    }
                    acc[moduleName].push({
                        code: curr.code || curr.Code,
                        name: curr.name || curr.Name,
                        module: moduleName
                    });
                    return acc;
                }, {} as any);

                // ২. Object কে Array তে রূপান্তর করা (Angular-এর জন্য বেস্ট প্র্যাকটিস)
                this.groupedModules = Object.keys(grouped).map(key => ({
                    moduleName: key,
                    permissions: grouped[key]
                }));

                // ৩. Angular-কে বলে দেওয়া যে ডাটা আপডেট হয়েছে, তুমি UI রি-রেন্ডার করো
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error("API Error:", err);
            }
        });
    }

    togglePermission(code: string, event: any) {
        if (event.target.checked) {
            this.selectedPermissions.add(code);
        } else {
            this.selectedPermissions.delete(code);
        }
    }

    onSubmit() {
        if (this.roleForm.invalid || this.selectedPermissions.size === 0) {
            alert('Please fill required fields and select at least one permission.');
            return;
        }

        const payload = {
            name: this.roleForm.value.name,
            description: this.roleForm.value.description,
            permissionCodes: Array.from(this.selectedPermissions)
        };

        this.roleService.createRole(payload).subscribe({
            next: (res) => {
                alert('Role created successfully!');
                this.roleForm.reset();
                this.selectedPermissions.clear();
            },
            error: (err) => console.error(err)
        });
    }
}