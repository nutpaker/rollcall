import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppSettings } from '../../envelopments/AppSettings';


@Injectable()
export class TimestampProvider {

  constructor(public http: HttpClient, private afd: AngularFireDatabase) {
  }



  public getSubject(QRCodeData) {
    return new Promise(resolve => {
      this.afd.database.ref('subjects').orderByKey().once("value")
        .then((res) => {
          res.forEach((chilsnapshot) => {
            if (QRCodeData == chilsnapshot.val().subject_code) {
              resolve(chilsnapshot.val());
            }
          });
          resolve(null);
        });
    });

  }

  public chkJoinClassroom(subjectdata: any, uid: any) {
    console.log
    let joinClassroom: boolean;
    return new Promise(resolve => {
      this.afd.database.ref('classrooms').orderByKey().once("value")
        .then((res) => {
          res.forEach((chilsnapshot) => {
            if (subjectdata["group_code"] == chilsnapshot.val().group_code && uid == chilsnapshot.val().uid) {
              resolve(true);
            }
          });
          resolve(false);
        });
    });
  }

  public chkTimestamp(subjectdata: any, uid: any, formattedDate: any) {
    return new Promise(resolve => {
      this.afd.database.ref('timestamp').orderByKey().once('value')
        .then((res) => {
          let unixDay = "" + Date.parse(formattedDate);
          let mes: any;
            res.forEach((childsnapshot) => {
              let childunixDay = "" + Date.parse(childsnapshot.val().day);
              if (subjectdata['subject_code'] == childsnapshot.val().subject_code && uid == childsnapshot.val().uid && unixDay == childunixDay) {
                resolve({ status: true});
              }
            });
          resolve({ status: false});
        });
    });
  }



