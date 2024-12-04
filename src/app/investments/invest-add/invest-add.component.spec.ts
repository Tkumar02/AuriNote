import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestAddComponent } from './invest-add.component';

describe('InvestAddComponent', () => {
  let component: InvestAddComponent;
  let fixture: ComponentFixture<InvestAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
