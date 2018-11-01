import { Component, OnDestroy } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';


// providers
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { AutoControlPesoPage } from './autoControlPeso';
import { AutoControlPresionPage } from './autoControlPresion';
import * as moment from 'moment';

@Component({
    selector: 'listaAutoControl',
    templateUrl: 'listaAutoControl.html',
})
export class ListaAutoControlPage implements OnDestroy {

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public navCtrl: NavController,
        public menuCtrl: MenuController) {
    }

    pacienteLocalStorage = {
        presion: {
            fecha: moment(new Date()).format('DD-MM-YYYY HH:mm'),
            sistolica: '',
            diastolica: ''
        },
        grupoFactor: '1',
        presionHistory: [
            { data: [0], label: 'Sistólica' },
            { data: [0], label: 'Diastólica' }
        ],
        peso: {
            fecha: moment(new Date()).format('DD-MM-YYYY HH:mm'),
            valor: ''
        },
        pesoHistory: [{ data: [0], label: 'Peso' }],
    };

    ngOnDestroy() {

    }

    ionViewDidLoad() {
        this.loadFromLocalStorage()
    }

    loadFromLocalStorage() {
        // this.storage.set('patientStorage', null);
        this.storage.get('patientStorage').then((itemFound) => {
            if (itemFound) {
                this.pacienteLocalStorage = itemFound;
            }
        })
    }

    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    isLogin() {
        return this.authService.user != null;
    }

    autocontrolPeso() {
        if (this.isLogin()) {
            this.navCtrl.push(AutoControlPesoPage);
        }
    }

    autocontrolPresion() {
        if (this.isLogin()) {
            this.navCtrl.push(AutoControlPresionPage);
        }
    }

    // Función para convertir a fecha y hora actual y que sea reconocido por el componente (ya que siempre espera ISOString)
    UTCToLocalTimeString(d: Date) {
        let timeOffsetInHours = (d.getTimezoneOffset() / 60) * (-1);
        d.setHours(d.getHours() + timeOffsetInHours);

        return d.toISOString();
    }
}
