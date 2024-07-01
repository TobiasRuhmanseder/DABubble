import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditUserImgComponent } from './dialog-edit-user-img.component';

describe('DialogEditUserImgComponent', () => {
  let component: DialogEditUserImgComponent;
  let fixture: ComponentFixture<DialogEditUserImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditUserImgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEditUserImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
