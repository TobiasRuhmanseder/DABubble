import { Component, Inject, OnDestroy, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
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


@Component({
  selector: 'app-dialog-new-channel-add-user',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dialog-new-channel-add-user.component.html',
  styleUrl: './dialog-new-channel-add-user.component.scss'
})
export class DialogNewChannelAddUserComponent implements OnInit, OnDestroy {

  createButtonActive = true;
  allUsersChoose = true;
  filteredUser: any = [];
  input$ = new Subject<string>();
  dropDownList = false;
  inputValue: any;

  channelService: ChannelService = inject(ChannelService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  users: UsersService = inject(UsersService);
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
      this.input$.pipe(debounceTime(300)).subscribe(search => {
        console.log(search);
        if (search.length >= 2) {
          this.filteredUser = this.filterUser(search);
          if (this.filteredUser.length >= 1) this.dropDownList = true; else this.dropDownList = false;
        } else {
          this.dropDownList = false;
          this.filteredUser = [];
        }
      })
  }

  filterUser(search: string) {
    const filterUser = this.users.users.filter(((el: any) => el.name.toLowerCase().includes(search.toLowerCase())));
    return filterUser;
  }

  ngOnInit(): void {
    this.unsubCurrentUser = this.currentUserService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log(user);

    });
    this.currentUserService.activeUser();
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
    this.createButtonActive = false;
    const channel = new Channel({
      id: '',
      name: this.data.channelName,
      description: this.data.channelDescription,
      creator: this.currentUser.uid,
      users: []

    })
    await this.channelService.addNewChannel(channel);
    this.dialogRef.close();
  }

  scrollDownUsers(): void {
    this.scrollDown?.nativeElement.scroll({
      top: this.scrollDown?.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  deleteUserFromList() {

  }
}


