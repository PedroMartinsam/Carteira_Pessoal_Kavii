import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { LancamentosService, Lancamento, IdNome } from '../lancamentos/lancamentos.service';

type Filtros = {
  descricao: string;
  centroCustoId: number | null;
  lancDe: string;  lancAte: string;
  vencDe: string;  vencAte: string;
  baixaDe: string; baixaAte: string;
};

@Component({
  selector: 'app-extrato-lancamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './extrato-lancamentos.component.html',
})
export class ExtratoLancamentosComponent {
  private fb = inject(NonNullableFormBuilder);
  private api = inject(LancamentosService);

  carregando = signal(false);
  erro = signal<string | null>(null);

  // dados base
  centros = signal<IdNome[]>([]);
  todos = signal<Lancamento[]>([]);
  contas = signal<IdNome[]>([]);

form = this.fb.group({
  descricao: [''],
  centroCustoId: [null as number | null],
  contaId: [null as number | null],     // << NOVO
  lancDe: [''],  lancAte: [''],
  vencDe: [''],  vencAte: [''],
  baixaDe: [''], baixaAte: [''],
});

private parseDate(str?: string | null): Date | null {
  if (!str) return null;
  const s = String(str).trim();

  // yyyy-MM-dd (ou com hora)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    if (!isNaN(d.getTime())) { d.setHours(0,0,0,0); return d; }
  }
  // dd/MM/yyyy
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const d = new Date(+m[3], +m[2]-1, +m[1]);
    if (!isNaN(d.getTime())) { d.setHours(0,0,0,0); return d; }
  }
  return null;
}

private today0(): Date {
  const d = new Date(); d.setHours(0,0,0,0); return d;
}

// >>> use APENAS dataVencimentoISO (evita erro de tipo)
corLancamento(l: Lancamento): string | null {
  const sit = String(l.situacao ?? '').trim().toUpperCase();
  if (sit !== 'ABERTO' && sit !== 'EM_ABERTO' && sit !== 'ABERTA') return null;

  const venc = this.parseDate(l.dataVencimentoISO ?? null);
  if (!venc) return null;

  const hoje = this.today0();
  if (venc < hoje) return '#f8d7da';              // vermelho claro (vencido)

  const diffDias = Math.round((venc.getTime() - hoje.getTime()) / 86400000);
  if (diffDias <= 5) return '#fff3cd';            // amarelo claro (faltam ≤5 dias)

  return null;
}

filtros = signal({
  descricao: '', centroCustoId: null as number | null,
  contaId: null as number | null,       // << NOVO
  lancDe: '', lancAte: '', vencDe: '', vencAte: '', baixaDe: '', baixaAte: ''
});

ngOnInit() {
  this.carregando.set(true); this.erro.set(null);

  this.api.listar().subscribe({
    next: (ls) => { this.todos.set(ls ?? []); this.carregando.set(false); },
    error: () => { this.erro.set('Falha ao carregar lançamentos'); this.carregando.set(false); }
  });

  this.api.listarCentrosCusto().subscribe({ next: v => this.centros.set(v ?? []) });
  this.api.listarContas().subscribe({ next: v => this.contas.set(v ?? []) });   // << NOVO

  this.form.valueChanges.subscribe(v => {
    this.filtros.set({
      descricao: (v.descricao ?? '').trim(),
      centroCustoId: (v.centroCustoId as any) ?? null,
      contaId: (v.contaId as any) ?? null,                                      // << NOVO
      lancDe: v.lancDe ?? '', lancAte: v.lancAte ?? '',
      vencDe: v.vencDe ?? '', vencAte: v.vencAte ?? '',
      baixaDe: v.baixaDe ?? '', baixaAte: v.baixaAte ?? '',
    });
  });
}
private readonly excluirSituacoes = new Set(['ABERTA','ABERTO','EM_ABERTO']);
private isAberta = (l: Lancamento) =>
  this.excluirSituacoes.has(String(l.situacao ?? '').trim().toUpperCase());

  private inRange(dateISO?: string | null, de?: string, ate?: string) {
    if (!de && !ate) return true;
    const x = dateISO?.slice(0,10) ?? '';
    if (!x) return false;
    return (!de || x >= de!) && (!ate || x <= ate!); // ISO yyyy-MM-dd compara bem como string
  }

  lista = computed(() => {
  const fs = this.filtros();
  const desc = fs.descricao.toLowerCase();
  const ccId = fs.centroCustoId ?? null;
  const contaId = fs.contaId ?? null;                         // << NOVO

  return this.todos().filter(l => {
    if (desc && !(l.descricao ?? '').toLowerCase().includes(desc)) return false;
    if (ccId && (l.centroCusto?.id ?? null) !== ccId) return false;
    if (contaId && (l.conta?.id ?? null) !== contaId) return false;   // << NOVO

    if (!this.inRange(l.dataLancamentoISO, fs.lancDe, fs.lancAte)) return false;
    if (!this.inRange(l.dataVencimentoISO, fs.vencDe, fs.vencAte)) return false;
    if (!this.inRange(l.dataBaixaISO,      fs.baixaDe, fs.baixaAte)) return false;

    return true;
  });
});

listaExtrato = computed(() => this.lista().filter(l => !this.isAberta(l)));

  // totais / saldos (por documento e por baixa)
  totCreditoDoc = computed(() =>
    this.listaExtrato().reduce((s,l)=> s + (l.tipoLancamento==='Credito' ? (l.valorDocumento||0) : 0), 0)
  );
  totDebitoDoc = computed(() =>
    this.listaExtrato().reduce((s,l)=> s + (l.tipoLancamento==='Debito' ? (l.valorDocumento||0) : 0), 0)
  );
  saldoDoc = computed(() => this.totCreditoDoc() - this.totDebitoDoc());

  totCreditoBaix = computed(() =>
    this.listaExtrato().reduce((s,l)=> s + (l.tipoLancamento==='Credito' ? (l.valorBaixado||0) : 0), 0)
  );
  totDebitoBaix = computed(() =>
    this.listaExtrato().reduce((s,l)=> s + (l.tipoLancamento==='Debito' ? (l.valorBaixado||0) : 0), 0)
  );
  saldoBaix = computed(() => this.totCreditoBaix() - this.totDebitoBaix());

  limpar() {
    this.form.reset({
      descricao: '', centroCustoId: null,
      lancDe: '', lancAte: '', vencDe: '', vencAte: '', baixaDe: '', baixaAte: ''
    });
  }
}
