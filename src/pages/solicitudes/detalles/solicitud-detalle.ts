import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AgendasPacientePage } from '../../agendas/agendas';

@Component({
    selector: 'solicitud-detalle',
    templateUrl: 'solicitud-detalle.html'
})
export class SolicitudesDetallePage {

    private solicitud: any;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
    ) {
        this.solicitud = this.navParams.get('solicitud');
    }

    // ngOnInit() {
    //     console.log(this.solicitud)
    // }

    turnos() {
        this.navCtrl.push(AgendasPacientePage, { solicitud: this.solicitud });
    }
    // ngOnDestroy() {
    //     // always unsubscribe your subscriptions to prevent leaks
    //     //this.onResumeSubscription.unsubscribe();
    // }

    // profesionalName() {
    //     return this.solicitud.profesionales[0].apellido + ' ' + this.solicitud.profesionales[0].nombre;
    // }

    // solicitudFecha() {
    //     return moment(this.solicitud.horaInicio).format('DD/MM/YY');
    // }

    // solicitudHora() {
    //     return moment(this.solicitud.horaInicio).format('HH:mm');
    // }



    // ionViewDidLoad() {
    // }

}
