import React from 'react';
import { useTarefas } from '../context/TarefasContext';

/**
 * Componente Tarefa:
 * Responsável por renderizar uma única tarefa da lista.
 * Contém o checkbox para marcar como concluída/pendente e opção de remoção.
 */
function Tarefa({ tarefa }) {
  const { alternarTarefa, removerTarefa } = useTarefas();

  return (
    <li className={`tarefa-item ${tarefa.concluida ? 'concluida' : ''}`}>
      <label className="tarefa-conteudo">
        <input
          type="checkbox"
          checked={tarefa.concluida}
          onChange={() => alternarTarefa(tarefa.id)}
          className="tarefa-checkbox"
          aria-label={`Marcar "${tarefa.texto}" como ${tarefa.concluida ? 'pendente' : 'concluída'}`}
        />
        <span className="tarefa-texto">{tarefa.texto}</span>
      </label>

      <div className="tarefa-acoes">
        <span className={`status-badge ${tarefa.concluida ? 'badge-concluida' : 'badge-pendente'}`}>
          {tarefa.concluida ? 'Concluída' : 'Pendente'}
        </span>
        <button
          type="button"
          onClick={() => removerTarefa(tarefa.id)}
          className="botao-remover"
          title="Excluir tarefa"
          aria-label={`Excluir tarefa ${tarefa.texto}`}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

export default Tarefa;
