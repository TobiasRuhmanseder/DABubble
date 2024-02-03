import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectMessageViewComponent } from './direct-message-view.component';

describe('DirectMessageViewComponent', () => {
  let component: DirectMessageViewComponent;
  let fixture: ComponentFixture<DirectMessageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectMessageViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectMessageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
