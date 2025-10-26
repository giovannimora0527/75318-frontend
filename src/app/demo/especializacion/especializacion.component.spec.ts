import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EspecializacionComponent } from './especializacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('EspecializacionComponent', () => {
  let component: EspecializacionComponent;
  let fixture: ComponentFixture<EspecializacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      
      imports: [
        EspecializacionComponent, 
        HttpClientTestingModule, 
        ReactiveFormsModule
      ],
      
      providers: [
        FormBuilder
        
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecializacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

});
