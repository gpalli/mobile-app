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

    hoy = moment().format('DD-MM-YYY');

    pacienteLocalStorage = {
        peso: {
            fecha: moment(new Date()).format('DD-MM-YYYY hh:mm'),
            valor: 0
        },
        grupoFactor: '1',
        pesoHistory: [{ data: [0], label: 'Peso' }],
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

        this.storage.get('patientStorage').then((itemFound) => {
            if (itemFound) {
                this.pacienteLocalStorage = itemFound;
                this.ultimoPeso = this.pacienteLocalStorage.peso && this.pacienteLocalStorage.peso.valor ? this.pacienteLocalStorage.peso.valor : 0;
            }
            this.inProgress = false;
            this.loadChartPeso();
        })
    }

    agregarPeso() {
        this.pesoFecha = moment(new Date()).format('DD-MM-YYYY hh:mm');
        this.flagPeso = true;
        this.datosGraficar = false
    }

    // Función para convertir a fecha y hora actual y que sea reconocido por el componente (ya que siempre espera ISOString)
    UTCToLocalTimeString(d: Date) {
        let timeOffsetInHours = (d.getTimezoneOffset() / 60) * (-1);
        d.setHours(d.getHours() + timeOffsetInHours);

        return d.toISOString();
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
        this.pacienteLocalStorage.peso.fecha = this.pesoFecha;
        this.pacienteLocalStorage.peso.valor = this.pesoValor;
        let newPeso: any = {
            fecha: this.pacienteLocalStorage.peso.fecha,
            valor: this.pacienteLocalStorage.peso.valor
        };
        this.pacienteLocalStorage.pesoHistory.push(newPeso);
        this.flagPeso = false;
        this.datosGraficar = false;
        this.storage.set('patientStorage', this.pacienteLocalStorage).then((item) => {
            this.ultimoPeso = this.pacienteLocalStorage.peso.valor;
            this.loadChartPeso();
            this.pesoValor = this.pesoFecha = null;
            return;
        });
    }
    cancelarPeso() {
        this.flagPeso = false;
        // this.navCtrl.pop();
    }

    loadChartPeso() {

        let pesoFecha = null;
        let pesoData = null;

        if (this.pacienteLocalStorage.pesoHistory) {
            pesoFecha = this.pacienteLocalStorage.pesoHistory.map(dates => {
                return dates['fecha'] || moment(new Date()).format('DD-MM-YYYY hh:mm');
            })
            pesoData = this.pacienteLocalStorage.pesoHistory.map(values => {
                return values['valor'];
            });
            this.lineChartData = [
                { data: pesoData, label: 'Peso' }
            ];
            this.lineChartLabels = pesoFecha;
            this.lineChartOptions = {
                responsive: true
            };
            this.lineChartType = 'line';
            this.datosGraficar = true;

            this.ultimoPeso = pesoData[pesoData.length - 1];
            this.ultimoPesoFecha = pesoFecha[pesoFecha.length - 1];
        }

    }


    // onInputChange(list, newType) {
    //     let last = list.length - 1;
    //     if (list[last].valor.length > 0) {
    //         list.push({ tipo: newType, valor: '' });
    //     } else if (list.length > 1 && list[last - 1].valor.length === 0) {
    //         list.pop();
    //     }
    // }




}
