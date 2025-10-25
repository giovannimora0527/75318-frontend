import { Component } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styles: [`.overlay { position: fixed; top:0; left:0; right:0; bottom:0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.2); z-index:9999; }`]
})
export class SpinnerComponent {
  loading$: Observable<boolean>;
  constructor(private spinner: SpinnerService) {
    this.loading$ = this.spinner.loading$;
  }
}
