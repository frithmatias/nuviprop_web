import { Component } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });
  constructor() {

    const emoji = ['💩', '👯‍', '😸', '🏄', '🚀', '🔥', '🎉', '😄', '🦁'];

    console.log(`%cNuviProp `,
      `
        font-weight: bold;
        font-size: 70px;
        color: red;
        line-height: 110px;
        text-shadow:
        2px 2px 0 rgb(217,31,38),
        4px 4px 0 rgb(226,91,14),
        6px 6px 0 rgb(245,221,8),
        8px 8px 0 rgb(5,148,68),
        10px 10px 0 rgb(2,135,206),
        12px 12px 0 rgb(4,77,145),
        14px 14px 0 rgb(42,21,113)
      `);
    console.log(`%c Autor: %c Matias Frith\n%c Versión: %c 1.0.1 ${emoji[4]}\n%c Email: %c matiasfrith@gmail.com\n%c Tel.Wzapp: %c +54 11 64906542\n%c Mongo: %c v4.2.1\n%c Express: %c v4.17.1\n%c Angular: %c v8.3.18\n%c NodeJS: %c v12.13.0\n`,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: yellow; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: tomato; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: yellow; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: tomato; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: yellow; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: tomato; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: yellow; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: green; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: LightGreen; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: RoyalBlue; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: DodgerBlue; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: RoyalBlue; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: red; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: RoyalBlue; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: green; `,
      `font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: RoyalBlue; `,


    );

    // this.time.subscribe(data => {
    //   console.log(data, `font-weight: bold; font-size: 12px;color: yellow; `, `font-weight: bold; font-size: 12px;color: red; `);
    // });
  }
}


