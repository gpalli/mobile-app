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
    turnos = [];
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
        // Filtramos bloques que coincidan con la prestacion
        this.bloques = agenda.bloques.filter(bloque => {
            let result = bloque.tipoPrestaciones.filter(tipo => {
                return (tipo.id == this.tipoPrestacion.id);
            });
            return (result.length > 0)
        });

        for (let bloque of this.bloques) {
            for (let turno of bloque.turnos) {
                if (turno.estado === 'disponible') {
                    this.turnos.push(turno);
                }
            }
        }

        console.log(this.bloques);
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

}
