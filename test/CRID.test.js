const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CRID", function () {
  let crid;
  let owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();
    const CRID = await ethers.getContractFactory("CRID");
    crid = await CRID.deploy();
  });

  it("Deve registrar um novo CRID", async function () {
    await crid.registrarCRID("Pedro", "120038870", "Engenharia", "2025/1");
    const registro = await crid.registros(owner.address);
    expect(registro.nomeAluno).to.equal("Pedro");
    expect(registro.matricula).to.equal("120038870");
    expect(registro.curso).to.equal("Engenharia");
    expect(registro.periodo).to.equal("2025/1");
  });

  it("Deve adicionar disciplina ao CRID", async function () {
    await crid.registrarCRID("Pedro", "120038870", "Engenharia", "2025/1");
    await crid.adicionarDisciplina("60EEL874", "IA", 4, 60, "Inscrição normal");
    const disciplinas = await crid.getDisciplinas(owner.address);
    expect(disciplinas[0].codigo).to.equal("60EEL874");
    expect(disciplinas[0].nome).to.equal("IA");
  });

  it("Deve falhar ao tentar exceder 32 créditos", async () => {
    await crid.registrarCRID("Pedro", "123", "Engenharia", "2025/1");

    for (let i = 0; i < 6; i++) {
      await crid.adicionarDisciplina(`COD${i}`, `Disciplina ${i}`, 5, 60, "normal");
    }

    await expect(
      crid.adicionarDisciplina("EXTRA", "Extra", 5, 60, "normal")
    ).to.be.revertedWith("Limite de 32 creditos excedido.");
  });
});