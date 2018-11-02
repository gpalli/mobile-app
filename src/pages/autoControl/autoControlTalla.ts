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
    selector: 'autoControlTalla',
    templateUrl: 'autoControlTalla.html',
})
export class AutoControlTallaPage implements OnDestroy {

    ngOnDestroy() {
    }

    onClear(e) {
        return e;
    }

    inProgress = false;
    datosGraficar = false;
    flagTalla = false;

    tallaFecha;
    tallaValor = null;
    ultimaTalla = null;
    ultimaTallaFecha = null;

    hoy = moment().format('DD-MM-YYY');

    pacienteLocalStorage = {
        fecha: null,
        valor: 0,
        historico: [{ data: [0], label: 'Talla' }],
    };

    lineChartData = [{ data: [], label: '' }];
    lineChartLabels = [];
    lineChartColors = [{
        backgroundColor: 'rgba(103, 58, 183, .1)',
        borderColor: 'rgb(103, 58, 183)',
        pointBackgroundColor: 'rgb(103, 58, 183)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
    }];

    lineChartOptions = {
        responsive: true
    };

    lineChartType = 'line';
    lineChartColorsPresion = [{ // dark grey
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

        this.storage.get('patientStorage.talla').then((itemFound) => {
            if (itemFound) {
                this.pacienteLocalStorage = itemFound;
                this.ultimaTalla = this.pacienteLocalStorage && this.pacienteLocalStorage.valor ? this.pacienteLocalStorage.valor : 0;
            }
            this.inProgress = false;
            this.loadChartTalla();
        })
    }

    agregarTalla() {
        this.tallaFecha = moment(new Date()).format('ll hh:mm');
        this.flagTalla = true;
        this.datosGraficar = false
    }

    guardarTalla() {
        if (!this.tallaFecha) {
            this.toast.danger('Ingresá una fecha');
            return;
        }
        if (!this.tallaValor || this.tallaValor === 0) {
            this.toast.danger('Ingresá un valor de talla');
            return;
        }
        this.pacienteLocalStorage.fecha = this.tallaFecha;
        this.pacienteLocalStorage.valor = this.tallaValor;
        let newTalla: any = {
            fecha: this.pacienteLocalStorage.fecha,
            valor: this.pacienteLocalStorage.valor
        };
        this.pacienteLocalStorage.historico.push(newTalla);
        this.flagTalla = false;
        this.datosGraficar = false;
        this.storage.set('patientStorage.talla', this.pacienteLocalStorage).then((item) => {
            this.ultimaTalla = this.pacienteLocalStorage.valor;
            this.loadChartTalla();
            this.tallaValor = this.tallaFecha = null;
            return;
        });
    }
    cancelarTalla() {
        this.flagTalla = false;
        // this.navCtrl.pop();
    }

    loadChartTalla() {

        let tallaFecha = null;
        let tallaData = null;

        if (this.pacienteLocalStorage.historico) {
            tallaFecha = this.pacienteLocalStorage.historico.map(dates => {
                return moment(dates['fecha']).format('ll hh:mm') || moment(new Date()).format('ll hh:mm');
            })
            tallaData = this.pacienteLocalStorage.historico.map(values => {
                return values['valor'];
            });
            this.lineChartData = [
                { data: tallaData, label: 'Talla' }
            ];
            this.lineChartLabels = tallaFecha;
            this.lineChartOptions = {
                responsive: true
            };
            this.lineChartType = 'line';
            this.datosGraficar = true;

            this.ultimaTalla = tallaData[tallaData.length - 1];
            this.ultimaTallaFecha = tallaFecha[tallaFecha.length - 1];
        }

    }

    eliminarTalla() {

        let alert = this.alertCtrl.create({
            title: 'Confirmar',
            message: '¿Eliminar último registro de talla?',
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
                            this.ultimaTalla = this.pacienteLocalStorage.valor;
                            this.loadChartTalla();
                            this.tallaValor = this.tallaFecha = null;
                            return;
                        });
                    }
                }
            ]
        });
        alert.present();

    }


}
