import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentBodyComponent } from './main-content-body.component';

describe('MainContentBodyComponent', () => {
  let component: MainContentBodyComponent;
  let fixture: ComponentFixture<MainContentBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentBodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainContentBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
