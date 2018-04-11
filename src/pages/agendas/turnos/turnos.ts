import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';

// providers
import { AgendasProvider } from '../../../providers/agendas';
import { DarTurnoPage } from '../dar-turno/dar-turno';

@Component({
    selector: 'page-turnos-paciente',
    templateUrl: 'turnos.html'
})
export class TurnosPacientePage {
    turnos = [];
    private tipoPrestacion: any;
    bloques: any = null;
    private agenda;
    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public agendasProvider: AgendasProvider,
        public platform: Platform) {

        this.agenda = this.navParams.get('agenda');
        this.tipoPrestacion = this.navParams.get('tipoPrestacion');
        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.filtrarBloques(this.agenda);
        });

        this.filtrarBloques(this.agenda);
    }

    filtrarBloques(agenda) {
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
    }

    darTurno(turno) {
        let arrBloque = this.bloques.filter(bloque => {
            let result = (bloque.turnos.filter(t => {
                return (turno.id === t.id)
            }));
            return (result.length > 0);
        })
        this.navCtrl.push(DarTurnoPage, { agenda: this.agenda, turno: turno, bloque: arrBloque[0], tipoPrestacion: this.tipoPrestacion });
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }

}
