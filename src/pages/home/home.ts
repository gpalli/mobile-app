import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { PacienteProvider } from '../../providers/paciente';

// pages
import { LoginPage } from '../login/login';
import { NumerosUtilesPage } from '../datos-utiles/numeros-emergencia/numeros-utiles';
import { FarmaciasTurnoPage } from '../datos-utiles/farmacias-turno/farmacias-turno';
import { FeedNoticiasPage } from '../datos-utiles/feed-noticias/feed-noticias';
import { CentrosSaludPage } from '../datos-utiles/centros-salud/centros-salud';
import { TurnosPage } from '../turnos/turnos';
import { AgendasPage } from '../profesional/agendas/agendas';
import { FormTerapeuticoPage } from '../profesional/form-terapeutico/form-terapeutico';
import { VacunasPage } from '../vacunas/vacunas';
import { LaboratoriosPage } from '../laboratorios/laboratorios';
import { FaqPage } from '../datos-utiles/faq/faq';
import { HistoriaDeSaludPage } from '../historia-salud/historia-salud';
import { DeviceProvider } from '../../providers/auth/device';
import { RupConsultorioPage } from '../profesional/consultorio/rup-consultorio';
import { ScanDocumentoPage } from '../profesional/mpi/scan-documento/scan-documento';
import { ErrorReporterProvider } from '../../providers/errorReporter';
import { CampaniasListPage } from '../datos-utiles/campanias/campanias-list';
import { ListaAutoControlPage } from '../autoControl/listaAutoControl';
import { ProfilePacientePage } from '../../pages/profile/paciente/profile-paciente';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    started = false;
    user: any;
    showMpi = false;

    constructor(
        public authService: AuthProvider,
        public deviceService: DeviceProvider,
        public navCtrl: NavController,
        public menuCtrl: MenuController,
        public reporter: ErrorReporterProvider) {

        this.user = this.authService.user;
    }
    ionViewWillEnter() {
        this.menuCtrl.enable(true);
    }

    ionViewDidLoad() {
        setTimeout(() => {
            this.started = true;
        }, 50);
    }

    isLogin() {
        return this.authService.user != null;
    }

    isPaciente() {
        return this.authService.user && this.authService.user.profesionalId == null;
    }

    isProfesional() {
        return this.authService.user && this.authService.user.profesionalId != null;
    }

    login() {
        if (!this.isLogin()) {
            this.navCtrl.push(LoginPage);
        } else {
            //   this.reporter.report();
        }
    }

    centrosDeSalud() {
        this.navCtrl.push(CentrosSaludPage);
    }

    faq() {
        this.navCtrl.push(FaqPage);
    }

    numerosUtiles() {
        this.navCtrl.push(NumerosUtilesPage);
    }

    campanias() {
        this.navCtrl.push(CampaniasListPage);
    }

    farmacias() {
        this.navCtrl.push(FarmaciasTurnoPage);
    }

    noticias() {
        this.navCtrl.push(FeedNoticiasPage);
    }



    // SOLO PACIENTE
    miPerfil() {
        if (this.isLogin()) {
            this.navCtrl.push(ProfilePacientePage);
        }
    }

    misTurnos() {
        if (this.isLogin()) {
            this.navCtrl.push(TurnosPage);
        }
    }

    misVacunas() {
        if (this.isLogin()) {
            this.navCtrl.push(VacunasPage);
        }
    }

    misLaboratorios() {
        if (this.isLogin()) {
            this.navCtrl.push(LaboratoriosPage);
        }
    }

    miHistoriaDeSalud() {
        if (this.isLogin()) {
            this.navCtrl.push(HistoriaDeSaludPage);
        }
    }

    misAutocontroles() {
        if (this.isLogin()) {
            this.navCtrl.push(ListaAutoControlPage);
        }
    }


    // SOLO PROFESIONAL
    rup() {
        this.navCtrl.push(RupConsultorioPage);
    }

    misAgendas() {
        // this.navCtrl.push(RupAdjuntarPage,  { id: '5a93fe29071906410e389279' }  );
        if (this.isLogin()) {
            this.navCtrl.push(AgendasPage);
        }
    }

    mpi() {
        if (this.isLogin()) {
            this.navCtrl.push(ScanDocumentoPage);
        }
    }

    formularioTerapeutico() {
        this.navCtrl.push(FormTerapeuticoPage);
    }

}
