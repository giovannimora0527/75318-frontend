<<<<<<< HEAD
// angular import
import { Component, OnDestroy, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavSearchComponent } from './nav-search/nav-search.component';

//
import screenfull from 'screenfull';

@Component({
  selector: 'app-nav-left',
  imports: [SharedModule],
=======
import { Component, OnDestroy, OnInit } from '@angular/core';
import screenfull from 'screenfull';
import { CommonModule } from '@angular/common'; // 👈 Asegúrate de importar esto

@Component({
  selector: 'app-nav-left',
  standalone: true, // 👈 Usa standalone si tu proyecto lo permite
  imports: [CommonModule], // 👈 Necesario para usar ngClass
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit, OnDestroy {
<<<<<<< HEAD
  screenFull = true;

  // life cycle hook
  ngOnInit() {
    if (screenfull.isEnabled) {
      this.screenFull = screenfull.isFullscreen; // Initialize based on current fullscreen state
=======
  screenFull = false;

  ngOnInit() {
    if (screenfull.isEnabled) {
      this.screenFull = screenfull.isFullscreen;
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
      screenfull.on('change', () => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }

  ngOnDestroy() {
    if (screenfull.isEnabled) {
      screenfull.off('change', () => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle().then(() => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }
}
<<<<<<< HEAD
=======


>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
