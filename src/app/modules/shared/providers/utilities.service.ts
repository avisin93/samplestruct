import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class UtilitiesService {

  public getFolderFiles = new Subject();
  public getFolder = new Subject();
  public getFavoriteFolder = new Subject();

  public static arrayCollectionByKey (arrayObj: Array<any>, key: string) {
    let values = [];
    arrayObj.forEach((item) => {
      values.push(item[key]);
    });
    return values.join(', ');
  }

  public static limitTo (value: string = '', limit: number) {
    if (value !== '') {
      return value.length > limit ? value.substring(0, limit) : value;
    } else {
      return value;
    }
  }

  setFolderFiles (files: any) {
    this.getFolderFiles.next(files);
  }

  setSelectedFolder (folder: any) {
    this.getFolder.next(folder);
  }

  setFavoriteFolder () {
    this.getFavoriteFolder.next(true);
  }

  generateSecreteKey () {
    let salt = CryptoJS.lib.WordArray.random(128 / 8);
    let key512Bits = CryptoJS.PBKDF2(salt, salt, { keySize: 128 / 8 });
    return key512Bits.toString();
  }

  encryptPassword (password) {
    let publicKey = this.generateSecreteKey();
    let encrypted = { secrete_key: publicKey };
    if (publicKey) {
      encrypted['encryptedPassword'] = CryptoJS.AES.encrypt(password, publicKey);
    }
    return encrypted;
  }

  dec (oldPassword, old) {
    var bytes = CryptoJS.AES.decrypt(oldPassword, old);
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }

}
