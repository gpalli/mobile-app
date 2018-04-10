import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';


@Component({
    selector: 'dar-turno',
    templateUrl: 'dar-turno.html'
})
export class DarTurnoPage {
    agenda: any;
    bloque: any;
    turno: any;
    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform) {
        this.agenda = this.navParams.get('agenda');
        this.bloque = this.navParams.get('bloque');
        this.turno = this.navParams.get('turno');

        this.onResumeSubscription = platform.resume.subscribe(() => {
        });
    }



    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

}
