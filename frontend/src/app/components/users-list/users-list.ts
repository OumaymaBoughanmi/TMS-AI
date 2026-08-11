import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user';

@Component({
  selector: 'app-users-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css'
})
export class UsersList implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';

  newUser: User = {
    fullName: '',
    email: '',
    password: ''
  };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = this.users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  onSubmit() {
    this.userService.createUser(this.newUser).subscribe(() => {
      this.newUser = { fullName: '', email: '', password: '' };
      this.loadUsers();
    });
  }

  toggleRole(user: User) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.userService.updateUser(user.id!, { role: newRole }).subscribe(() => {
      this.loadUsers();
    });
  }

  deleteUser(user: User) {
    const confirmed = confirm(`Delete user "${user.fullName}"? This cannot be undone.`);
    if (!confirmed) return;

    this.userService.deleteUser(user.id!).subscribe(() => {
      this.loadUsers();
    });
  }
}