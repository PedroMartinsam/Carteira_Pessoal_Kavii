
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LancamentosService, Lancamento, IdNome } from '../lancamentos/lancamentos.service';
import Chart, { ChartItem, Plugin } from 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  styles: [`
/* ====== THEME VARS ====== */
.kavii-root{
  --k-bg:#0b1220;
  --k-bg-soft:#121a2c;
  --k-card:#0A1B2E; /* navy */
  --k-border:rgba(255,255,255,.16);
  --k-text:#eef3ff;
  --k-muted:#bdc9e6;
  --k-primary:#0d47a1;
  --k-accent:#00b3ff;
  --neon-center: rgba(0,179,255,0.20);
  --neon-edge: rgba(0,179,255,0.08);
  --k-white:#ffffff;
  color:var(--k-text);
}
.kavii-root.light{
  --k-bg:#f5f7fb;
  --k-bg-soft:#ffffff;
  --k-card:#ffffff;
  --k-border:rgba(16,24,40,.12);
  --k-text:#000000;
  --k-muted:#3a4a68;
  --k-primary:#0d47a1;
  --k-accent:#007be0;
  --neon-center: rgba(0,123,224,0.12);
  --neon-edge: rgba(0,123,224,0.04);
}

/* layout base */
.kavii-root section{background:var(--k-bg);}
a{color:var(--k-accent);text-decoration:none}

/* HERO */
.hero{
  border-radius:18px;padding:20px;margin-bottom:16px;
  background:
    radial-gradient(800px 300px at 0% 0%, rgba(0,179,255,.20), transparent 60%),
    linear-gradient(135deg, var(--k-bg-soft), var(--k-bg));
  border:1px solid var(--k-border);color:var(--k-text);
}
.hero-title{display:flex;align-items:center;gap:12px;margin:0 0 6px;font-weight:900;letter-spacing:.2px;font-size:clamp(20px,2vw,26px)}
.hero .badge{
  background:linear-gradient(135deg,var(--k-primary),var(--k-accent));
  color:#fff;border:none;font-weight:800;padding:6px 10px;border-radius:999px;font-size:.9rem
}

/* CONTAINER VIDRO */
.container-kavii{
  background: linear-gradient(135deg, rgba(10,27,46,.98), rgba(10,27,46,.95)) padding-box,
              radial-gradient(1200px 500px at 80% -10%, rgba(10,27,46,.12), transparent 60%) border-box;
  border:1px solid rgba(255,255,255,.06);
  border-radius:24px;padding:24px;backdrop-filter:blur(8px);
  color: var(--k-text);
  transition: background .25s ease, color .25s ease;
}
.kavii-root.light .container-kavii{
  background: linear-gradient(135deg, #ffffff 0%, #e9f8ff 60%) padding-box,
              radial-gradient(1200px 500px at 80% -10%, rgba(0,123,224,0.06), transparent 60%) border-box;
  border:1px solid rgba(16,24,40,.06);
}

/* ====== ICON TILES (estilo Steam) ====== */
.apps-grid{
  display:grid; gap:14px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}
.app-tile{
  display:flex; flex-direction:column; align-items:center; gap:10px;
  padding:14px; border-radius:16px; background:transparent; border:1px dashed transparent;
  transition: transform .15s ease, border-color .15s ease;
}
.app-tile:hover,
.app-tile:focus-within{ transform: translateY(-2px); border-color: var(--k-border); }

.app-icon{
  width:100px; height:100px; border-radius:999px; overflow:hidden;
  display:grid; place-items:center;
  border:1px solid var(--k-border);
  box-shadow: 0 10px 22px rgba(0,0,0,.24) inset, 0 6px 18px rgba(0,0,0,.18);
  background:
    radial-gradient(120px 120px at 70% 30%, rgba(255,255,255,.16), transparent 55%),
    linear-gradient(160deg, #0F2A4A 0%, #0A1B2E 55%, #0B243F 100%);
}
.kavii-root.light .app-icon{
  box-shadow: 0 10px 22px rgba(0,0,0,.08) inset, 0 6px 18px rgba(0,0,0,.06);
  background:
    radial-gradient(120px 120px at 70% 30%, rgba(255,255,255,.75), transparent 55%),
    linear-gradient(160deg, #e7f3ff 0%, #cfe6ff 60%, #bcdcff 100%);
}
.app-img{
  width:70%; height:70%; object-fit:contain; filter:drop-shadow(0 2px 2px rgba(0,0,0,.35));
}
.kavii-root.light .app-img{ filter:none; }

.app-label{
  font-weight:900; letter-spacing:.2px; margin-top:4px;
  color:var(--k-text); text-align:center; line-height:1.1;
}
.app-open{
  display:inline-block; margin-top:2px; font-weight:800; font-size:.9rem;
  padding:6px 10px; border-radius:10px; border:1px solid var(--k-accent); color:var(--k-accent);
  background:transparent; text-decoration:none;
}
.app-open:hover{ color:#fff; background:linear-gradient(135deg,var(--k-primary),var(--k-accent)); border-color:transparent; }

/* ====== GRID DE ÁREAS (3 colunas com títulos) ====== */
.areas-grid{
  display:grid;
  grid-template-columns:1fr;
  gap:16px;
  max-width:1200px;margin-inline:auto;margin-bottom:16px;
}
@media(min-width:992px){ .areas-grid{ grid-template-columns:repeat(3, 1fr);} }

.area{ display:flex; flex-direction:column; gap:12px; }
.area-title{
  font-weight:800; color:var(--k-text);
  font-size:clamp(16px,1.4vw,18px);
  padding-bottom:8px; border-bottom:1px solid var(--k-border); opacity:.92;
}

/* ====== TOOLBAR / CHART ====== */
.section-title{margin:0 0 16px;font-weight:800;color:var(--k-text);font-size:clamp(18px,1.6vw,20px)}
.toolbar{display:grid;gap:12px;align-items:end;grid-template-columns:1fr}
@media(min-width:992px){.toolbar{grid-template-columns:1.5fr 1fr 1fr 1.6fr auto}}
.form-label{color:var(--k-muted);font-weight:800;margin-bottom:6px}
.form-select,.form-control{background:var(--k-bg-soft);color:var(--k-text);border:1px solid var(--k-border);border-radius:12px;height:44px}
.segment{display:inline-flex;border:1px solid var(--k-border);border-radius:12px;overflow:hidden;background:var(--k-bg-soft)}
.segment button{padding:10px 14px;border:0;color:var(--k-text);background:transparent;font-weight:800;cursor:pointer}
.segment button.active{background:linear-gradient(135deg,var(--k-primary),var(--k-accent));color:#fff}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{border:1px solid var(--k-border);background:var(--k-bg-soft);color:var(--k-text);border-radius:999px;padding:6px 12px;font-weight:800;cursor:pointer}
.chip:hover{border-color:var(--k-accent)}
.theme-btn,.btn-secondary-k{border:1px solid var(--k-border);background:var(--k-bg-soft);color:var(--k-text);border-radius:12px;height:44px;padding:0 12px;font-weight:900}
.apply{height:44px;border-radius:12px;font-weight:900;letter-spacing:.2px;background:linear-gradient(135deg,var(--k-primary),var(--k-accent));border:0;color:#fff;padding:0 18px;cursor:pointer}
.apply:disabled{filter:grayscale(.4) opacity(.7);cursor:not-allowed}
.chart-wrap{position:relative;height:300px;border:1px dashed var(--k-border);border-radius:16px;display:flex;align-items:center;justify-content:center;padding:8px}
.empty{text-align:center;color:var(--k-muted);padding:24px 8px}
`],
  template: `
<section class="kavii-root" [class.light]="isLight">
  <div class="container py-4">

    <!-- HERO -->
    <div class="hero">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
        <div>
          <h1 class="hero-title">
            <span class="badge">KAVII</span>
            CARTEIRA PESSOAL
          </h1>
          <small style="color:var(--k-muted)">Dashboard inicial · visão rápida</small>
        </div>
        <button class="theme-btn" (click)="toggleTheme()" aria-label="Alternar tema">
          <span *ngIf="!isLight">🌙</span>
          <span *ngIf="isLight">☀️</span>
          {{ isLight ? 'TEMA CLARO' : 'TEMA ESCURO' }}
        </button>
      </div>
    </div>

    <!-- ====== 3 TEMAS / COLUNAS ====== -->
    <div class="areas-grid">
      <div class="area" *ngFor="let g of navGroups">
        <div class="area-title">{{ g.title }}</div>

        <div class="apps-grid">
          <div class="app-tile" *ngFor="let card of g.items">
            <div class="app-icon" aria-hidden="true">
              <!-- Se tiver imagem externa, usa <img>; senão, cai no SVG do tipo -->
              <img *ngIf="card.img" [src]="card.img" [alt]="card.t" class="app-img" />
              <ng-container *ngIf="!card.img" [ngSwitch]="card.icon">
                <!-- Lançamentos -->
                <svg *ngSwitchCase="'lancamentos'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M7 3h7l4 4v14H7V3z" stroke="white" stroke-width="1.8" opacity=".9"/>
                  <path d="M14 3v5h5" stroke="white" stroke-width="1.8" opacity=".9"/>
                  <path d="M9 12h6M9 16h6" stroke="white" stroke-width="1.8" opacity=".9"/>
                </svg>
                <!-- Contas -->
                <svg *ngSwitchCase="'contas'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="white" stroke-width="1.8" opacity=".95"/>
                  <path d="M16 12.5h4v3h-4a1.5 1.5 0 0 1 0-3z" fill="white" opacity=".9"/>
                </svg>
                <!-- Bancos -->
                <svg *ngSwitchCase="'bancos'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M4 9h16M5 9V18M9 9V18M15 9V18M19 9V18M3 18h18M3 9l9-5 9 5" stroke="white" stroke-width="1.8" opacity=".92"/>
                </svg>
                <!-- Centros -->
                <svg *ngSwitchCase="'centros'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v9l6.5 6.5A9 9 0 1 1 12 3z" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <path d="M12 12h9" stroke="white" stroke-width="1.8" opacity=".92"/>
                </svg>
                <!-- Metas -->
                <svg *ngSwitchCase="'metas'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <circle cx="12" cy="12" r="2" fill="white" opacity=".95"/>
                </svg>
                <!-- Terceiros -->
                <svg *ngSwitchCase="'terceiros'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="8" r="3" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <path d="M3.5 18a5.5 5.5 0 0 1 11 0" stroke="white" stroke-width="1.8" opacity=".92"/>
                  <circle cx="17" cy="9" r="2.4" stroke="white" stroke-width="1.6" opacity=".8"/>
                </svg>
                <!-- Usuários -->
                <svg *ngSwitchCase="'usuarios'" width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l6 2v5c0 4.2-2.9 8-6 9-3.1-1-6-4.8-6-9V5l6-2z" stroke="white" stroke-width="1.8" opacity=".9"/>
                  <circle cx="12" cy="10" r="2.8" stroke="white" stroke-width="1.8" opacity=".92"/>
                </svg>
                <!-- Fallback -->
                <svg *ngSwitchDefault width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.8" opacity=".9"/>
                </svg>
              </ng-container>
            </div>

            <div class="app-label">{{ card.t }}</div>
            <a class="app-open" [routerLink]="card.link" aria-label="Abrir {{card.t}}">Abrir</a>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTROS + GRÁFICO -->
    <div class="container-kavii">
      <h3 class="section-title">Filtros & Gráfico</h3>

      <div class="toolbar mb-3">
        <div>
          <label class="form-label">Conta</label>
          <select class="form-select"
                  [ngModel]="contaId"
                  (ngModelChange)="contaId = $event; aplicar()"
                  aria-label="Selecionar conta">
            <option *ngFor="let c of contas" [ngValue]="c.id">
              {{ c.descricao || c.nome || ('#'+c.id) }}
            </option>
          </select>
        </div>

        <div>
          <label class="form-label">Período — de</label>
          <input type="date" class="form-control" [(ngModel)]="de" aria-label="Data inicial">
        </div>

        <div>
          <label class="form-label">Período — até</label>
          <input type="date" class="form-control" [(ngModel)]="ate" aria-label="Data final">
        </div>

        <div>
          <label class="form-label d-block">Base de valor</label>
          <div class="segment" role="tablist" aria-label="Base de valor">
            <button role="tab" class="{{!usarBaixa?'active':''}}" (click)="setBase(false)">Documento</button>
            <button role="tab" class="{{usarBaixa?'active':''}}" (click)="setBase(true)">Baixa</button>
          </div>
          <div class="chips mt-2" aria-label="Atalhos de período">
            <span class="chip" (click)="setPreset(30)">Últimos 30d</span>
            <span class="chip" (click)="setPreset(90)">Últimos 90d</span>
            <span class="chip" (click)="setYTD()">YTD</span>
            <span class="chip" (click)="setAnoAtual()">Ano atual</span>
          </div>
        </div>

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button class="btn-secondary-k" (click)="limpar()">Limpar</button>
          <button class="apply" (click)="aplicar()" [disabled]="!hasRequiredFilters()">Aplicar</button>
        </div>

        <div class="col-12" *ngIf="erro">
          <div class="alert alert-danger mt-2 mb-0">{{ erro }}</div>
        </div>
      </div>

      <div class="chart-wrap">
        <canvas #gastosCentroChart></canvas>
        <div *ngIf="msgSemDados" class="empty">
          <div style="font-weight:800; margin-bottom:6px;">Sem dados</div>
          <small>{{ msgSemDados }}</small>
        </div>
      </div>
    </div>
  </div>
</section>
  `,
})
export class HomeComponent {
  constructor(private api: LancamentosService) {}

