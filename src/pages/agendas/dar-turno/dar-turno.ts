import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment/moment';
import { PacienteProvider } from '../../../providers/paciente';
import { ToastProvider } from '../../../providers/toast';
import { AuthProvider } from '../../../providers/auth/auth';
import { AgendasProvider } from '../../../providers/agendas';


@Component({
    selector: 'dar-turno',
    templateUrl: 'dar-turno.html'
})
export class DarTurnoPage {
    private tipoPrestacion: any;
    private obraSocialPaciente: any;
    private paciente: any;
    agenda: any;
    bloque: any;
    turno: any;
    private onResumeSubscription: Subscription;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public pacienteProvider: PacienteProvider,
        public authService: AuthProvider,
        public toast: ToastProvider,
        public agendasProvider: AgendasProvider
    ) {

        this.agenda = this.navParams.get('agenda');
        this.bloque = this.navParams.get('bloque');
        this.turno = this.navParams.get('turno');
        this.tipoPrestacion = this.navParams.get('tipoPrestacion');

        // console.log(this.agenda)
        // console.log(this.bloque)
        // console.log(this.turno)

        // this.onResumeSubscription = platform.resume.subscribe(() => {
        // });
    }

    profesionalName() {
        return this.agenda.profesionales[0].apellido + ' ' + this.agenda.profesionales[0].nombre;
    }

    turnoFecha() {
        return moment(this.turno.horaInicio).format('DD/MM/YY');
    }

    turnoHora() {
        return moment(this.turno.horaInicio).format('HH:mm');
    }

    confirmar() {
        let pacienteId = this.authService.user.pacientes[0].id;
        this.pacienteProvider.get(pacienteId).then((paciente: any) => {
            // this.pacienteProvider.getObraSocial(this.paciente.documento).then((os: any) => {
            //     console.log(os);
            //     this.obraSocialPaciente = os;
            // });
            let pacienteSave = {
                id: paciente.id,
                documento: paciente.documento,
                apellido: paciente.apellido,
                nombre: paciente.nombre,
                alias: paciente.alias,
                fechaNacimiento: paciente.fechaNacimiento,
                sexo: paciente.sexo,
                telefono: paciente.contacto,
                carpetaEfectores: paciente.carpetaEfectores,
                obraSocial: this.obraSocialPaciente
            };
            // Datos del Turno
            let datosTurno = {
                idAgenda: this.agenda.id,
                idTurno: this.turno.id,
                idBloque: this.bloque.id,
                paciente: pacienteSave,
                tipoPrestacion: this.tipoPrestacion,
                tipoTurno: 'programado',
                nota: 'Turno pedido desde app móvil',
                motivoConsulta: ''
            };
            this.agendasProvider.save(datosTurno, { showError: false }).then(resultado => {
                console.log(resultado);
            }).catch(() => {
                this.toast.danger('Error asignando el turno, intente nuevamente');
            });

        }).catch(() => {
            // this.inProgress = false;
            console.log("ERROR");
        });

    }

    // ngOnDestroy() {
    //     this.onResumeSubscription.unsubscribe();
    // }

}
