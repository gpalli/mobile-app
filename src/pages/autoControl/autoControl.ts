import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, NavParams, LoadingController, MenuController, Platform, SelectPopover } from 'ionic-angular';
import * as moment from 'moment';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { Base64 } from '@ionic-native/base64';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { ChartsModule } from 'ng2-charts';

// providers
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { EditorPacientePage } from '../editor-paciente/editor-paciente';
import { Storage } from '@ionic/storage';
import { PacienteProvider } from '../../providers/paciente';
import { ConstanteProvider } from '../../providers/constantes';
import { ToastProvider } from '../../providers/toast';

@Component({
    selector: 'page-auto-control',
    templateUrl: 'autoControl.html',
})
export class AutoControlPage {

}
