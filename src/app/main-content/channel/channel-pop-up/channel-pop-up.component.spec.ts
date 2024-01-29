import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPopUpComponent } from './channel-pop-up.component';

describe('ChannelPopUpComponent', () => {
  let component: ChannelPopUpComponent;
  let fixture: ComponentFixture<ChannelPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
