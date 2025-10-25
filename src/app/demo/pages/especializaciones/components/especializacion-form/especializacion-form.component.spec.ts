import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecializacionFormComponent } from './especializacion-form.component';

describe('EspecializacionFormComponent', () => {
  let component: EspecializacionFormComponent;
  let fixture: ComponentFixture<EspecializacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecializacionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecializacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
