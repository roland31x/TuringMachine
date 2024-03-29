import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getValues() : string[] {
    let values : string[] = [];
    for (let i = 0; i < localStorage.length; i++){
      values.push(localStorage.key(i)!);
    }
    return values.sort();
  }

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  checkItem(key: string) : boolean {
    return localStorage.getItem(key) !== null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
