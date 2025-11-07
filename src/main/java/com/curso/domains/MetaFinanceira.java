package com.curso.domains;

import com.curso.domains.dtos.MetaFinanceiraDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import com.curso.domains.Usuario;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "metafinanceira")
public class MetaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_metafinanceira")
    private Long id;

    @NotNull @NotBlank
    private String descricaoMeta;

    @NotNull
    @Digits(integer = 6, fraction = 2)
    private BigDecimal valorMeta;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dataAlvo;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public MetaFinanceira() {
    }

    public MetaFinanceira(Long id, String descricaoMeta, BigDecimal valorMeta, LocalDate dataAlvo, Usuario usuario) {
        this.id = id;
        this.descricaoMeta = descricaoMeta;
        this.valorMeta = valorMeta;
        this.dataAlvo = dataAlvo;
        this.usuario = usuario;
    }

    public MetaFinanceira(MetaFinanceiraDTO dto) {
        this.id = dto.getId();
        this.descricaoMeta = dto.getDescricaoMeta();
        this.valorMeta = dto.getValorMeta();
        this.dataAlvo = dto.getDataAlvo();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull @NotBlank String getDescricaoMeta() {
        return descricaoMeta;
    }

    public void setDescricaoMeta(@NotNull @NotBlank String descricaoMeta) {
        this.descricaoMeta = descricaoMeta;
    }

    @NotNull
    @Digits(integer = 6, fraction = 2)
    public BigDecimal getValorMeta() {
        return valorMeta;
    }

    public void setValorMeta(@NotNull @Digits(integer = 6, fraction = 2) BigDecimal valorMeta) {
        this.valorMeta = valorMeta;
    }

    public LocalDate getDataAlvo() {
        return dataAlvo;
    }

    public void setDataAlvo(LocalDate dataAlvo) {
        this.dataAlvo = dataAlvo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetaFinanceira that = (MetaFinanceira) o;
        return Objects.equals(id, that.id) && Objects.equals(descricaoMeta, that.descricaoMeta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, descricaoMeta);
    }
}
