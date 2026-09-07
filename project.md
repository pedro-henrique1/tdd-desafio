# 🏡 Sistema de Reservas de Propriedades (Desafio TDD)

Este projeto é um exemplo simplificado de um sistema de reservas de propriedades, inspirado em plataformas como o Airbnb. O objetivo principal desta base de código é aplicar e consolidar conhecimentos em **Desenvolvimento Orientado a Testes (TDD)**.

---

## 📖 Sobre o Projeto

A aplicação permite que usuários atuem como hóspedes, buscando propriedades, realizando reservas por períodos específicos e, se necessário, cancelando-as de acordo com regras de negócio e políticas de reembolso bem definidas. 

### 🚀 Funcionalidades da Aplicação

1. **Realizar Reservas**
   - Usuários podem reservar uma propriedade desde que ela esteja disponível e o número de hóspedes não exceda a capacidade máxima.
   - O preço total é calculado com base no valor por noite e na quantidade de noites.
   - **Desconto automático:** Reservas de 7 ou mais noites recebem 10% de desconto.
   - Ao confirmar, a propriedade fica indisponível para aquele período.

2. **Cancelar Reservas e Políticas de Reembolso**
   - **Reembolso Total (FullRefund):** Cancelamento com mais de 7 dias antes do check-in.
   - **Reembolso Parcial (PartialRefund):** Cancelamento entre 1 e 7 dias antes do check-in (50% do valor).
   - **Sem Reembolso (NoRefund):** Cancelamento com menos de 1 dia de antecedência.
   - Cancelamentos atualizam o status para "CANCELLED" e liberam o calendário da propriedade. Tentativas de cancelar reservas inexistentes ou já canceladas geram erros.

3. **Validações de Domínio**
   - O número de hóspedes deve ser maior que zero e menor ou igual à capacidade da propriedade.
   - O preço base por noite de uma propriedade deve ser obrigatoriamente maior que zero.

---

## 🎯 Escopo do Desafio (TDD)

As seguintes implementações e testes foram desenvolvidos utilizando a metodologia TDD (Test-Driven Development):

- [x] **1. Testes Unitários nos Mappers (`Property` e `Booking`)**
  - Validação das funções `toDomain` e `toPersistence`.
  - Tratamento de exceções para campos obrigatórios ausentes.
- [x] **2. Testes E2E: Criação de Usuário (Guest)**
  - Cobertura do endpoint `POST /users`.
  - Validação de erros HTTP (ex: código 400 para nome vazio).
- [x] **3. Testes E2E: Criação de Propriedade**
  - Cobertura do endpoint `POST /properties`.
  - Regra de negócio: `basePricePerNight` deve ser maior que zero.
  - Validação de erros HTTP para dados ausentes ou inválidos.
- [x] **4. Testes Unitários: Políticas de Reembolso (`RefundRuleFactory`)**
  - Cobertura dos três cenários de estorno (Full, Partial e No Refund) baseados na antecedência do cancelamento.
- [x] **5. Testes de Cancelamento de Reserva**
  - Garantia de que o sistema lance um erro ("Reserva não encontrada") ao tentar cancelar reservas inexistentes.

---

## ⚙️ Como Executar o Projeto

**1. Clone o repositório**
```bash
git clone [https://github.com/pedro-henrique1/tdd-desafio](https://github.com/pedro-henrique1/tdd-desafio)
cd fc4-tdd

npm install && npm install --save-dev


npm run test


```