import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChannelListElementComponent } from './new-channel-list-element.component';

describe('NewChannelListElementComponent', () => {
  let component: NewChannelListElementComponent;
  let fixture: ComponentFixture<NewChannelListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewChannelListElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewChannelListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
