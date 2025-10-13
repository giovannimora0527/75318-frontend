// angular import
import { Component, OnDestroy, OnInit } from '@angular/core';

// librería para pantalla completa
import screenfull from 'screenfull';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit, OnDestroy {
  screenFull = true;

  // ✅ handler fijo para evitar bucles infinitos
  private screenfullHandler = () => {
    this.screenFull = screenfull.isFullscreen;
  };

  ngOnInit() {
    if (screenfull.isEnabled) {
      this.screenFull = screenfull.isFullscreen;
      screenfull.on('change', this.screenfullHandler);
    }
  }

  ngOnDestroy() {
    if (screenfull.isEnabled) {
      screenfull.off('change', this.screenfullHandler);
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

