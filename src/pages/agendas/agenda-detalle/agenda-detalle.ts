import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';

// providers
import { AgendasProvider } from '../../../providers/agendas';

@Component({
    selector: 'page-agenda-detalle',
    templateUrl: 'agenda-detalle.html'
})
export class AgendasPacienteDetallePage {
    private tipoPrestacion: any;
    bloques: any = null;

    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public agendasProvider: AgendasProvider,
        public platform: Platform) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
        });
        let agenda = this.navParams.get('agenda');
        this.tipoPrestacion = this.navParams.get('tipoPrestacion');
        console.log(agenda)
        console.log(this.tipoPrestacion)
        this.bloques = agenda.bloques.filter(bloque => {
            let result = bloque.tipoPrestaciones.filter(tipo => {
                tipo.id == this.tipoPrestacion.id
            });

            return (result.length > 0)
        });
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

}
