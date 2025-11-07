package com.curso.services;

import com.curso.domains.MetaFinanceira;
import com.curso.domains.dtos.MetaFinanceiraDTO;
import com.curso.repositories.MetaFinanceiraRepository;
import com.curso.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MetaFinanceiraService {

    @Autowired
    private MetaFinanceiraRepository metaFinanceiraRepo;

    public List<MetaFinanceiraDTO> findAll(){
        return metaFinanceiraRepo.findAll().stream()
                .map(obj -> new MetaFinanceiraDTO(obj))
                .collect(Collectors.toList());
    }

    public MetaFinanceira findbyId(Long id){
        Optional<MetaFinanceira> obj = metaFinanceiraRepo.findById(id);
        return obj.orElseThrow(() -> new ObjectNotFoundException("MetaFinanceira não encontrado! ID: "+ id));
    }

    public MetaFinanceira create(MetaFinanceiraDTO dto){
        dto.setId(null);
        MetaFinanceira obj = new MetaFinanceira(dto);
        return metaFinanceiraRepo.save(obj);
    }

    public MetaFinanceira update(Long id, MetaFinanceiraDTO objDto){
        objDto.setId(id);
        MetaFinanceira oldObj = findbyId(id);
        oldObj = new MetaFinanceira(objDto);
        return metaFinanceiraRepo.save(oldObj);
    }

    public void delete (Long id){
        MetaFinanceira obj = findbyId(id);
        metaFinanceiraRepo.deleteById(id);
    }

}
