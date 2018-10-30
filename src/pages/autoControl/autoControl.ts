// import { Component } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { NavController, NavParams, LoadingController, MenuController, Platform, SelectPopover } from 'ionic-angular';
// import * as moment from 'moment';
// import { Camera, CameraOptions } from '@ionic-native/camera';
// import { Crop } from '@ionic-native/crop';
// import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
// import { Base64 } from '@ionic-native/base64';
// import { PhotoViewer } from '@ionic-native/photo-viewer';
// import { DomSanitizer } from '@angular/platform-browser';
// import { NativeGeocoder } from '@ionic-native/native-geocoder';
// import { ChartsModule } from 'ng2-charts';

// // pages
// import { DondeVivoDondeTrabajoPage } from './donde-vivo-donde-trabajo/donde-vivo-donde-trabajo';

// // providers
// import { AlertController } from 'ionic-angular';
// import { AuthProvider } from '../../providers/auth/auth';
// import { EditorPacientePage } from '../editor-paciente/editor-paciente';
// import { Storage } from '@ionic/storage';
// import { PacienteProvider } from '../../providers/paciente';
// import { ConstanteProvider } from '../../providers/constantes';
// import { ToastProvider } from '../../providers/toast';

// @Component({
//     selector: 'page-profile-paciente',
//     templateUrl: 'profile-paciente.html',
// })
// export class ProfilePacientePage {
//     emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
//     phoneRegex = /^[1-3][0-9]{9}$/;

//     showPersonal = false;
//     showContactos = false;
//     showDondeVivo = false;
//     showDondeTrabajo = false;

//     contactType = [
//         'celular',
//         'fijo'
//     ];

//     reportarError: any;
//     paciente: any = null;
//     contactos: any[];
//     direcciones: any[];

//     telefonos: any[];
//     emails: any[];

//     provSelect: any;
//     localidadSelect: any;
//     direccion = '';

//     provincias: any = [];
//     localidades: any = [];

//     direccionDondeVivo: any = {};
//     direccionDondeTrabajo: any = {};

//     photo: any = 'assets/img/user-profile-blank.jpg';

//     mapObject: any;
//     inProgress = false;
//     datosGraficar = false;
//     flagPeso = false;
//     flagPresion = false;
//     presionFecha;
//     pesoFecha;
//     pacienteLocalStorage = {
//         peso: {
//             fecha: this.UTCToLocalTimeString(new Date()),
//             valor: '0'
//         },
//         presion: {
//             fecha: this.UTCToLocalTimeString(new Date()),
//             sistolica: '0',
//             diastolica: '0'
//         },
//         grupoFactor: '0',
//         pesoHistory: [{ data: [0], label: 'Peso' }],
//         presionHistory: [
//             { data: [0], label: 'Sistólica' },
//             { data: [0], label: 'Diastólica' }
//         ]
//     };

//     lineChartData = [{ data: [], label: '' }];
//     lineChartDataPresion = [{ data: [], label: '' }];
//     lineChartLabels = [];
//     lineChartColors = [{
//         backgroundColor: 'rgba(103, 58, 183, .1)',
//         borderColor: 'rgb(103, 58, 183)',
//         pointBackgroundColor: 'rgb(103, 58, 183)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(103, 58, 183, .8)'
//     }];

//     lineChartLabelsPresion = [];
//     lineChartOptions = {
//         responsive: true
//     };
//     lineChartOptionsPresion = {
//         responsive: true
//     }
//     lineChartType = 'line';
//     lineChartTypePresion = 'line';
//     lineChartColorsPresion = [{ // grey
//         backgroundColor: 'rgba(148,159,177,0.2)',
//         borderColor: 'rgba(148,159,177,1)',
//         pointBackgroundColor: 'rgba(148,159,177,1)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//     },
//     { // dark grey
//         backgroundColor: 'rgba(77,83,96,0.2)',
//         borderColor: 'rgba(77,83,96,1)',
//         pointBackgroundColor: 'rgba(77,83,96,1)',
//         pointBorderColor: '#fff',
//         pointHoverBackgroundColor: '#fff',
//         pointHoverBorderColor: 'rgba(77,83,96,1)'
//     }];

//     constructor(
//         public storage: Storage,
//         public authService: AuthProvider,
//         public loadingCtrl: LoadingController,
//         public navCtrl: NavController,
//         public navParams: NavParams,
//         public alertCtrl: AlertController,
//         public formBuilder: FormBuilder,
//         public menu: MenuController,
//         public pacienteProvider: PacienteProvider,
//         public assetProvider: ConstanteProvider,
//         public toast: ToastProvider,
//         public platform: Platform,
//         private camera: Camera,
//         private cropService: Crop,
//         private imageResizer: ImageResizer,
//         private base64: Base64,
//         private photoViewer: PhotoViewer,
//         private sanitizer: DomSanitizer,
//         private nativeGeocoder: NativeGeocoder
//     ) {
//         // this.menu.swipeEnable(false);

//     }


