import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SolicitudesProvider } from '../../providers/solicitudes';
import { AuthProvider } from '../../providers/auth/auth';
import { SolicitudesDetallePage } from './detalles/solicitud-detalle'
@Component({
    selector: 'page-solicitudes',
    templateUrl: 'solicitudes.html'
})
export class SolicitudesPage {
    public solicitudes;
    constructor(
        public authProvider: AuthProvider,
        private solicitudesProvider: SolicitudesProvider,
        public navCtrl: NavController
    ) { }
    ngOnInit() {
        let params = {
            'idPaciente': this.authProvider.user.pacientes[0].id,
            'estado': 'pendiente'
        }
        this.solicitudesProvider.get(params).then((data: any[]) => {
            this.solicitudes = data;
        })
    }

    showDetail(solicitud) {
        this.navCtrl.push(SolicitudesDetallePage, solicitud);
    }
}

