import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingLoansComponent } from './pending-loans.component';

describe('PendingLoansComponent', () => {
  let component: PendingLoansComponent;
  let fixture: ComponentFixture<PendingLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
