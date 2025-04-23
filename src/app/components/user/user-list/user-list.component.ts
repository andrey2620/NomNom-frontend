import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../interfaces';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  @ViewChild('usersModal') usersModal!: ModalComponent;
  @Input() title = '';
  @Input() users: IUser[] = [];
  @Output() callModalAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callDeleteAction: EventEmitter<IUser> = new EventEmitter<IUser>();

  private fb: FormBuilder = inject(FormBuilder);

  userForm = this.fb.group({
    id: [''],
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    password: ['', [Validators.required]],
    updatedAt: [''],
    createdAt: [''],
  });

  editUser(user: IUser) {
    this.userForm.patchValue({
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      password: user.password,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    });
    this.usersModal.showModal();
  }

  onSave() {
    if (this.userForm.valid) {
      this.callModalAction.emit(this.userForm.value as IUser);
      this.usersModal.hideModal();
      this.userForm.reset();
    }
  }
}
