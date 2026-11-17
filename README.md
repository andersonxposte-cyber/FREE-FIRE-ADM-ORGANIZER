# FREE FIRE ADM ORGANIZER

Aplicativo inicial em Expo / React Native, com fluxo de compilação Android automático pelo GitHub Actions.

## Como gerar o APK sem instalar ferramentas no computador

1. Crie uma conta no GitHub.
2. Crie um repositório novo, por exemplo `free-fire-adm-organizer`.
3. Extraia este ZIP no seu telemóvel/computador.
4. Envie **todos os ficheiros e pastas** para o repositório (incluindo a pasta `.github`).
5. No GitHub, abra a aba **Actions**.
6. Se aparecer um aviso para permitir workflows, clique em **I understand my workflows, go ahead and enable them**.
7. Abra o workflow **Build Android APK** e toque em **Run workflow**. Também começa automaticamente quando fizer push para `main` ou `master`.
8. Aguarde a compilação terminar com um visto verde.
9. Abra a execução concluída, desça até **Artifacts** e descarregue `FREE-FIRE-ADM-ORGANIZER-APK`.
10. Extraia o ZIP do artifact: dentro estará o APK para instalar no Android.

## Criar uma Release com link de APK
Depois de enviar o projeto, crie uma tag `v1.0.0` no GitHub (ou publique uma tag pela página Releases). O workflow compila e anexa o APK à Release automaticamente.

## Executar localmente
Requer Node.js 20:
```bash
npm install
npx expo start
```

## Estado desta versão
Já incluído:
- Navegação Início, Apostas, Campeonatos, Inventário e Conta.
- Registo de apostas com comissão automática conforme a regra atualmente definida.
- Histórico e cancelamento lógico de apostas.
- Criação de torneios com sorteio inicial e histórico.
- Notas guardadas localmente.
- Movimentos de saldo e listas a pagar / receber.
- Persistência local com AsyncStorage.
- Workflow GitHub Actions para compilar APK Android.

Ainda não está completo em relação ao documento de requisitos:
- Bracket completo com avanço automático de vencedores.
- Upload e armazenamento de imagens das quedas.
- Exportação PDF/Excel.
- PIN e biometria.
- Sincronização cloud entre dispositivos.
- Notificações.
- Relatórios temporais completos e configuração visual das taxas.
- Interface de edição de nick/perfil e edição avançada dos registos.

## Regras financeiras que precisam de confirmação
A comissão foi implementada como 5 MT para apostas de 10–25 MT e 10 MT para apostas a partir de 30 MT. Os intervalos 5–9 MT e 26–29 MT não foram definidos no pedido; nesta versão a comissão fica em 0 MT nesses intervalos. Confirme a regra antes de usar com dinheiro real.

## Importante
O GitHub Actions compila o APK em servidores do GitHub; por isso, o APK só ficará disponível depois de uma execução bem-sucedida do workflow. Este ZIP é o código-fonte preparado para gerar o APK, não um APK já compilado.
