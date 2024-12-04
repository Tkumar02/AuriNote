import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPensionsComponent } from './view-pensions.component';

describe('ViewPensionsComponent', () => {
  let component: ViewPensionsComponent;
  let fixture: ComponentFixture<ViewPensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPensionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
