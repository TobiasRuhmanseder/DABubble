import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelListElementComponent } from './channel-list-element.component';

describe('ChannelListElementComponent', () => {
  let component: ChannelListElementComponent;
  let fixture: ComponentFixture<ChannelListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelListElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
