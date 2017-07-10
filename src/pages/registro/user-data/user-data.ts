import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { Usuario } from '../../../interfaces/usuario.interface';
import { PasswordValidation } from '../../../validadores/validar-password';
import { VerificaCodigoPage } from '../../verifica-codigo/verifica-codigo';
import { Storage } from '@ionic/storage'
import { WaitingValidationPage } from '../waiting-validation/waiting-validation';
import { ToastProvider } from '../../../providers/toast';

/**
 * Generated class for the RegistroPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-registro-user-data',
  templateUrl: 'user-data.html',
})
export class RegistroUserDataPage {
  public usuario: Usuario;
  loading: any;
  esconderLogoutBtn: boolean = true;
  mostrarMenu: boolean = false;
  formRegistro: FormGroup;
  submit: boolean = false;
  errors: any = {};
  telefono: string;

  constructor(private toastCtrl: ToastProvider, public storage: Storage, public authService: AuthProvider, public loadingCtrl: LoadingController, public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.usuario = this.navParams.get('user');

    let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';

    this.formRegistro = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', Validators.required],
      confirmarPassword: ['', Validators.required],
      terminos: [false, Validators.compose([Validators.required, Validators.pattern('true')])]
    }, {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  ionViewDidLoad() {
    //
  }

  onSubmit({ value, valid }: { value: Usuario, valid: boolean }) {
    this.showLoader();
    this.errors = {};
    if (!this.usuario.telefono) {
      this.usuario.telefono = this.telefono;
    }
    var data = {
      ...this.usuario,
      ...value
    };

    this.authService.createAccount(data).then((result: any) => {
      this.loading.dismiss();
      this.storage.set('emailCodigo', data.email);
      let toView: any = null;
      if (result.valid) {
        toView = VerificaCodigoPage;
      } else {
        toView = WaitingValidationPage;
      }

      this.navCtrl.push(toView, { user: data }).then(() => {
        const index = this.navCtrl.getActive().index;
        this.navCtrl.remove(index - 1);
        this.navCtrl.remove(index - 2);
        this.navCtrl.remove(index - 3);
      });

    }, (err) => {
      this.loading.dismiss();
      if (err.error.email) {
        let text = 'El e-mail ya se encuentra registrado.';
        this.errors.email = err.error.email;
        let control = this.formRegistro.controls['email'].setErrors({ message: text });
        this.toastCtrl.danger(text);
      }
    });
  }

  showConditions() {
    console.error('not implemented yet!!');
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Registrando...'
    });
    this.loading.present();
  }

  showAlert(result: any) {
    let nombreUsuario = result.nombre.charAt(0).toUpperCase() + result.nombre.slice(1) + ' ' + result.apellido;
    let alert = this.alertCtrl.create({
      title: nombreUsuario,
      subTitle: 'El registro se hizo correctamente. Un código de verificación fue enviado por mail',
      buttons: ['OK']
    });
    alert.present();
  }
}
