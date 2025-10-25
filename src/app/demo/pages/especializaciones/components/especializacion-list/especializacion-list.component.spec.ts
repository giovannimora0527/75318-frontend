import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecializacionListComponent } from './especializacion-list.component';

describe('EspecializacionListComponent', () => {
  let component: EspecializacionListComponent;
  let fixture: ComponentFixture<EspecializacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecializacionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecializacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
