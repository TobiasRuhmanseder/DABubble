import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserInfoComponent } from './dialog-user-info.component';

describe('DialogUserInfoComponent', () => {
  let component: DialogUserInfoComponent;
  let fixture: ComponentFixture<DialogUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUserInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
