import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTitleComponent } from './message-title.component';

describe('MessageTitleComponent', () => {
  let component: MessageTitleComponent;
  let fixture: ComponentFixture<MessageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageTitleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