  /* ====== VIEW ====== */
  @ViewChild('gastosCentroChart') gastosCentroChart!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  isLight = false;

  /* ====== 3 TEMAS + ÍCONES ====== */
  navGroups = [
    {
      title: 'Gestão Financeira',
      items: [
        { icon:'lancamentos', t:'Lançamentos', d:'Gerencie todas as movimentações financeiras.', link:'/lancamentos', img:'' },
        { icon:'contas',      t:'Contas',       d:'Controle de saldos e bancos conectados.',     link:'/contas',       img:'' },
        { icon:'bancos',      t:'Bancos',       d:'Vincule e gerencie instituições financeiras.', link:'/bancos',       img:'' },
      ]
    },
    {
      title: 'Estrutura e Organização',
      items: [
        { icon:'centros', t:'Centros de Custo',  d:'Classifique e analise seus gastos.',            link:'/centroCustos',    img:'' },
        { icon:'metas',   t:'Metas Financeiras', d:'Acompanhe seus objetivos de forma inteligente.', link:'/metaFinanceiras', img:'' },
      ]
    },
    {
      title: 'Relacionamentos e Acesso',
      items: [
        { icon:'terceiros', t:'Terceiros', d:'Organize clientes e fornecedores.', link:'/terceiros', img:'' },
        { icon:'usuarios',  t:'Usuários',  d:'Gestão de usuários e permissões.',  link:'/usuarios',  img:'' },
      ]
    }
  ];

