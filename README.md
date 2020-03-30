# Asgard UI

Esse é o projeto que fornece uma Web UI para o projeto Asgard. Essa interfacce é um fork do projeto [Marathon UI](https://github.com/mesosphere/marathon-ui) + um conjunto de plugin
que implementa o que é necessário para termos:

* Isolamento total, ou seja, múltiplos times podem usar a mesma UI mas cada time só pode ver/modificar suas próprias aplicações. Cada time roda suas tarefas em servidores pŕoprios, totalmente isolados dos demais times.
* Autenticação via oauth2 (+JWT). Atualmente apenas o oauth2 do Google é suportado.
* Autorização, ou seja, poder darmos permissões finas a cada usuário de cada time.
* Quaisquer outras features que acharmos úteis e que não estejam incluídas no projeto original.

## Changelog


### 0.28.0

 * Força campo networks no modo JSON PR [41](https://github.com/b2wdigital/asgard-ui/pull/41)

### 0.27.0
 * Task State na lista de Tasks. PR [#34](https://github.com/b2wdigital/asgard-ui/pull/34)
 * Agents :: Exibir quantidade de recursos utilizados e total. [PR #35](https://github.com/b2wdigital/asgard-ui/pull/35)
 * Bump eslint from 1.10.3 to 4.18.2. [PR #36](https://github.com/b2wdigital/asgard-ui/pull/36)

### 0.26.0
 * Atualização do React para 15.4.0

### 0.25.2
 * Atualizando componente que implementa o modo JSON

### 0.24.0
 * Implementação da lógica de troca de conta, com dropdown listando as contas alternativas (https://github.com/B2W-BIT/asgard-ui/pull/4)

### 0.23.0
 * Fix no componente de exibição de log (https://github.com/lucasdomi/asgard-ui/pull/2)

### 0.22.0
 * Fix no css na tela de criação/edição de app

### 0.21.0
 * Adicionada nova tela qu mostra a lista de agents no cluster, com suas tags e com campo de busca por tags

### 0.20.0
 * Depreciando as opções HTTP, TCP, COMMAND como tipo de healthcheck validos. Deixando apenas MESOS_HTTP, MESOS_TCP e MESOS_HTTPS. Default: MESOS_HTTP.

### 0.19.0

 * Adicionado botoes de Download do stdout/stderr na aba Debug de uma Asgard App;
