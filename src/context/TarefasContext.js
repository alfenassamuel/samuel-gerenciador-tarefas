import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 1. Criação do Contexto para gerenciamento do Estado Global
export const TarefasContext = createContext();

// Chave para persistência local
const STORAGE_KEY = 'gerenciador_tarefas_react';

// Estado inicial com lista vazia para iniciar sem nenhuma tarefa pré-definida
const estadoInicial = {
  tarefas: [],
  filtro: 'Todas', // 'Todas' | 'Concluídas' | 'Pendentes'
};

// Carrega dados salvos ou usa o estado inicial vazio
const carregarEstadoInicial = () => {
  try {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (dadosSalvos) {
      const parsed = JSON.parse(dadosSalvos);
      if (Array.isArray(parsed.tarefas)) {
        return {
          ...estadoInicial,
          tarefas: parsed.tarefas,
        };
      }
    }
  } catch (error) {
    console.warn('Não foi possível carregar do localStorage:', error);
  }
  return estadoInicial;
};

// 2. Reducer para manipulação IMUTÁVEL do estado
function tarefasReducer(state, action) {
  switch (action.type) {
    case 'ADICIONAR_TAREFA': {
      const texto = action.payload.trim();
      if (!texto) return state;

      const novaTarefa = {
        id: Date.now(),
        texto,
        concluida: false,
      };

      // Atualização imutável usando spread operator
      return {
        ...state,
        tarefas: [...state.tarefas, novaTarefa],
      };
    }

    case 'ALTERNAR_TAREFA': {
      // Atualização imutável com map: altera apenas a tarefa correspondente
      return {
        ...state,
        tarefas: state.tarefas.map((tarefa) =>
          tarefa.id === action.payload
            ? { ...tarefa, concluida: !tarefa.concluida }
            : tarefa
        ),
      };
    }

    case 'REMOVER_TAREFA': {
      // Remoção imutável usando filter
      return {
        ...state,
        tarefas: state.tarefas.filter((tarefa) => tarefa.id !== action.payload),
      };
    }

    case 'DEFINIR_FILTRO': {
      return {
        ...state,
        filtro: action.payload,
      };
    }

    default:
      return state;
  }
}

// 3. Provedor do Contexto
export function TarefasProvider({ children }) {
  const [state, dispatch] = useReducer(tarefasReducer, estadoInicial, carregarEstadoInicial);

  // Efeito para salvar no localStorage sempre que as tarefas mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tarefas: state.tarefas }));
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }, [state.tarefas]);

  // Ações auxiliares para facilitar o uso nos componentes
  const adicionarTarefa = (texto) => {
    dispatch({ type: 'ADICIONAR_TAREFA', payload: texto });
  };

  const alternarTarefa = (id) => {
    dispatch({ type: 'ALTERNAR_TAREFA', payload: id });
  };

  const removerTarefa = (id) => {
    dispatch({ type: 'REMOVER_TAREFA', payload: id });
  };

  const definirFiltro = (filtro) => {
    dispatch({ type: 'DEFINIR_FILTRO', payload: filtro });
  };

  // Cálculo das tarefas filtradas de acordo com o status selecionado
  const tarefasFiltradas = state.tarefas.filter((tarefa) => {
    if (state.filtro === 'Concluídas') {
      return tarefa.concluida === true;
    }
    if (state.filtro === 'Pendentes') {
      return tarefa.concluida === false;
    }
    return true; // 'Todas'
  });

  // Estatísticas das tarefas
  const estatisticas = {
    total: state.tarefas.length,
    concluidas: state.tarefas.filter((t) => t.concluida).length,
    pendentes: state.tarefas.filter((t) => !t.concluida).length,
  };

  const valor = {
    tarefas: state.tarefas,
    filtro: state.filtro,
    tarefasFiltradas,
    estatisticas,
    adicionarTarefa,
    alternarTarefa,
    removerTarefa,
    definirFiltro,
    dispatch,
  };

  return <TarefasContext.Provider value={valor}>{children}</TarefasContext.Provider>;
}

// 4. Hook customizado para consumir o contexto facilmente
export function useTarefas() {
  const context = useContext(TarefasContext);
  if (!context) {
    throw new Error('useTarefas deve ser utilizado dentro de um TarefasProvider');
  }
  return context;
}
