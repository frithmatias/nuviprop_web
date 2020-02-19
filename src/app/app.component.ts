import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
declare function init_plugins();

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	// time = new Observable<string>((observer: Observer<string>) => {
	//   setInterval(() => observer.next(new Date().toString()), 1000);
	// });
	constructor(private elementRef: ElementRef, @Inject(DOCUMENT) private doc, private router: Router, private activatedRoute: ActivatedRoute) {

		// this.time.subscribe(data => {
		//   console.log(data, `font-weight: bold; font-size: 12px;color: yellow; `, `font-weight: bold; font-size: 12px;color: red; `);
		// });
	}


	ngOnInit() {
		this.print_console();
		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).pipe(
			map(() => this.activatedRoute))
			.subscribe((event) => {

				// $.getScript('../assets/plugins/jquery/jquery.min.js');
				// init_plugins();
				// $.getScript('../assets/plugins/bootstrap/js/popper.min.js');
				// $.getScript('../assets/plugins/bootstrap/js/bootstrap.min.js');
				$.getScript('../assets/js/perfect-scrollbar.jquery.min.js');
				// $.getScript('../assets/js/sidebarmenu.js');
				$.getScript('../assets/js/custom.js');

			});






		// var jquery = document.createElement("script");
		// jquery.type = "text/javascript";
		// jquery.src = "../assets/plugins/jquery/jquery.min.js";
		// this.elementRef.nativeElement.appendChild(jquery);
		// init_plugins();
	}


	print_console() {
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
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: green; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: yellow; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: green; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: lightgrey; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: green; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: lightgrey; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: green; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: lightgrey; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: crimson; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: RoyalBlue; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: crimson; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: RoyalBlue; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: crimson; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: RoyalBlue; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: crimson; `,
			`font-weight: bold; padding: 0px; line-height: 12px; font-size: 12px;color: RoyalBlue; `,


		);
	}

}


