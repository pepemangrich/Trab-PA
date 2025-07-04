// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CRID {
    struct Disciplina {
        string codigo;
        string nome;
        uint8 creditos;
        uint cargaHoraria;
        string tipoInscricao;
    }

    struct Registro {
        string nomeAluno;
        string matricula;
        string curso;
        string periodo;
        Disciplina[] disciplinas;
        uint8 totalCreditos;
    }

    mapping(address => Registro) public registros;

    function registrarCRID(
        string memory nomeAluno,
        string memory matricula,
        string memory curso,
        string memory periodo
    ) public {
        registros[msg.sender].nomeAluno = nomeAluno;
        registros[msg.sender].matricula = matricula;
        registros[msg.sender].curso = curso;
        registros[msg.sender].periodo = periodo;
    }

    function adicionarDisciplina(
        string memory codigo,
        string memory nome,
        uint8 creditos,
        uint cargaHoraria,
        string memory tipoInscricao
    ) public {
        Registro storage r = registros[msg.sender];

        require(bytes(r.nomeAluno).length > 0, "CRID nao registrado.");
        require(r.totalCreditos + creditos <= 32, "Limite de 32 creditos excedido.");

        r.disciplinas.push(
            Disciplina(codigo, nome, creditos, cargaHoraria, tipoInscricao)
        );
        r.totalCreditos += creditos;
    }

    function getDisciplinas(address aluno) public view returns (Disciplina[] memory) {
        return registros[aluno].disciplinas;
    }
}