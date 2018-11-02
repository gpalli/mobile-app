import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, NavParams, LoadingController, MenuController, Platform, AlertController } from 'ionic-angular';


// providers
import { AuthProvider } from '../../providers/auth/auth';
import { PacienteProvider } from '../../providers/paciente';
import { ConstanteProvider } from '../../providers/constantes';
import { ToastProvider } from '../../providers/toast';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

@Component({
    selector: 'autoControlPresion',
    templateUrl: 'autoControlPresion.html',
})
export class AutoControlPresionPage implements OnDestroy {

    ngOnDestroy() {
    }

    inProgress = false;
    datosGraficar = false;
    flagPresion = false;
    presionSistolica = null;
    presionDiastolica = null;
    presionFecha;
    newRegistry = true;

    ultimaPresionSistolica = null;
    ultimaPresionDiastolica = null;
    ultimaPresionFecha = null;

    hoy = moment().format('DD-MM-YYY');

    pacienteLocalStorage = {
        fecha: null,
        sistolica: 0,
        diastolica: 0,
        historico: [
            { data: [0], label: 'Sistólica', fecha: moment(new Date()).format('DD-MM-YYYY hh:mm') },
            { data: [0], label: 'Diastólica', fecha: moment(new Date()).format('DD-MM-YYYY hh:mm') }
        ]
    };

    lineChartData = [{ data: [], label: '' }];
    lineChartDataPresion = [{ data: [], label: '', fecha: null }];
    lineChartLabels = [];
    lineChartColors = [{
        backgroundColor: 'rgba(103, 58, 183, .1)',
        borderColor: 'rgb(103, 58, 183)',
        pointBackgroundColor: 'rgb(103, 58, 183)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    }];

    lineChartLabelsPresion = [];
    lineChartOptions = {
        responsive: true
    };

    lineChartOptionsPresion = {
        responsive: true
    };

    lineChartType = 'line';
    lineChartTypePresion = 'line';
    lineChartColorsPresion = [{ // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
    }];

    constructor(
        public storage: Storage,
        public authService: AuthProvider,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public formBuilder: FormBuilder,
        public menu: MenuController,
        public pacienteProvider: PacienteProvider,
        public assetProvider: ConstanteProvider,
        public toast: ToastProvider,
        public platform: Platform
    ) { }

    ionViewDidLoad() {
        this.inProgress = true;
        this.loadFromLocalStorage()
    }

    loadFromLocalStorage() {
        // this.storage.set('patientStorage', null);
        this.storage.get('patientStorage.presion').then((itemFound) => {
            if (itemFound) {
                this.pacienteLocalStorage = itemFound;
            }
            this.inProgress = false;
            this.loadChartPresion();
        })
    }

    onClear(e) {
        return e;
    }

    agregarPresion() {
        this.presionFecha = moment(new Date()).format('ll hh:mm');
        this.flagPresion = true;
        this.datosGraficar = false;
    }

    guardarPresion() {

        if (!this.presionFecha) {
            this.toast.danger('Ingresá la fecha de registro');
            return;
        }
        if (!this.presionSistolica || this.presionSistolica === 0) {
            this.toast.danger('Ingresá tu presión sistólica');
            return;
        }

        if (!this.presionDiastolica || this.presionDiastolica === 0) {
            this.toast.danger('Ingresá tu presión diastólica');
            return;
        }

        this.pacienteLocalStorage.fecha = this.presionFecha;
        this.pacienteLocalStorage.sistolica = this.presionSistolica;
        this.pacienteLocalStorage.diastolica = this.presionDiastolica;

        let newPresion: any = {
            fecha: this.pacienteLocalStorage.fecha,
            sistolica: this.pacienteLocalStorage.diastolica,
            diastolica: this.pacienteLocalStorage.sistolica
        };

        this.pacienteLocalStorage.historico.push(newPresion);
        this.flagPresion = false;
        this.datosGraficar = false;
        this.newRegistry = true;
        this.storage.set('patientStorage.presion', this.pacienteLocalStorage).then((item) => {
            this.loadChartPresion();
            return;
        });
    }

    cancelarPresion() {
        this.flagPresion = false;
        this.newRegistry = true;
        // this.navCtrl.pop();
    }

    loadChartPresion() {

        let presionSistolicaData = null;
        let presionDiastolicaData = null;
        let presionFecha = null;
        if (this.pacienteLocalStorage.historico) {
            presionSistolicaData = this.pacienteLocalStorage.historico.map(sistolicas => {
                return sistolicas['sistolica']
            });
            presionDiastolicaData = this.pacienteLocalStorage.historico.map(diastolicas => {
                return diastolicas['diastolica']
            });
            presionFecha = this.pacienteLocalStorage.historico.map(dates => {
                return moment(dates['fecha']).format('ll hh:mm')
            })

            this.ultimaPresionSistolica = presionSistolicaData[presionSistolicaData.length - 1];
            this.ultimaPresionDiastolica = presionDiastolicaData[presionDiastolicaData.length - 1];
            this.ultimaPresionFecha = presionFecha[presionFecha.length - 1];

        }

        this.lineChartDataPresion = [
            { data: presionSistolicaData, label: 'Sistólica', fecha: moment().format('ll hh:mm') },
            { data: presionDiastolicaData, label: 'Diastólica', fecha: moment().format('ll hh:mm') }
        ];
        this.lineChartLabelsPresion = presionFecha;
        this.lineChartOptionsPresion = {
            responsive: true
        };
        this.lineChartTypePresion = 'line';
        this.datosGraficar = true;
    }


    eliminarPresion() {
        let alert = this.alertCtrl.create({
            title: 'Confirmar',
            message: '¿Eliminar último registro de presión?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Eliminar',
                    handler: () => {
                        this.pacienteLocalStorage.historico.pop();
                        this.storage.set('patientStorage.talla', this.pacienteLocalStorage).then((item) => {
                            this.ultimaPresionSistolica = this.pacienteLocalStorage.sistolica;
                            this.ultimaPresionDiastolica = this.pacienteLocalStorage.diastolica;
                            this.loadChartPresion();
                            this.presionSistolica = this.presionDiastolica = this.presionFecha = null;
                            return;
                        });
                    }
                }
            ]
        });
        alert.present();
    }
}
