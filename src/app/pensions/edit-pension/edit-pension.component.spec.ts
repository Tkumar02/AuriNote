import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPensionComponent } from './edit-pension.component';

describe('EditPensionComponent', () => {
  let component: EditPensionComponent;
  let fixture: ComponentFixture<EditPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
