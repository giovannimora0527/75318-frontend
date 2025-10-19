// angular import
import { Component, inject, output } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
<<<<<<< HEAD
import { NavigationItem, NavigationItems } from '../navigation';
=======
import { NavigationItem, NavigationItems } from 'src/app/theme/layout/admin/navigation/navigation'; // ✅ RUTA CORREGIDA
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';

@Component({
  selector: 'app-nav-content',
  imports: [SharedModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent {
  private location = inject(Location);

<<<<<<< HEAD
  // public method
  // version
=======
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: NavigationItem[];
  wrapperWidth: number;
  windowWidth = window.innerWidth;

  NavCollapsedMob = output();

<<<<<<< HEAD
  // constructor
  constructor() {
=======
  constructor() {
    // ✅ Aquí cargamos los items del menú correctamente
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
    this.navigations = NavigationItems;
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
<<<<<<< HEAD
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
=======
      const up_parent = parent.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger', 'active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger', 'active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger', 'active');
>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
      }
    }
  }
}
<<<<<<< HEAD
=======

>>>>>>> 00707d3287baa9aff4df8c1f76e78b24bd7625a3
