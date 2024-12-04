import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestSummaryComponent } from './invest-summary.component';

describe('InvestSummaryComponent', () => {
  let component: InvestSummaryComponent;
  let fixture: ComponentFixture<InvestSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
