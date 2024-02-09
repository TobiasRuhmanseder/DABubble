import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFooterComponent } from './message-footer.component';

describe('MessageFooterComponent', () => {
  let component: MessageFooterComponent;
  let fixture: ComponentFixture<MessageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