  /* ====== DATA ====== */
  lancs: Lancamento[] = [];
  contas: IdNome[] = [];
  contaId: number | null = null;
  de = '';  // yyyy-MM-dd
  ate = '';
  usarBaixa = false;

  erro: string | null = null;
  msgSemDados = '';
  private applied = false;
  private lastTotal = 0;

  /* ====== LIFECYCLE ====== */
  ngOnInit() {
    const saved = localStorage.getItem('kavii_theme');
    this.isLight = saved === 'light';

    this.api.listar().subscribe({
      next: (ls) => { this.lancs = ls ?? []; this.drawIfReady(); },
      error: () => { this.erro = 'Falha ao carregar lançamentos'; }
    });
    this.api.listarContas().subscribe({
      next: (v) => {
        this.contas = v ?? [];
        if (!this.contaId && this.contas.length) this.contaId = this.contas[0].id;
        this.drawIfReady();
      }
    });
  }
  ngAfterViewInit() { this.drawIfReady(); }
  ngOnDestroy() { this.chart?.destroy(); }

  /* ====== THEME ====== */
  toggleTheme() {
    this.isLight = !this.isLight;
    localStorage.setItem('kavii_theme', this.isLight ? 'light' : 'dark');
    this.redesenhar();
  }

  /* ====== FILTERS ====== */
  public hasRequiredFilters(): boolean { return !!(this.contaId && this.de && this.ate); }
  aplicar() { this.applied = true; this.redesenhar(); }
  limpar() {
    this.de = ''; this.ate = ''; this.usarBaixa = false; this.applied = false;
    this.chart?.destroy(); this.chart = undefined as any;
    this.msgSemDados = 'Selecione conta, período e clique em Aplicar.';
  }
  setBase(v: boolean) { this.usarBaixa = v; this.aplicar(); }

