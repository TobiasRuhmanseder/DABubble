import { Component, Inject, OnDestroy, OnInit, inject, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewChecked, AfterContentChecked, AfterContentInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrentUserService } from '../../../services/current-user.service';
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.class';
import { UsersService } from '../../../services/users.service';
import { Subject, debounceTime, filter, switchMap } from 'rxjs';
import { UserPicComponent } from "../../user-pic/user-pic.component";


@Component({
  selector: 'app-dialog-new-channel-add-user',
  standalone: true,
  templateUrl: './dialog-new-channel-add-user.component.html',
  styleUrl: './dialog-new-channel-add-user.component.scss',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule, UserPicComponent]
})
export class DialogNewChannelAddUserComponent implements OnInit, OnDestroy, AfterContentChecked {

  allUsersChoose = true;
  buttonDisable = false;
  filteredUsers: any = [];
  selectedUsers: any = [];
  choosingUsers: any = [];
  input$ = new Subject<string>();
  dropDownList = false;
  inputValue: any;

  channelService: ChannelService = inject(ChannelService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  usersService: UsersService = inject(UsersService);
  currentUser: any = [];
  unsubCurrentUser: any;
  unsubInput: any;
  @ViewChild('userfield') private scrollDown?: ElementRef;

  form = new FormGroup({
    users: new FormControl(''),
  })

  constructor(public dialogRef: MatDialogRef<DialogNewChannelAddUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.subInput();
  }

  subInput() {
    this.unsubInput =
      this.input$.pipe(debounceTime(200)).subscribe(search => {
        if (search.length >= 2) {
          this.filteredUsers = this.filterUser(search);
          this.filteredUsers = this.filterActiveUser(this.filteredUsers);
          if (this.filteredUsers.length >= 1) this.dropDownList = true; else this.dropDownList = false;
        } else {
          this.dropDownList = false;
          this.filteredUsers = [];
        }
      })
  }

  filterUser(search: string) {
    const filterUser = this.choosingUsers.filter(((el: any) => el.name.toLowerCase().includes(search.toLowerCase())));
    return filterUser;
  }

  filterActiveUser(filteredUser: any) {
    let index = filteredUser.findIndex((user: any) => user.id === this.currentUser.uid);
    if (index != -1) filteredUser.splice(index, 1);
    return filteredUser;
  }

  ngOnInit(): void {
    this.unsubCurrentUser = this.currentUserService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.currentUserService.activeUser();
    this.choosingUsers = this.usersService.users;
  }

  ngAfterContentChecked(): void {
    if (this.selectedUsers.length >= 1) this.scrollDownUsers();
  }

  ngOnDestroy(): void {
    this.unsubCurrentUser.unsubscribe();
    this.unsubInput.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  allUsersSelect() {
    this.allUsersChoose = true;
  }

  costumUsersSelect() {
    this.allUsersChoose = false;
  }

  async createChannel() {
    this.buttonDisable = true;
    const channel = new Channel({
      id: '',
      name: this.data.channelName,
      description: this.data.channelDescription,
      creator: this.currentUser.uid,
      users: this.getSelectedUser(),

    })
    await this.channelService.addNewChannel(channel);
    this.dialogRef.close();
  }

  getSelectedUser() {
    if (this.allUsersChoose) return [];
    else {
      let users: any[] = [];
      users.push(this.currentUser.uid);
      this.selectedUsers.forEach((user: any) => {
        users.push(user.id);
      });
      return JSON.stringify(users);
    }
  }

  scrollDownUsers(): void {
    this.scrollDown?.nativeElement.scroll({
      top: this.scrollDown?.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  selectUser(userId: any) {
    const index = this.choosingUsers.findIndex(((el: any) => el.id == userId));
    this.clearInput();
    this.selectedUsers.push(this.choosingUsers[index]);
    this.choosingUsers.splice(index, 1);
  }

  deleteUserFromList(userId: any) {
    const index = this.selectedUsers.findIndex(((el: any) => el.id == userId));
    this.choosingUsers.push(this.selectedUsers[index]);
    this.selectedUsers.splice(index, 1);
  }

  clearInput() {
    this.inputValue = '';
    this.input$.next("");
  }
}


