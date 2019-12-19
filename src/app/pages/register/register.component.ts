import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/services.index';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  sonIguales(campo1: string, campo2: string) {

    return (group: FormGroup) => {

      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        sonIguales: true
      };

    };

  }


  ngOnInit() {
    init_plugins();

    this.forma = new FormGroup({
      correo: new FormControl(null, [Validators.required, Validators.email]),
      nombre: new FormControl(null, Validators.required),
      apellido: new FormControl(null, Validators.required),
      nacimiento: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.sonIguales('password', 'password2') });


    // this.forma.setValue({
    //   correo: 'test@test.com',
    //   nombre: 'NombrePba',
    //   apellido: 'ApellidoPba',
    //   nacimiento: '27-04-1979',
    //   password: '123456',
    //   password2: '123456',
    //   condiciones: true
    // });

  }


  registrarUsuario() {

    if (this.forma.invalid) {
      return;
    }

    if (!this.forma.value.condiciones) {
      Swal.fire('Importante', 'Debe de aceptar las condiciones', 'warning');
      return;
    }

    // constructor(
    //   public email: string,
    //   public nombre: string,
    //   public apellido: string,
    //   public nacimiento: string,
    //   public password: string,
    //   public img?: string, // luego de un parámetro opcional, todos los demás parámetros también son opcionales.
    //   public role?: string,
    //   public google?: boolean,
    //   public _id?: string
    // ) {}

    const usuario = new Usuario(
      this.forma.value.correo,
      this.forma.value.nombre,
      this.forma.value.apellido,
      this.forma.value.nacimiento,
      this.forma.value.password
    );
    console.log(usuario);
    this.usuarioService.crearUsuario(usuario)
      .subscribe(
        (resp) => {
          this.router.navigate(['/login']);
        },
        (err) => {
          console.log(err);
          Swal.fire('Error en el registro', err.message, 'error');
        }
      );


  }

}
