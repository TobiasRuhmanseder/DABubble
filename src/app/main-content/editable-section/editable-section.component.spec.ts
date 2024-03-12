import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableSectionComponent } from './editable-section.component';

describe('EditableSectionComponent', () => {
  let component: EditableSectionComponent;
  let fixture: ComponentFixture<EditableSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditableSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
