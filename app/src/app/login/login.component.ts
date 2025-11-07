import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <section class="login">
    <h1>Entrar</h1>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>
        Usuário
        <input type="text" formControlName="username" placeholder="email ou usuário" />
      </label>
      <div class="err" *ngIf="form.controls.username.touched && form.controls.username.hasError('required')">
        Informe o usuário
      </div>

      <label>
        Senha
        <input type="password" formControlName="password" placeholder="senha" />
      </label>
      <div class="err" *ngIf="form.controls.password.touched && form.controls.password.hasError('required')">
        Informe a senha
      </div>

      <button type="submit" [disabled]="loading || form.invalid">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p class="error" *ngIf="error">{{ error }}</p>

    <div class="status" *ngIf="isLogged">
      <small>Você já está logado.</small>
      <button type="button" (click)="logout()">Sair</button>
    </div>
  </section>
`,
styles: [`
  .login { max-width: 360px; margin: 2rem auto; display: grid; gap: .75rem; }
  form { display: grid; gap: .75rem; }
  label { display: grid; gap: .25rem; font-weight: 600; }
  input { padding: .5rem .6rem; border: 1px solid var(--k-border); border-radius: .375rem; background: var(--k-bg-soft); color: var(--k-text); }
  button { padding: .6rem .9rem; border: 0; border-radius: .5rem; background: linear-gradient(135deg, var(--k-primary), var(--k-accent)); color: var(--k-white); font-weight: 600; }
  button[disabled] { opacity: .6; cursor: not-allowed; }
  .err { color: var(--k-danger); font-size: .85rem; }
  .error { color: var(--k-danger); margin-top: .5rem; }
  .status { display: flex; align-items: center; gap: .5rem; }
  nav { margin-top: .5rem; }
`]
})
export class LoginComponent {
  // pega o FormBuilder via inject (já fica disponível para inicializar o form)
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  get isLogged() { return this.auth.isLoggedIn(); }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    this.auth.login(this.form.value as any).subscribe({
      next: () => { this.loading = false; this.router.navigateByUrl('/home'); },
      error: (err) => {
        this.loading = false;
        this.error = (err?.status === 401 || err?.status === 403) ? 'Credenciais inválidas' : 'Falha no login';
      }
    });
  }

  logout() { this.auth.logout(); }
}
