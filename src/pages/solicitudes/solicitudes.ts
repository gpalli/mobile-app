import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SolicitudesProvider } from '../../providers/solicitudes';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
    selector: 'page-solicitudes',
    templateUrl: 'solicitudes.html'
})
export class SolicitudesPage {
    public solicitudes;
    constructor(public authProvider: AuthProvider, private solicitudesProvider: SolicitudesProvider) { }
    ngOnInit() {
        let params = {
            'idPaciente': this.authProvider.user.pacientes[0].id,
            'estado': 'pendiente'
        }
        this.solicitudesProvider.get(params).then((data: any[]) => {
            this.solicitudes = data;
        })
    }
}

