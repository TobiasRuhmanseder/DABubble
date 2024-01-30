import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelChannelMessageComponent } from './channel-channel-message.component';

describe('ChannelChannelMessageComponent', () => {
  let component: ChannelChannelMessageComponent;
  let fixture: ComponentFixture<ChannelChannelMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelChannelMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelChannelMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
