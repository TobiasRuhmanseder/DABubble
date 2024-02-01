import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChannelMemberComponent } from './dialog-channel-member.component';

describe('DialogChannelMemberComponent', () => {
  let component: DialogChannelMemberComponent;
  let fixture: ComponentFixture<DialogChannelMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogChannelMemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogChannelMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
