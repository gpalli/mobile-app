import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, NavParams, LoadingController, MenuController, Platform, AlertController } from 'ionic-angular';


// providers
import { AuthProvider } from '../../providers/auth/auth';
import { PacienteProvider } from '../../providers/paciente';
import { ConstanteProvider } from '../../providers/constantes';
import { ToastProvider } from '../../providers/toast';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'autoControlPresion',
    templateUrl: 'autoControlPresion.html',
})
export class AutoControlPresionPage implements OnDestroy {

    ngOnDestroy() {
    }

    inProgress = false;
    datosGraficar = false;
    flagPresion = true;
    presionSistolica = '';
    presionDiastolica = '';
    presionFecha;

    ultimaPresionSistolica = '';
    ultimaPresionDiastolica = '';

    pacienteLocalStorage = {
        presion: {
            fecha: this.UTCToLocalTimeString(new Date()),
            sistolica: '0',
            diastolica: '0'
        },
        grupoFactor: '1',
        presionHistory: [
            { data: [0], label: 'Sistólica' },
            { data: [0], label: 'Diastólica' }
        ]
    };

    lineChartData = [{ data: [], label: '' }];
    lineChartDataPresion = [{ data: [], label: '' }];
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
        this.storage.get('patientStorage').then((itemFound) => {
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
        this.presionFecha = this.UTCToLocalTimeString(new Date());
        this.flagPresion = true;
        this.datosGraficar = false;
    }

    // Función para convertir a fecha y hora actual y que sea reconocido por el componente (ya que siempre espera ISOString)
    UTCToLocalTimeString(d: Date) {
        let timeOffsetInHours = (d.getTimezoneOffset() / 60) * (-1);
        d.setHours(d.getHours() + timeOffsetInHours);

        return d.toISOString();
    }



    guardarPresion() {
        this.pacienteLocalStorage.presion.fecha = this.presionFecha;
        this.pacienteLocalStorage.presion.sistolica = this.presionSistolica;
        this.pacienteLocalStorage.presion.diastolica = this.presionDiastolica;
        let newPresion: any = {
            fecha: this.pacienteLocalStorage.presion.fecha,
            sistolica: this.pacienteLocalStorage.presion.diastolica,
            diastolica: this.pacienteLocalStorage.presion.sistolica
        };
        this.pacienteLocalStorage.presionHistory.push(newPresion);
        this.flagPresion = false;
        this.datosGraficar = false;
        this.storage.set('patientStorage', this.pacienteLocalStorage).then((item) => {
            this.loadChartPresion();
            return;
        });
    }
    cancelarPresion() {
        this.flagPresion = false;
        this.navCtrl.pop();
    }

    loadChartPresion() {

        let presionSistolicaData = this.pacienteLocalStorage.presionHistory.map(sistolicas => {
            return sistolicas['sistolica']
        });
        let presionDiastolicaData = this.pacienteLocalStorage.presionHistory.map(diastolicas => {
            return diastolicas['diastolica']
        });
        let presionFecha = this.pacienteLocalStorage.presionHistory.map(dates => {
            return dates['fecha']
        })

        this.lineChartDataPresion = [
            { data: presionSistolicaData, label: 'Sistólica' },
            { data: presionDiastolicaData, label: 'Diastólica' }
        ];
        this.lineChartLabelsPresion = presionFecha;
        this.lineChartOptionsPresion = {
            responsive: true
        };
        this.lineChartTypePresion = 'line';
        this.datosGraficar = true;
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
