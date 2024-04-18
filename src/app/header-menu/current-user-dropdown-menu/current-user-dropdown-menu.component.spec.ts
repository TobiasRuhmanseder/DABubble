import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentUserDropdownMenuComponent } from './current-user-dropdown-menu.component';

describe('CurrentUserDropdownMenuComponent', () => {
  let component: CurrentUserDropdownMenuComponent;
  let fixture: ComponentFixture<CurrentUserDropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentUserDropdownMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentUserDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