  public chkSubject(QRCodeData: any, uid: any) {
    return new Promise((resolve) => {
      // ตรวจสอบ QR ว่าถูกต้องไหม
      this.getSubject(QRCodeData).then((subjectData) => {
        // QR ถูกต้อง
        if (subjectData) {
          // ตรวจสอบว่าอยู่ใน Classroom ?
          this.chkJoinClassroom(subjectData, uid).then((chkjoinclassroom) => {
            // ตรวจพบว่ามี Classroom
            if (chkjoinclassroom) {
              // รับค่าวันเวลา จาก API (Function From Fribase)
              this.timeNow().then((unix) => {

                // รับค่า มาจัด Formated
                let date = new Date((unix['timestamp'] - 25200) * 1000);
                var hours = date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                var month = '' + (date.getMonth() + 1);
                var daly = '' + date.getDate();
                var year = date.getFullYear();
                var formattedDate = daly + "-" + month + "-" + year;
                let unix_time_stamp_start = Date.parse("01/01/2019 " + subjectData['time_stamp_start'] + ":00");
                let unix_time_stamp_late_start = Date.parse("01/01/2019 " + subjectData['time_stamp_late_start'] + ":00");
                let unix_time_stamp_late_end = Date.parse("01/01/2019 " + subjectData['time_stamp_late_end'] + ":00");
                let unix_time_end = Date.parse("01/01/2019 " + subjectData['end'] + ":00");
                let unix_time = Date.parse("01/01/2019 " + formattedTime);
                var day;
                switch (date.getDay()) {
                  case 0:
                    day = "sun";
                    break;
                  case 1:
                    day = "mon";
                    break;
                  case 2:
                    day = "tue";
                    break;
                  case 3:
                    day = "wed";
                    break;
                  case 4:
                    day = "thu";
                    break;
                  case 5:
                    day = "fri";
                    break;
                  case 6:
                    day = "sat";
                    break;
                }

                // ตรวจสอบวันที่ตรงไหม || เวลาตรงไหม (ตรงตามที่สามารถเช็คชื่อได้)
                if (day === subjectData['day'] && unix_time >= unix_time_stamp_start && unix_time <= unix_time_end) {

                  // ตรวจสอบว่า วันนี้้ คาบนี้ เคยเช็คชื่อไปแล้วหรือยัง
                  this.chkTimestamp(subjectData, uid, formattedDate).then((chktime) => {
                    // ยังไม่เคยเช็คชื่อ
                    if (!chktime['status']) {
                      if (unix_time_stamp_late_start === unix_time_stamp_late_end) {
                        /// ไม่มีการเช็คสาย
                        if (unix_time >= unix_time_stamp_start && unix_time < unix_time_stamp_late_end) {
                          // มา
                          this.stampTime(uid, subjectData, formattedDate, formattedTime, 0).then(res => {
                            resolve({ status: false, message: res });
                          });

                        } else if (unix_time >= unix_time_stamp_late_end) {
                          // ขาด
                          this.stampTime(uid, subjectData, formattedDate, formattedTime, 2).then(res => {
                            resolve({ status: false, message: res });
                          });
                        }
                      } else {
                        /// เช็คปกติ
                        if (unix_time >= unix_time_stamp_start && unix_time < unix_time_stamp_late_start) {
                          // มา
                          this.stampTime(uid, subjectData, formattedDate, formattedTime, 0).then(res => {
                            resolve({ status: false, message: res });
                          });
                        } else if (unix_time >= unix_time_stamp_late_start && unix_time < unix_time_stamp_late_end) {
                          // สาย
                          this.stampTime(uid, subjectData, formattedDate, formattedTime, 1).then(res => {
                            resolve({ status: false, message: res });
                          });
                        } else if (unix_time >= unix_time_stamp_late_end) {
                          // ขาด
                          this.stampTime(uid, subjectData, formattedDate, formattedTime, 2).then(res => {
                            resolve({ status: false, message: res });
                          });
                        }
                      }
                      // alert("+++++");
                      // เคยเช็คชื่อไปแล้วววว
                    } else {
                      resolve({ status: false, message: "ได้ทำการเช็คชื่อไปแล้ว" });
                    }
                  });
                }
                // ไม่สามารถเช็คชื่อได้ (เช็ควันอื่น/เวลาไม่ตรงตามที่กำหนด)
                else {
                  resolve({ status: false, message: "ยังไม่ถึงเวลาเช็คชื่อ" });
                }
              });
              //ตรวจไม่พบว่ามี Classroom
            } else {
              resolve({ status: true, message: "คุณไม่ได้เข้าร่วม Classroom คุณต้องการเข้าร่วมหรือไม่", group_code: subjectData['group_code'] });
            }
          });
          // QR ไม่ต้องถูกต้อง
        } else {
          resolve({ status: false, message: "QRCode ไม่ถูกต้องง" });
        }
      });

    });
  }

  public timeNow() {
    return new Promise(resolve => {
      this.http.get(AppSettings.API_ENDPOINT + "time").subscribe(res => {
        resolve(res);
      });
    });
  }

  public stampTime(uid: any, subject: any, date: any, time: any, status: any) {
    return new Promise((resolve) => {
      // let dates = Date.parse(date + " " + time);
      // console.log(time);
      let data = {
        group_code: subject['group_code'],
        subject_code: subject['subject_code'],
        uid: uid,
        // 0 มา, 1 สาย, 2 ขาด , 3 ลา
        status: status,
        time: time,
        day: date,
        // stamp: dates
      }
      // let key = this.afd.database.ref().key;
      const timestamp = this.afd.database.ref(`/timestamp/`);
      timestamp.push(data).then((res) => {
        if (status == 0) {
          resolve("เช็คชื่อ สถานะ มาเรียน สำเร็จ");
        } else if (status == 1) {
          resolve("เช็คชื่อ สถานะ สาย สำเร็จ");
        } else {
          resolve("เช็คชื่อ สถานะ ขาด สำเร็จ");
        }
      }).catch(() => {
        resolve("ไม่สามารถบันทึกข้อมูลการเช็คชื่อได้");
      });
    })

  }
}


