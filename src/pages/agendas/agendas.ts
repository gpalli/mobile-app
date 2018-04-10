import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';

// providers
import { AgendasProvider } from '../../providers/agendas';
import { AuthProvider } from '../../providers/auth/auth';
import { AgendasPacienteDetallePage } from './agenda-detalle/agenda-detalle';
// import { AgendaDetallePage } from '../../../pages/profesional/agendas/agenda-detalle/agenda-detalle';

@Component({
    selector: 'page-agendasPaciente',
    templateUrl: 'agendas.html'
})
export class AgendasPacientePage {
    agendas = [];
    private tipoPrestacion: any;
    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public agendasProvider: AgendasProvider,
        public platform: Platform) {
        let solicitud = this.navParams.get('solicitud');
        this.tipoPrestacion = solicitud.tipoPrestacion;
        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.getAgendas(solicitud);
        });

        this.getAgendas(solicitud);
    }

    ngOnDestroy() {
        // always unsubscribe your subscriptions to prevent leaks
        this.onResumeSubscription.unsubscribe();
    }

    getAgendas(solicitud) {
        let params = {
            estados: ['publicada'],
            idProfesional: solicitud.profesional.id,
            fechaDesde: moment(solicitud.fecha).startOf('day').toISOString(),
            idTipoPrestacion: solicitud.tipoPrestacion.id,
            organizacion: solicitud.organizacion.id
        };

        this.agendasProvider.get(params).then((data: any[]) => {
            for (let agenda of data) {
                let resultado = agenda.bloques.filter(bloque => {
                    let result = bloque.tipoPrestaciones.filter(tipo => {
                        return (tipo.id == this.tipoPrestacion.id);
                    });
                    return ((result.length > 0)
                        && bloque.restantesProgramados > 0
                        && bloque.turnos.find(turno => turno.estado === 'disponible') != null);
                });
                if (resultado.length > 0) {
                    this.agendas.push(agenda);
                }
            }
        })
    }

    verDetalle(agenda) {
        this.navCtrl.push(AgendasPacienteDetallePage, { agenda: agenda, tipoPrestacion: this.tipoPrestacion });
    }

}
