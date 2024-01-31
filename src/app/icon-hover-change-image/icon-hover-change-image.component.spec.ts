import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconHoverChangeImageComponent } from './icon-hover-change-image.component';

describe('IconHoverChangeImageComponent', () => {
  let component: IconHoverChangeImageComponent;
  let fixture: ComponentFixture<IconHoverChangeImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconHoverChangeImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconHoverChangeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