  setPreset(days: number) {
    const end = new Date(); end.setHours(0,0,0,0);
    const start = new Date(end); start.setDate(start.getDate() - days + 1);
    this.de = this.iso(start); this.ate = this.iso(end);
    this.aplicar();
  }
  setYTD() {
    const end = new Date(); end.setHours(0,0,0,0);
    const start = new Date(end.getFullYear(), 0, 1);
    this.de = this.iso(start); this.ate = this.iso(end);
    this.aplicar();
  }
  setAnoAtual() {
    const year = new Date().getFullYear();
    this.de = `${year}-01-01`; this.ate = `${year}-12-31`;
    this.aplicar();
  }
  private iso(d: Date) { return d.toISOString().slice(0,10); }

  /* ====== CHART ====== */
  private drawIfReady() {
    if (!this.gastosCentroChart) return;
    if (!this.lancs.length || !this.contas.length) return;
    if (!this.applied || !this.hasRequiredFilters()) {
      this.chart?.destroy(); this.chart = undefined as any;
      this.msgSemDados = 'Selecione conta, período e clique em Aplicar.';
      return;
    }
    requestAnimationFrame(() => this.redesenhar());
  }

  private refDateISO(l: Lancamento): string | null {
    const iso = this.usarBaixa ? l.dataBaixaISO : l.dataLancamentoISO;
    return iso ? iso.slice(0, 10) : null;
  }
  private inRangeISO(dateISO: string | null): boolean {
    if (!dateISO) return false;
    if (this.de && dateISO < this.de) return false;
    if (this.ate && dateISO > this.ate) return false;
    return true;
  }
  private valorDebito(l: Lancamento): number {
    const tipo = String(l.tipoLancamento ?? '').toLowerCase();
    if (tipo !== 'debito' && !tipo.startsWith('debit')) return 0;
    const v = this.usarBaixa ? (l.valorBaixado ?? 0) : (l.valorDocumento ?? 0);
    return Number(v) || 0;
  }
  private groupByCentroForConta(): Map<string, number> {
    const map = new Map<string, number>();
    const cid = this.contaId;
    for (const l of this.lancs) {
      if (cid && (l.conta?.id ?? null) !== cid) continue;
      const refDate = this.refDateISO(l);
      if (!this.inRangeISO(refDate)) continue;
      const v = this.valorDebito(l);
      if (!v) continue;
      const label = l.centroCusto?.descricao
        || (l.centroCusto?.id != null ? `#${l.centroCusto.id}` : '— Sem centro —');
      map.set(label, (map.get(label) ?? 0) + v);
    }
    return map;
  }

