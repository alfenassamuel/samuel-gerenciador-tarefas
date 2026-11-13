import React from 'react';
import { useTarefas } from '../context/TarefasContext';
import Tarefa from './Tarefa';

/**
 * Componente ListaDeTarefas:
 * Responsável por renderizar a coleção de tarefas filtradas.
 * Itera sobre as tarefas e renderiza o componente Tarefa para cada item.
 */
function ListaDeTarefas() {
  const { tarefasFiltradas, filtro } = useTarefas();

  if (tarefasFiltradas.length === 0) {
    let mensagemPrincipal = 'Nenhuma tarefa cadastrada ainda.';
    let mensagemSecundaria = 'Digite um nome acima e clique em "Adicionar" para começar!';

    if (filtro === 'Concluídas') {
      mensagemPrincipal = 'Nenhuma tarefa concluída no momento.';
      mensagemSecundaria = 'Marque a caixa de seleção de uma tarefa para concluí-la.';
    } else if (filtro === 'Pendentes') {
      mensagemPrincipal = 'Nenhuma tarefa pendente no momento.';
      mensagemSecundaria = 'Todas as tarefas cadastradas foram concluídas!';
    }

    return (
      <div className="lista-vazia">
        <p className="lista-vazia-icone">📝</p>
        <p className="lista-vazia-texto">{mensagemPrincipal}</p>
        <span className="lista-vazia-subtexto">{mensagemSecundaria}</span>
      </div>
    );
  }

  return (
    <ul className="lista-tarefas">
      {tarefasFiltradas.map((tarefa) => (
        <Tarefa key={tarefa.id} tarefa={tarefa} />
      ))}
    </ul>
  );
}

export default ListaDeTarefas;
