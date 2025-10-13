import { Component, OnDestroy, OnInit } from '@angular/core';
import screenfull from 'screenfull';
import { CommonModule } from '@angular/common'; // 👈 Asegúrate de importar esto

@Component({
  selector: 'app-nav-left',
  standalone: true, // 👈 Usa standalone si tu proyecto lo permite
  imports: [CommonModule], // 👈 Necesario para usar ngClass
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit, OnDestroy {
  screenFull = false;

  ngOnInit() {
    if (screenfull.isEnabled) {
      this.screenFull = screenfull.isFullscreen;
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


