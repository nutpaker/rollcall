import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, ActionSheetController, Platform, AlertController, ToastController, normalizeURL } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

export class DateValidation {
  static MatchDate(abstractCtrl: AbstractControl) {
    let startdate = Date.parse(abstractCtrl.get('startdate').value);
    let enddate = Date.parse(abstractCtrl.get('enddate').value);
    let caldate = enddate - startdate;
    // 172800000
    // console.log(caldate);
    if (caldate > 172800000 || caldate < 0) {
      abstractCtrl.get('enddate').setErrors({ MatchDate: true });
    }
    return null;
  }
}

@IonicPage()
@Component({
  selector: 'page-leave-modal',
  templateUrl: 'leave-modal.html',
})

export class LeaveModalPage {

  leaveForm: FormGroup;
  img_source: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public camera: Camera,
    public domSanitizer: DomSanitizer,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public toastCtrl: ToastController,
  ) {

    this.leaveForm = formBuilder.group({
      'startdate': ['', Validators.compose([Validators.required])],
      'enddate': ['', Validators.compose([Validators.required])],
      'detail': ['', Validators.compose([Validators.required])],
      'picture': ['', Validators.compose([Validators.required])]
    }, {
        validator: DateValidation.MatchDate
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaveModalPage');
    this.events.publish('dismissLoading');
  }


  selectPhoto() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Transfer Slip',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Take a Photo',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  presentToast(_msg: any) {
    let toast = this.toastCtrl.create({
      message: _msg,
      duration: 1500,
      position: 'top'
    });

    toast.present();
  }

  takePicture(sourceType: any) {
    const options: CameraOptions = {
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: false,
      allowEdit: true
    }

    this.camera.getPicture(options).then((imagePath) => {
        this.leaveForm.controls.picture.setValue('data:image/jpeg;base64,' + imagePath);
        this.img_source = 'data:image/jpeg;base64,' + imagePath;
        // const pictures = storage().ref('leaves/');
        // pictures.putString('data:image/jpeg;base64,' + imagePath,'data_url');
    });
  }

  onSubmit(){
    this.viewCtrl.dismiss(this.leaveForm.value);
  }



}
