import { Component, OnDestroy } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';


// providers
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { AutoControlPesoPage } from './autoControlPeso';
import { AutoControlPresionPage } from './autoControlPresion';
import { AutoControlTallaPage } from './autoControlTalla';

@Component({
    selector: 'listaAutoControl',
    templateUrl: 'listaAutoControl.html',
})
export class ListaAutoControlPage implements OnDestroy {
    ultimoPeso: any;
    ultimoPesoFecha: any;

    ultimaTalla: any;
    ultimaTallaFecha: any;

    ultimaPresion: any;
    ultimaPresionFecha: any;


    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public navCtrl: NavController,
        public menuCtrl: MenuController) {
    }

    pacienteLocalStorage = [];

    ngOnDestroy() {

    }

    ionViewDidLoad() {
        this.loadFromLocalStorage()
    }

    loadFromLocalStorage() {
        this.storage.keys().then((keys) => {
            if (keys.length) {
                keys.forEach(async key => {
                    let item = await this.storage.get(key);
                    if (key.includes('patientStorage')) {
                        this.pacienteLocalStorage[key] = item;
                        this.ultimoPeso = this.pacienteLocalStorage['patientStorage.peso'];
                        this.ultimaPresion = this.pacienteLocalStorage['patientStorage.presion'];
                    }
                });
            }
        });
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

    autocontrolTalla() {
        if (this.isLogin()) {
            this.navCtrl.push(AutoControlTallaPage);
        }
    }

}
