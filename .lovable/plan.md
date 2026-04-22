
Plano para corrigir a recuperação de senha

A recuperação de senha não está funcionando porque o app está chamando o Firebase com a chave `demo-key`. Essa chave foi usada como fallback para evitar tela preta quando o Firebase não estava configurado, mas ela não é válida para enviar emails reais de redefinição de senha.

Erro atual identificado:
```text
POST identitytoolkit.googleapis.com/...sendOobCode?key=demo-key
Status: 400
API key not valid. Please pass a valid API key.
```

## O que vou ajustar

1. Corrigir a detecção de Firebase configurado
   - Alterar `src/lib/firebase.ts` para não inicializar o Firebase com valores falsos como `demo-key`.
   - O app só deve criar `auth` quando as variáveis reais `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID` e `VITE_FIREBASE_APP_ID` existirem.
   - Se não estiver configurado, `auth` continuará `null`, sem quebrar o app.

2. Melhorar o fluxo de recuperação de senha
   - Atualizar `resetPassword` em `src/context/AuthContext.tsx` para:
     - impedir chamadas ao Firebase quando a configuração estiver ausente;
     - repassar erros específicos do Firebase;
     - opcionalmente definir uma URL de retorno/autorização para o domínio atual.
   - Atualizar `src/pages/ForgotPassword.tsx` para exibir mensagens mais claras:
     - Firebase não configurado;
     - email inválido;
     - muitas tentativas;
     - domínio não autorizado;
     - erro de chave/API inválida.

3. Evitar falsa confirmação de envio
   - Hoje a tela pode parecer funcional, mas a requisição falha no Firebase.
   - Vou garantir que a mensagem “Confira seu email” só apareça quando o Firebase confirmar que o email foi enviado.

4. Adicionar instruções de configuração no projeto
   - Atualizar `.env.example` com comentários explicando quais variáveis são necessárias.
   - Indicar que, para a recuperação funcionar de verdade, será necessário configurar um projeto Firebase real e habilitar:
     - Authentication;
     - Email/Password provider;
     - domínio autorizado do app no Firebase Auth.

5. Verificar as rotas
   - Manter `/forgot-password` como rota pública.
   - Confirmar que o link “Esqueci minha senha” em `/login` continua apontando corretamente para essa página.

## Resultado esperado

Depois da correção:
- Se o Firebase não estiver configurado, o usuário verá uma mensagem clara em vez de uma falha genérica.
- Se o Firebase estiver configurado corretamente, o email de recuperação será enviado.
- O app não tentará mais usar `demo-key` para chamadas reais.
- A recuperação de senha não dará uma falsa impressão de sucesso.

## Observação importante

Para envio real de email, o código sozinho não basta: é obrigatório ter as credenciais reais do Firebase configuradas no ambiente do projeto. A correção vai deixar isso explícito e impedir chamadas inválidas com chave demo.
