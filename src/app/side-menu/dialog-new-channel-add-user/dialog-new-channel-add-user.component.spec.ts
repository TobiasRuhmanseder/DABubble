import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewChannelAddUserComponent } from './dialog-new-channel-add-user.component';

describe('DialogNewChannelAddUserComponent', () => {
  let component: DialogNewChannelAddUserComponent;
  let fixture: ComponentFixture<DialogNewChannelAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNewChannelAddUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogNewChannelAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
