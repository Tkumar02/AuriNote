import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestEditComponent } from './invest-edit.component';

describe('InvestEditComponent', () => {
  let component: InvestEditComponent;
  let fixture: ComponentFixture<InvestEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
