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
    }

    // this.ultimaPresion = this.ultimaPresionFecha = this.ultimaTalla = this.ultimaTallaFecha = this.ultimoPeso = this.ultimoPesoFecha = null;
    // ionViewWillEnter() {
    //     this.loadFromLocalStorage();
    // }

    loadFromLocalStorage() {
        this.storage.keys().then((keys) => {
            if (keys.length) {
                keys.forEach(async key => {
                    let item = await this.storage.get(key);
                    if (key.includes('patientStorage')) {
                        // if (item.historico.find(x => x.data).length !== -1) {
                        this.pacienteLocalStorage[key] = item;

                        if (this.pacienteLocalStorage['patientStorage.peso'] && this.pacienteLocalStorage['patientStorage.peso'].historico) {
                            let historicoPeso = this.pacienteLocalStorage['patientStorage.peso'].historico;
                            this.ultimoPeso = historicoPeso[historicoPeso.length - 1];
                        }
                        if (this.pacienteLocalStorage['patientStorage.presion'] && this.pacienteLocalStorage['patientStorage.presion'].historico) {
                            let historicoPresion = this.pacienteLocalStorage['patientStorage.presion'].historico;
                            this.ultimaPresion = historicoPresion[historicoPresion.length - 1];
                        }
                        if (this.pacienteLocalStorage['patientStorage.talla'] && this.pacienteLocalStorage['patientStorage.talla'].historico) {
                            let historicoTalla = this.pacienteLocalStorage['patientStorage.talla'].historico;
                            this.ultimaTalla = historicoTalla[historicoTalla.length - 1];
                        }
                        // }
                    }
                });
            }
        });
    }

    ionViewWillEnter() {
        this.loadFromLocalStorage();
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
