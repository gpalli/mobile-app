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
    selector: 'autoControlPeso',
    templateUrl: 'autoControlPeso.html',
})
export class AutoControlPesoPage implements OnDestroy {
    data: any[];

    ngOnDestroy() {
    }

    onClear(e) {
        return e;
    }

    inProgress = false;
    datosGraficar = false;
    flagPeso = false;

    pesoFecha;
    pesoValor = null;
    ultimoPeso = null;
    ultimoPesoFecha = null;

    pacienteLocalStorage = {
        fecha: null,
        valor: 0,
        historico: [{ fecha: new Date(), valor: null }],
    };

    // lineChartData = [{ data: [], label: '' }];
    // lineChartLabels = [];
    // lineChartColors = [{
    //     backgroundColor: 'rgba(103, 58, 183, .1)',
    //     borderColor: 'rgb(103, 58, 183)',
    //     pointBackgroundColor: 'rgb(103, 58, 183)',
    //     pointBorderColor: '#fff',
    //     pointHoverBackgroundColor: '#fff',
    //     pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    // }];

    // lineChartOptions = {
    //     responsive: true
    // };

    // lineChartType = 'line';
    // lineChartColorsPresion = [{ // dark grey
    //     backgroundColor: 'rgba(77,83,96,0.2)',
    //     borderColor: 'rgba(77,83,96,1)',
    //     pointBackgroundColor: 'rgba(77,83,96,1)',
    //     pointBorderColor: '#fff',
    //     pointHoverBackgroundColor: '#fff',
    //     pointHoverBorderColor: 'rgba(77,83,96,1)'
    // }];

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
    ) {

    }

    ionViewDidLoad() {
        this.inProgress = true;
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {

        this.storage.get('patientStorage.peso').then((itemFound) => {
            if (itemFound) {
                this.pacienteLocalStorage = itemFound;
                this.data = this.pacienteLocalStorage.historico.filter(x => typeof x.fecha !== 'undefined').map(y => ({ date: new Date(y.fecha), value: parseFloat(y.valor) }));
                this.data.sort((a, b) => b.date - a.date);

                if (this.pacienteLocalStorage && this.pacienteLocalStorage.historico) {
                    this.ultimoPeso = this.pacienteLocalStorage.historico[this.pacienteLocalStorage.historico.length - 1].valor;
                }
            }
            this.inProgress = false;
            this.datosGraficar = true;
            // this.loadChartPeso();
        })
    }

    agregarPeso() {
        this.pesoFecha = moment(new Date()).format('ll hh:mm');
        this.flagPeso = true;
        this.datosGraficar = false;
    }

    guardarPeso() {
        if (!this.pesoFecha) {
            this.toast.danger('Ingresá una fecha');
            return;
        }
        if (!this.pesoValor || this.pesoValor === 0) {
            this.toast.danger('Ingresá un valor de peso');
            return;
        }
        this.pacienteLocalStorage.fecha = this.pesoFecha;
        this.pacienteLocalStorage.valor = this.pesoValor;
        let newPeso: any = {
            fecha: this.pacienteLocalStorage.fecha,
            valor: this.pacienteLocalStorage.valor
        };
        this.pacienteLocalStorage.historico.push(newPeso);
        this.flagPeso = false;
        this.datosGraficar = false;
        this.storage.set('patientStorage.peso', this.pacienteLocalStorage).then((item) => {
            this.ultimoPeso = this.pacienteLocalStorage.valor;
            this.loadChartPeso();
            this.pesoValor = this.pesoFecha = null;
            return;
        });
    }
    cancelarPeso() {
        this.flagPeso = false;
    }

    loadChartPeso() {

        let pesoFecha = null;
        let pesoData = null;

        if (this.pacienteLocalStorage.historico) {
            pesoFecha = this.pacienteLocalStorage.historico.map(dates => {
                return moment(dates['fecha']).format('ll hh:mm') || moment(new Date()).format('ll hh:mm');
            })
            pesoData = this.pacienteLocalStorage.historico.map(values => {
                return values['valor'];
            });
            // this.lineChartData = [
            //     { data: pesoData, label: 'Peso' }
            // ];
            // this.lineChartLabels = pesoFecha;
            // this.lineChartOptions = {
            //     responsive: true
            // };
            // this.lineChartType = 'line';
            this.datosGraficar = true;

            this.ultimoPeso = pesoData[pesoData.length - 1];
            this.ultimoPesoFecha = pesoFecha[pesoFecha.length - 1];
        }

    }

    onChartHover(evento) {
        console.log('evento.........: ', evento);
    }

    eliminarPeso() {

        let alert = this.alertCtrl.create({
            title: 'Confirmar',
            message: '¿Eliminar último registro de peso?',
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
                        this.storage.set('patientStorage.peso', this.pacienteLocalStorage).then((item) => {
                            this.ultimoPeso = this.pacienteLocalStorage.valor;
                            this.loadChartPeso();
                            this.pesoValor = this.pesoFecha = null;
                            return;
                        });
                    }
                }
            ]
        });
        alert.present();

    }

}

