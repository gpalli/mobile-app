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
    agendas: any[] = null;
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
        let data = {
            estados: ['publicada'],
            idProfesional: solicitud.profesional.id,
            fechaDesde: moment(solicitud.fecha).startOf('day').toISOString(),
            idTipoPrestacion: solicitud.tipoPrestacion.id
        };
        this.agendasProvider.get(data).then((data: any[]) => {
            this.agendas = data;
        })
    }

    // onCancelAgenda($event) {
    //     console.log('onCancelAgenda');
    // }

    verDetalle(agenda) {
        this.navCtrl.push(AgendasPacienteDetallePage, { agenda: agenda, tipoPrestacion: this.tipoPrestacion });
    }

}
