import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMessageUserListElementComponent } from './direct-message-user-list-element.component';

describe('DirectMessageUserListElementComponent', () => {
  let component: DirectMessageUserListElementComponent;
  let fixture: ComponentFixture<DirectMessageUserListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectMessageUserListElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectMessageUserListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