//     ionViewDidLoad() {
//         let pacienteId = this.authService.user.pacientes[0].id;
//         this.inProgress = true;
//         this.pacienteProvider.get(pacienteId).then(async (paciente: any) => {
//             this.inProgress = false;
//             this.paciente = paciente;
//             this.loadFromLocalStorage()
//         }).catch(() => {
//             this.inProgress = false;
//         });

//     }

//     loadFromLocalStorage() {
//         // this.storage.set('patientStorage', null);
//         this.storage.get('patientStorage').then((itemFound) => {
//             if (itemFound) {
//                 this.pacienteLocalStorage = itemFound;
//             }
//             this.loadChartPresion();
//             this.loadChartPeso();
//         })
//     }

//     agregarPeso() {
//         this.pesoFecha = this.UTCToLocalTimeString(new Date());
//         this.flagPeso = true;
//         this.datosGraficar = false
//     }

//     agregarPresion() {
//         this.presionFecha = this.UTCToLocalTimeString(new Date());
//         this.flagPresion = true;
//         this.datosGraficar = false;
//     }

//     // Función para convertir a fecha y hora actual y que sea reconocido por el componente (ya que siempre espera ISOString)
//     UTCToLocalTimeString(d: Date) {
//         let timeOffsetInHours = (d.getTimezoneOffset() / 60) * (-1);
//         d.setHours(d.getHours() + timeOffsetInHours);

//         return d.toISOString();
//     }

//     guardarPeso() {
//         this.pacienteLocalStorage.peso.fecha = this.pesoFecha;
//         let newPeso: any = {
//             fecha: this.pacienteLocalStorage.peso.fecha,
//             valor: this.pacienteLocalStorage.peso.valor
//         };
//         this.pacienteLocalStorage.pesoHistory.push(newPeso);
//         this.flagPeso = false;
//         this.datosGraficar = false;
//         this.storage.set('patientStorage', this.pacienteLocalStorage).then((item) => {
//             this.loadChartPresion();
//             this.loadChartPeso();
//             return;
//         });
//     }
//     cancelarPeso() {
//         this.flagPeso = false;
//     }

//     guardarPresion() {
//         this.pacienteLocalStorage.presion.fecha = this.presionFecha;
//         let newPresion: any = {
//             fecha: this.pacienteLocalStorage.presion.fecha,
//             sistolica: this.pacienteLocalStorage.presion.diastolica,
//             diastolica: this.pacienteLocalStorage.presion.sistolica
//         };
//         this.pacienteLocalStorage.presionHistory.push(newPresion);
//         this.flagPresion = false;
//         this.datosGraficar = false;
//         this.storage.set('patientStorage', this.pacienteLocalStorage).then((item) => {
//             this.loadChartPresion();
//             this.loadChartPeso();
//             return;
//         });
//     }
//     cancelarPresion() {
//         this.flagPresion = false;
//     }

//     updateBlood() {
//         this.storage.get('patientStorage').then((datos) => {
//             if (datos) {
//                 datos.grupoFactor = this.pacienteLocalStorage.grupoFactor
//                 this.storage.set('patientStorage', datos);
//             } else {
//                 // Con los datos iniciales
//                 this.storage.set('patientStorage', this.pacienteLocalStorage)
//             }
//         })
//     }

//     loadChartPeso() {

//         let pesoFecha = this.pacienteLocalStorage.pesoHistory.map(dates => {
//             return dates['fecha'];
//         })
//         let pesoData = this.pacienteLocalStorage.pesoHistory.map(values => {
//             return values['valor'];
//         });

//         this.lineChartData = [
//             { data: pesoData, label: 'Peso' }
//         ];
//         this.lineChartLabels = pesoFecha;
//         this.lineChartOptions = {
//             responsive: true
//         };
//         this.lineChartType = 'line';
//         this.datosGraficar = true;
//     }

//     loadChartPresion() {

//         let presionSistolicaData = this.pacienteLocalStorage.presionHistory.map(sistolicas => {
//             return sistolicas['sistolica']
//         });
//         let presionDiastolicaData = this.pacienteLocalStorage.presionHistory.map(diastolicas => {
//             return diastolicas['diastolica']
//         });
//         let presionFecha = this.pacienteLocalStorage.presionHistory.map(dates => {
//             return dates['fecha']
//         })

//         this.lineChartDataPresion = [
//             { data: presionSistolicaData, label: 'Sistólica' },
//             { data: presionDiastolicaData, label: 'Diastólica' }
//         ];
//         this.lineChartLabelsPresion = presionFecha;
//         this.lineChartOptionsPresion = {
//             responsive: true
//         };
//         this.lineChartTypePresion = 'line';
//         this.datosGraficar = true;
//     }

//     onInputChange(list, newType) {
//         let last = list.length - 1;
//         if (list[last].valor.length > 0) {
//             list.push({ tipo: newType, valor: '' });
//         } else if (list.length > 1 && list[last - 1].valor.length === 0) {
//             list.pop();
//         }
//     }




// }
