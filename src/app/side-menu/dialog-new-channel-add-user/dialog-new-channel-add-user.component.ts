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


  channelService: ChannelService = inject(ChannelService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  currentUser: any = [];
  unsubCurrentUser: any;
  @ViewChild('userfield') private scrollDown?: ElementRef;

  form = new FormGroup({
    users: new FormControl(''),
  })

  constructor(public dialogRef: MatDialogRef<DialogNewChannelAddUserComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
    const channel= new Channel( {
      id:'',
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
}