  private centerLabel: Plugin = {
    id: 'centerLabel',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart as any;
      if (!this.lastTotal) return;

      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 16px system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillStyle = this.isLight ? '#0b1220' : '#e6ebf5';

      const total = this.lastTotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      ctx.fillText('Total', cx, cy - 12);
      ctx.font = '800 18px system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillText(total, cx, cy + 10);
      ctx.restore();
    }
  };

  private redesenhar(): void {
    if (!this.gastosCentroChart) return;
    if (!this.applied || !this.hasRequiredFilters()) {
      this.chart?.destroy();
      this.chart = undefined as any;
      this.msgSemDados = 'Selecione conta, período e clique em Aplicar.';
      return;
    }

    this.chart?.destroy();
    this.msgSemDados = '';

    const dataMap = this.groupByCentroForConta();
    const labels = [...dataMap.keys()];
    const data = [...dataMap.values()];

    if (!labels.length) {
      this.msgSemDados = 'Sem dados no período/conta selecionados.';
      return;
    }

    const total = data.reduce((s, n) => s + Math.abs(n || 0), 0);
    this.lastTotal = total;
    if (total <= 0) {
      this.msgSemDados = 'Sem valores > 0 no período/conta selecionados.';
      return;
    }

    const bg = this.makePalette(labels.length);

    this.chart = new Chart(
      this.gastosCentroChart.nativeElement.getContext('2d') as ChartItem,
      {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: bg,
            borderWidth: 2,
            borderColor: this.isLight ? '#ffffff' : '#0b1220',
            hoverOffset: 6,
            borderRadius: 8,
            spacing: 2
          }]
        },
        options: ({
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: this.isLight ? '#0b1220' : '#e6ebf5' }
            },
            tooltip: {
              callbacks: {
                label: (ctx: any) =>
                  `${ctx.label}: ${Number(ctx.parsed).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`
              }
            }
          }
        } as any),
        plugins: [this.centerLabel]
      }
    );
  }

  private makePalette(n: number): string[] {
    const arr: string[] = [];
    for (let i=0;i<n;i++){
      const t = i/(Math.max(1,n-1));
      const h = 210 + (200-210)*t;  // gama de azuis
      const s = 80 - 35*t;
      const l = this.isLight ? 52 - 14*t : 52 - 8*t;
      arr.push(`hsl(${h} ${s}% ${l}%)`);
    }
    return arr;
  }
}
