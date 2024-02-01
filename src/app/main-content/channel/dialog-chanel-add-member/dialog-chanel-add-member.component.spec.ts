import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChanelAddMemberComponent } from './dialog-chanel-add-member.component';

describe('DialogChanelAddMemberComponent', () => {
  let component: DialogChanelAddMemberComponent;
  let fixture: ComponentFixture<DialogChanelAddMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogChanelAddMemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogChanelAddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
