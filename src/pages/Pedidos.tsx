import React, { useState, useEffect } from 'react';
import './Pedidos.css';

interface Pedido {
  id: number;
  invoice: string;
  tipo: 'pai' | 'filho';
  referenciaPai?: string;
  dataCadastro: string;
  idCompra: string;
  infoFornecedores: string;
  motivo: string;
  totalPeso: number;
  totalInvoice: number;
  totalBalance: number;
  totalPI: number;
  leadTime: string;
  dolarHoje: number;
  produtos: string;
}

interface Financeiro {
  id: number;
  invoice: string;
  data: string;
  numeroContrato: string;
  dolarInvoice: number;
  dataPagamentoDolarInvoice: string;
  dolarBalance: number;
  dataPagamentoDolarBalance: string;
}

interface Logistica {
  id: number;
  invoice: string;
  data: string;
  totalCaixas: number;
  dataColeta: string;
  agente: string;
  modal: 'aéreo' | 'marítimo';
  rastreio: string;
  dataBrasil: string;
  dataPrevisaoChegada: string;
  dataChegadaEstoque: string;
  preCusto1: number;
  preCusto2: number;
}

// Dados mockados para teste
const mockPedidos: Pedido[] = [
  {
    id: 1,
    invoice: 'INV-001',
    tipo: 'pai',
    dataCadastro: '2024-01-15',
    idCompra: 'COMP-001',
    infoFornecedores: 'Fornecedor ABC Ltda',
    motivo: 'reposição',
    totalPeso: 150.50,
    totalInvoice: 2500.00,
    totalBalance: 2800.00,
    totalPI: 2800.00,
    leadTime: '2024-02-14',
    dolarHoje: 5.1234,
    produtos: 'Produto A, Produto B'
  },
  {
    id: 2,
    invoice: 'INV-002',
    tipo: 'filho',
    referenciaPai: 'INV-001',
    dataCadastro: '2024-01-20',
    idCompra: 'COMP-002',
    infoFornecedores: 'Fornecedor XYZ Ltda',
    motivo: 'novidade',
    totalPeso: 75.25,
    totalInvoice: 1200.00,
    totalBalance: 1350.00,
    totalPI: 1350.00,
    leadTime: '2024-02-04',
    dolarHoje: 5.1234,
    produtos: 'Produto C'
  },
  {
    id: 3,
    invoice: 'INV-003',
    tipo: 'pai',
    dataCadastro: '2024-02-01',
    idCompra: 'COMP-003',
    infoFornecedores: 'Fornecedor DEF Ltda',
    motivo: 'garantia',
    totalPeso: 200.75,
    totalInvoice: 3200.00,
    totalBalance: 3500.00,
    totalPI: 3500.00,
    leadTime: '2024-03-17',
    dolarHoje: 5.1234,
    produtos: 'Produto D, Produto E, Produto F'
  },
  {
    id: 4,
    invoice: 'INV-004',
    tipo: 'filho',
    referenciaPai: 'INV-003',
    dataCadastro: '2024-02-05',
    idCompra: 'COMP-004',
    infoFornecedores: 'Fornecedor GHI Ltda',
    motivo: 'reposição',
    totalPeso: 50.00,
    totalInvoice: 800.00,
    totalBalance: 900.00,
    totalPI: 900.00,
    leadTime: '2024-02-25',
    dolarHoje: 5.1234,
    produtos: 'Produto H, Produto I, Produto J, Produto K, Produto L'
  },
  {
    id: 5,
    invoice: 'INV-005',
    tipo: 'pai',
    dataCadastro: '2024-02-10',
    idCompra: 'COMP-005',
    infoFornecedores: 'Fornecedor JKL Ltda',
    motivo: 'novidade',
    totalPeso: 300.25,
    totalInvoice: 4500.00,
    totalBalance: 4800.00,
    totalPI: 4800.00,
    leadTime: '2024-04-11',
    dolarHoje: 5.1234,
    produtos: ''
  }
];

// Função para contar produtos
const countProducts = (produtos: string): string => {
  if (!produtos || produtos.trim() === '') {
    return '0 itens';
  }
  
  const productList = produtos.split(',').filter(p => p.trim() !== '');
  const count = productList.length;
  
  if (count === 1) {
    return '1 item';
  } else {
    return `${count} itens`;
  }
};

const mockFinanceiro: Financeiro[] = [
  {
    id: 1,
    invoice: 'INV-001',
    data: '2024-01-15',
    numeroContrato: 'CONT-001',
    dolarInvoice: 5.1200,
    dataPagamentoDolarInvoice: '2024-01-20',
    dolarBalance: 5.1500,
    dataPagamentoDolarBalance: '2024-02-01'
  },
  {
    id: 2,
    invoice: 'INV-002',
    data: '2024-01-20',
    numeroContrato: 'CONT-002',
    dolarInvoice: 5.1300,
    dataPagamentoDolarInvoice: '2024-01-25',
    dolarBalance: 5.1600,
    dataPagamentoDolarBalance: '2024-02-05'
  },
  {
    id: 3,
    invoice: 'INV-003',
    data: '2024-02-01',
    numeroContrato: 'CONT-003',
    dolarInvoice: 5.1400,
    dataPagamentoDolarInvoice: '2024-02-06',
    dolarBalance: 5.1700,
    dataPagamentoDolarBalance: '2024-02-15'
  },
  {
    id: 4,
    invoice: 'INV-004',
    data: '2024-02-05',
    numeroContrato: 'CONT-004',
    dolarInvoice: 5.1500,
    dataPagamentoDolarInvoice: '2024-02-10',
    dolarBalance: 5.1800,
    dataPagamentoDolarBalance: '2024-02-20'
  },
  {
    id: 5,
    invoice: 'INV-005',
    data: '2024-02-10',
    numeroContrato: 'CONT-005',
    dolarInvoice: 5.1600,
    dataPagamentoDolarInvoice: '2024-02-15',
    dolarBalance: 5.1900,
    dataPagamentoDolarBalance: '2024-02-25'
  }
];

const mockLogistica: Logistica[] = [
  {
    id: 1,
    invoice: 'INV-001',
    data: '2024-01-15',
    totalCaixas: 15,
    dataColeta: '2024-01-18',
    agente: 'Agente A',
    modal: 'marítimo',
    rastreio: 'TRK001',
    dataBrasil: '2024-02-20',
    dataPrevisaoChegada: '2024-02-25',
    dataChegadaEstoque: '2024-02-28',
    preCusto1: 150.00,
    preCusto2: 75.00
  },
  {
    id: 2,
    invoice: 'INV-002',
    data: '2024-01-20',
    totalCaixas: 8,
    dataColeta: '2024-01-22',
    agente: 'Agente B',
    modal: 'aéreo',
    rastreio: 'TRK002',
    dataBrasil: '2024-01-30',
    dataPrevisaoChegada: '2024-02-02',
    dataChegadaEstoque: '2024-02-05',
    preCusto1: 200.00,
    preCusto2: 100.00
  },
  {
    id: 3,
    invoice: 'INV-003',
    data: '2024-02-01',
    totalCaixas: 25,
    dataColeta: '2024-02-05',
    agente: 'Agente C',
    modal: 'marítimo',
    rastreio: 'TRK003',
    dataBrasil: '2024-03-10',
    dataPrevisaoChegada: '2024-03-15',
    dataChegadaEstoque: '2024-03-18',
    preCusto1: 300.00,
    preCusto2: 150.00
  },
  {
    id: 4,
    invoice: 'INV-004',
    data: '2024-02-05',
    totalCaixas: 12,
    dataColeta: '2024-02-08',
    agente: 'Agente D',
    modal: 'aéreo',
    rastreio: 'TRK004',
    dataBrasil: '2024-02-15',
    dataPrevisaoChegada: '2024-02-18',
    dataChegadaEstoque: '2024-02-20',
    preCusto1: 180.00,
    preCusto2: 90.00
  },
  {
    id: 5,
    invoice: 'INV-005',
    data: '2024-02-10',
    totalCaixas: 30,
    dataColeta: '2024-02-12',
    agente: 'Agente E',
    modal: 'marítimo',
    rastreio: 'TRK005',
    dataBrasil: '2024-03-25',
    dataPrevisaoChegada: '2024-03-30',
    dataChegadaEstoque: '2024-04-02',
    preCusto1: 400.00,
    preCusto2: 200.00
  }
];

const Pedidos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pedidos' | 'financeiro' | 'logistica'>('pedidos');
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [financeiro, setFinanceiro] = useState<Financeiro[]>([]);
  const [logistica, setLogistica] = useState<Logistica[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTerm, setFilteredTerm] = useState('');
  const [dolarHoje, setDolarHoje] = useState<number>(0);

  // Estados do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState<Pedido | null>(null);
  const [formData, setFormData] = useState({
    tipo: 'pai' as 'pai' | 'filho',
    invoice: '',
    dataCriacao: new Date().toISOString().split('T')[0],
    idCompra: '',
    motivo: '',
    leadTime: new Date().toISOString().split('T')[0],
    referenciaPai: ''
  });

  // Estados para edição inline
  const [editingCell, setEditingCell] = useState<{rowId: number, field: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const pageSizeOptions = [20, 50, 100, 300, 500, 1000];

  // Funções mockadas para simular API
  const loadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      setPedidos([...mockPedidos]);
      setFinanceiro([...mockFinanceiro]);
      setLogistica([...mockLogistica]);
      setDolarHoje(5.1234); // Valor mockado do dólar
      setLoading(false);
    }, 500); // Simula delay de rede
  };

  const createPedido = async (pedidoData: Omit<Pedido, 'id'>) => {
    const newPedido: Pedido = {
      ...pedidoData,
      id: Math.max(...pedidos.map(p => p.id), 0) + 1
    };
    setPedidos(prev => [...prev, newPedido]);
  };

  const updatePedido = async (id: number, pedidoData: Partial<Pedido>) => {
    setPedidos(prev => prev.map(p => 
      p.id === id ? { ...p, ...pedidoData } : p
    ));
  };

  const deletePedido = async (id: number) => {
    setPedidos(prev => prev.filter(p => p.id !== id));
  };

  // Funções para edição inline
  const handleCellDoubleClick = (rowId: number, field: string, currentValue: any) => {
    setEditingCell({ rowId, field });
    setEditValue(String(currentValue));
  };

  const handleCellKeyDown = (e: React.KeyboardEvent, rowId: number, field: string) => {
    if (e.key === 'Enter') {
      saveInlineEdit(rowId, field);
    } else if (e.key === 'Escape') {
      cancelInlineEdit();
    }
  };

  const saveInlineEdit = (rowId: number, field: string) => {
    if (activeTab === 'pedidos') {
      const pedido = pedidos.find(p => p.id === rowId);
      if (pedido) {
        const updatedPedido = {
          ...pedido,
          [field]: field === 'leadTime' 
                   ? editValue // Lead Time agora é string (data)
                   : field === 'totalPeso' || field === 'totalBalance' 
                   ? pedido[field as keyof Pedido] // Manter valor original (não editável)
                   : field === 'totalInvoice' || field === 'totalPI' || field === 'dolarHoje' 
                   ? parseFloat(editValue) || 0 
                   : editValue
        };
        updatePedido(rowId, updatedPedido);
      }
    } else if (activeTab === 'financeiro') {
      const financeiroItem = financeiro.find(f => f.id === rowId);
      if (financeiroItem) {
        const updatedFinanceiro = {
          ...financeiroItem,
          [field]: field === 'dolarInvoice' || field === 'dolarBalance' 
                   ? parseFloat(editValue) || 0 : editValue
        };
        setFinanceiro(prev => prev.map(f => f.id === rowId ? updatedFinanceiro : f));
      }
    } else if (activeTab === 'logistica') {
      const logisticaItem = logistica.find(l => l.id === rowId);
      if (logisticaItem) {
        const updatedLogistica = {
          ...logisticaItem,
          [field]: field === 'totalCaixas' || field === 'preCusto1' || field === 'preCusto2' 
                   ? parseFloat(editValue) || 0 : editValue
        };
        setLogistica(prev => prev.map(l => l.id === rowId ? updatedLogistica : l));
      }
    }
    
    setEditingCell(null);
    setEditValue('');
  };

  const cancelInlineEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Funções para paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
    setCurrentPage(1); // Volta para a primeira página
  };

  const getPaginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: any[]) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  // Componente para renderizar células editáveis
  const EditableCell = ({ 
    rowId, 
    field, 
    value, 
    isNumeric = false,
    isDate = false,
    isDropdown = false,
    dropdownOptions = []
  }: { 
    rowId: number; 
    field: string; 
    value: any; 
    isNumeric?: boolean;
    isDate?: boolean;
    isDropdown?: boolean;
    dropdownOptions?: string[];
  }) => {
    const isEditing = editingCell?.rowId === rowId && editingCell?.field === field;
    
    if (isEditing) {
      if (isDate) {
        return (
          <input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => handleCellKeyDown(e, rowId, field)}
            onBlur={() => cancelInlineEdit()}
            className="inline-edit-input date-input"
            autoFocus
          />
        );
      } else if (isDropdown) {
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => handleCellKeyDown(e, rowId, field)}
            onBlur={() => cancelInlineEdit()}
            className="inline-edit-input dropdown-input"
            autoFocus
          >
            {dropdownOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      } else {
        return (
          <input
            type={isNumeric ? "number" : "text"}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => handleCellKeyDown(e, rowId, field)}
            onBlur={() => cancelInlineEdit()}
            className="inline-edit-input"
            autoFocus
          />
        );
      }
    }
    
    return (
      <span 
        onDoubleClick={() => handleCellDoubleClick(rowId, field, value)}
        className="editable-cell"
      >
        {value}
      </span>
    );
  };

  // Carrega os dados ao montar o componente
  useEffect(() => {
    loadMockData();
  }, []);

  const handleTabChange = (tab: 'pedidos' | 'financeiro' | 'logistica') => {
    setActiveTab(tab);
    setFilteredTerm('');
    setSearchTerm('');
  };

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      tipo: 'pai',
      invoice: '',
      dataCriacao: new Date().toISOString().split('T')[0],
      idCompra: '',
      motivo: '',
      leadTime: new Date().toISOString().split('T')[0],
      referenciaPai: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      tipo: 'pai',
      invoice: '',
      dataCriacao: new Date().toISOString().split('T')[0],
      idCompra: '',
      motivo: '',
      leadTime: new Date().toISOString().split('T')[0],
      referenciaPai: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const pedidoData = {
      ...formData,
      invoice: formData.invoice,
      dataCadastro: formData.dataCriacao,
      idCompra: formData.idCompra,
      motivo: formData.motivo,
      leadTime: formData.leadTime, // Agora é string (data)
      dolarHoje: dolarHoje,
      totalPeso: 0,
      totalInvoice: 0,
      totalBalance: 0,
      totalPI: 0,
      produtos: '',
      infoFornecedores: '',
      referenciaPai: formData.tipo === 'filho' ? formData.referenciaPai : undefined
    };
    
    if (isEditing && editingId) {
      await updatePedido(editingId, pedidoData);
    } else {
      await createPedido(pedidoData as Omit<Pedido, 'id'>);
    }
    handleCloseModal();
  };

  const handleEdit = (pedido: Pedido) => {
    setIsEditing(true);
    setEditingId(pedido.id);
    setFormData({
      tipo: pedido.tipo,
      invoice: pedido.invoice,
      dataCriacao: pedido.dataCadastro,
      idCompra: pedido.idCompra,
      motivo: pedido.motivo,
      leadTime: pedido.leadTime, // Agora é string
      referenciaPai: pedido.referenciaPai || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (pedido: Pedido) => {
    setPedidoToDelete(pedido);
    setIsDeleteModalOpen(true);
  };

  const handleAddTaxes = (pedido: Pedido) => {
    // TODO: Implementar modal de impostos
    console.log('Adicionar impostos para o pedido:', pedido.invoice);
    alert(`Adicionar impostos para o pedido ${pedido.invoice}`);
  };

  // Funções para financeiro
  const handleEditFinanceiro = (item: Financeiro) => {
    // TODO: Implementar modal de edição de financeiro
    console.log('Editar financeiro:', item.invoice);
    alert(`Editar dados financeiros do invoice ${item.invoice}`);
  };

  const handleAddTaxesFinanceiro = (item: Financeiro) => {
    // TODO: Implementar modal de impostos para financeiro
    console.log('Adicionar impostos para financeiro:', item.invoice);
    alert(`Adicionar impostos para o financeiro ${item.invoice}`);
  };

  const handleDeleteFinanceiro = (item: Financeiro) => {
    // TODO: Implementar confirmação de exclusão de financeiro
    console.log('Excluir financeiro:', item.invoice);
    if (confirm(`Tem certeza que deseja excluir os dados financeiros do invoice ${item.invoice}?`)) {
      setFinanceiro(prev => prev.filter(f => f.id !== item.id));
    }
  };

  // Funções para logística
  const handleEditLogistica = (item: Logistica) => {
    // TODO: Implementar modal de edição de logística
    console.log('Editar logística:', item.invoice);
    alert(`Editar dados logísticos do invoice ${item.invoice}`);
  };

  const handleAddTaxesLogistica = (item: Logistica) => {
    // TODO: Implementar modal de impostos para logística
    console.log('Adicionar impostos para logística:', item.invoice);
    alert(`Adicionar impostos para a logística ${item.invoice}`);
  };

  const handleDeleteLogistica = (item: Logistica) => {
    // TODO: Implementar confirmação de exclusão de logística
    console.log('Excluir logística:', item.invoice);
    if (confirm(`Tem certeza que deseja excluir os dados logísticos do invoice ${item.invoice}?`)) {
      setLogistica(prev => prev.filter(l => l.id !== item.id));
    }
  };

  const confirmDelete = async () => {
    if (pedidoToDelete) {
      await deletePedido(pedidoToDelete.id);
      setIsDeleteModalOpen(false);
      setPedidoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPedidoToDelete(null);
  };

  // Função para normalizar texto removendo acentos
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  // Filtrar dados baseado no termo de busca
  const getFilteredData = () => {
    const searchTermNormalized = normalizeText(filteredTerm);
    
    let filteredData: any[] = [];
    
    switch (activeTab) {
      case 'pedidos':
        filteredData = pedidos.filter(pedido => {
          return (
            normalizeText(pedido.invoice).includes(searchTermNormalized) ||
            pedido.id.toString().includes(filteredTerm) ||
            normalizeText(pedido.idCompra).includes(searchTermNormalized) ||
            normalizeText(pedido.motivo).includes(searchTermNormalized)
          );
        });
        break;
      case 'financeiro':
        filteredData = financeiro.filter(item => {
          return (
            normalizeText(item.invoice).includes(searchTermNormalized) ||
            item.id.toString().includes(filteredTerm) ||
            normalizeText(item.numeroContrato).includes(searchTermNormalized)
          );
        });
        break;
      case 'logistica':
        filteredData = logistica.filter(item => {
          return (
            normalizeText(item.invoice).includes(searchTermNormalized) ||
            item.id.toString().includes(filteredTerm) ||
            normalizeText(item.agente).includes(searchTermNormalized) ||
            normalizeText(item.modal).includes(searchTermNormalized)
          );
        });
        break;
      default:
        filteredData = [];
    }
    
    return filteredData;
  };

  const getPaginatedFilteredData = () => {
    const filteredData = getFilteredData();
    return getPaginatedData(filteredData);
  };

  const handleSearch = () => {
    setFilteredTerm(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderTable = () => {
    const filteredData = getFilteredData();
    const paginatedData = getPaginatedFilteredData();

    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      );
    }


    if (filteredData.length === 0) {
      return (
        <div className="empty-container">
          <p>Nenhum registro encontrado.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'pedidos':
        return (
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Invoice NF</th>
                <th>Tipo</th>
                <th>Ref. Pai</th>
                <th>Data Cadastro</th>
                <th>ID Compra</th>
                <th>Info Fornecedores</th>
                <th>Motivo</th>
                <th>Total Peso</th>
                <th>Total Invoice</th>
                <th>Total Balance</th>
                <th>Total PI</th>
                <th>Lead Time</th>
                <th>Dólar Hoje</th>
                <th>Produtos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(paginatedData as Pedido[]).map((pedido, index) => (
                <tr key={pedido.id} style={{ animationDelay: `${index * 0.1}s` }} className="table-row-animated">
                  <td className="id-cell">{pedido.id}</td>
                  <td className="invoice-cell">
                    <EditableCell rowId={pedido.id} field="invoice" value={pedido.invoice} />
                  </td>
                  <td className="tipo-cell">
                    <span className={pedido.tipo === 'pai' ? 'tipo-pai' : 'tipo-filho'}>
                      {pedido.tipo}
                    </span>
                  </td>
                  <td className="referencia-cell">
                    <EditableCell rowId={pedido.id} field="referenciaPai" value={pedido.referenciaPai || '-'} />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={pedido.id} field="dataCadastro" value={pedido.dataCadastro} />
                  </td>
                  <td className="compra-cell">
                    <EditableCell rowId={pedido.id} field="idCompra" value={pedido.idCompra} />
                  </td>
                  <td className="fornecedor-cell">
                    <EditableCell rowId={pedido.id} field="infoFornecedores" value={pedido.infoFornecedores} />
                  </td>
                  <td className="motivo-cell">
                    <EditableCell 
                      rowId={pedido.id} 
                      field="motivo" 
                      value={pedido.motivo} 
                      isDropdown={true}
                      dropdownOptions={['reposição', 'novidade', 'garantia']}
                    />
                  </td>
                  <td className="peso-cell">{pedido.totalPeso.toFixed(2)}</td>
                  <td className="invoice-valor-cell">
                    <EditableCell rowId={pedido.id} field="totalInvoice" value={pedido.totalInvoice.toFixed(2)} isNumeric />
                  </td>
                  <td className="balance-cell">{pedido.totalBalance.toFixed(2)}</td>
                  <td className="pi-cell">
                    <EditableCell rowId={pedido.id} field="totalPI" value={pedido.totalPI.toFixed(2)} isNumeric />
                  </td>
                  <td className="leadtime-cell">
                    <EditableCell rowId={pedido.id} field="leadTime" value={pedido.leadTime} isDate={true} />
                  </td>
                  <td className="dolar-cell">
                    <span className="currency-symbol">R$</span><EditableCell rowId={pedido.id} field="dolarHoje" value={pedido.dolarHoje.toFixed(4)} isNumeric />
                  </td>
                  <td className="produtos-cell">{countProducts(pedido.produtos)}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-button edit"
                        onClick={() => handleEdit(pedido)}
                        title="Editar pedido"
                      >
                        <span className="material-symbols-outlined">package_2</span>
                      </button>
                      <button 
                        className="action-button taxes"
                        onClick={() => handleAddTaxes(pedido)}
                        title="Adicionar impostos"
                      >
                        <span className="material-symbols-outlined">percent</span>
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDelete(pedido)}
                        title="Excluir pedido"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'financeiro':
        return (
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Invoice</th>
                <th>Data</th>
                <th>Nº Contrato</th>
                <th>Dólar Invoice</th>
                <th>Data Pag. Dólar Invoice</th>
                <th>Dólar Balance</th>
                <th>Data Pag. Dólar Balance</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(paginatedData as Financeiro[]).map((item, index) => (
                <tr key={item.id} style={{ animationDelay: `${index * 0.1}s` }} className="table-row-animated">
                  <td className="id-cell">{item.id}</td>
                  <td className="invoice-cell">
                    <EditableCell rowId={item.id} field="invoice" value={item.invoice} />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={item.id} field="data" value={item.data} />
                  </td>
                  <td className="contrato-cell">
                    <EditableCell rowId={item.id} field="numeroContrato" value={item.numeroContrato} />
                  </td>
                  <td className="dolar-cell">
                    <span className="currency-symbol">R$</span><EditableCell rowId={item.id} field="dolarInvoice" value={item.dolarInvoice.toFixed(4)} isNumeric />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={item.id} field="dataPagamentoDolarInvoice" value={item.dataPagamentoDolarInvoice} />
                  </td>
                  <td className="dolar-cell">
                    <span className="currency-symbol">R$</span><EditableCell rowId={item.id} field="dolarBalance" value={item.dolarBalance.toFixed(4)} isNumeric />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={item.id} field="dataPagamentoDolarBalance" value={item.dataPagamentoDolarBalance} />
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-button edit"
                        onClick={() => handleEditFinanceiro(item)}
                        title="Editar financeiro"
                      >
                        <span className="material-symbols-outlined">package_2</span>
                      </button>
                      <button 
                        className="action-button taxes"
                        onClick={() => handleAddTaxesFinanceiro(item)}
                        title="Adicionar impostos"
                      >
                        <span className="material-symbols-outlined">percent</span>
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDeleteFinanceiro(item)}
                        title="Excluir financeiro"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'logistica':
        return (
          <table className="pedidos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Invoice</th>
                <th>Data</th>
                <th>Total Caixas</th>
                <th>Data Coleta</th>
                <th>Agente</th>
                <th>Modal</th>
                <th>Rastreio</th>
                <th>Data Brasil</th>
                <th>Data Prev. Chegada</th>
                <th>Data Chegada Estoque</th>
                <th>Pré-custo 1</th>
                <th>Pré-custo 2</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(paginatedData as Logistica[]).map((item, index) => (
                <tr key={item.id} style={{ animationDelay: `${index * 0.1}s` }} className="table-row-animated">
                  <td className="id-cell">{item.id}</td>
                  <td className="invoice-cell">
                    <EditableCell rowId={item.id} field="invoice" value={item.invoice} />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={item.id} field="data" value={item.data} />
                  </td>
                  <td className="caixas-cell">
                    <EditableCell rowId={item.id} field="totalCaixas" value={item.totalCaixas} isNumeric />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={item.id} field="dataColeta" value={item.dataColeta} />
                  </td>
                  <td className="agente-cell">
                    <EditableCell rowId={item.id} field="agente" value={item.agente} />
                  </td>
                  <td className="modal-cell">
                    <span className={item.modal === 'aéreo' ? 'modal-aereo' : 'modal-maritimo'}>
                      {item.modal}
                    </span>
                  </td>
                  <td className="rastreio-cell">
                    <EditableCell rowId={item.id} field="rastreio" value={item.rastreio} />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={item.id} field="dataBrasil" value={item.dataBrasil} />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={item.id} field="dataPrevisaoChegada" value={item.dataPrevisaoChegada} />
                  </td>
                  <td className="data-cell">
                    <EditableCell rowId={item.id} field="dataChegadaEstoque" value={item.dataChegadaEstoque} />
                  </td>
                  <td className="custo-cell">
                    <span className="currency-symbol">R$</span><EditableCell rowId={item.id} field="preCusto1" value={item.preCusto1.toFixed(2)} isNumeric />
                  </td>
                  <td className="custo-cell">
                    <span className="currency-symbol">R$</span><EditableCell rowId={item.id} field="preCusto2" value={item.preCusto2.toFixed(2)} isNumeric />
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-button edit"
                        onClick={() => handleEditLogistica(item)}
                        title="Editar logística"
                      >
                        <span className="material-symbols-outlined">package_2</span>
                      </button>
                      <button 
                        className="action-button taxes"
                        onClick={() => handleAddTaxesLogistica(item)}
                        title="Adicionar impostos"
                      >
                        <span className="material-symbols-outlined">percent</span>
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDeleteLogistica(item)}
                        title="Excluir logística"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  // Componente de paginação
  const PaginationComponent = () => {
    const filteredData = getFilteredData();
    const totalPages = getTotalPages(filteredData);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

    const generatePageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    if (filteredData.length === 0) return null;

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          <span>Mostrando {startItem} a {endItem} de {filteredData.length} registros</span>
        </div>
        
        <div className="pagination-controls">
          <div className="items-per-page">
            <label>Itens por página:</label>
            <select 
              value={itemsPerPage} 
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="page-size-select"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <div className="page-navigation">
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              Primeira
            </button>
            
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
            
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Última
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pedidos-container">
      {/* Header Card */}
      <div className="header-card">
        <div className="header-content">
          <div className="header-title">
            <span className="material-symbols-outlined header-icon">
              shopping_cart
            </span>
            <h1>Pedidos</h1>
          </div>
          
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="search-input"
              />
              <button className="search-button" onClick={handleSearch}>
                <span className="material-symbols-outlined">search</span>
                Buscar
              </button>
            </div>
            
            <div className="filter-actions">
              <button className="new-button" onClick={handleOpenModal}>
                <span className="material-symbols-outlined">add</span>
                Novo Pedido
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="tabs-card">
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => handleTabChange('pedidos')}
          >
            <span className="material-symbols-outlined tab-icon pedidos-icon">shopping_cart</span>
            Pedidos
          </button>
          <button 
            className={`tab-button ${activeTab === 'financeiro' ? 'active' : ''}`}
            onClick={() => handleTabChange('financeiro')}
          >
            <span className="material-symbols-outlined tab-icon financeiro-icon">attach_money</span>
            Financeiro
          </button>
          <button 
            className={`tab-button ${activeTab === 'logistica' ? 'active' : ''}`}
            onClick={() => handleTabChange('logistica')}
          >
            <span className="material-symbols-outlined tab-icon logistica-icon">local_shipping</span>
            Logística
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        <div className="table-content">
          {renderTable()}
        </div>
        <PaginationComponent />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Editar Pedido' : 'Novo Pedido'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="tipo">Tipo *</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="pai">Pai</option>
                  <option value="filho">Filho</option>
                </select>
              </div>

              {formData.tipo === 'filho' && (
                <div className="form-group">
                  <label htmlFor="referenciaPai">Selecione o pedido pai *</label>
                  <select
                    id="referenciaPai"
                    name="referenciaPai"
                    value={formData.referenciaPai}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um pedido pai</option>
                    {pedidos.filter(p => p.tipo === 'pai').map(pedido => (
                      <option key={pedido.id} value={pedido.invoice}>
                        {pedido.invoice}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="invoice">Invoice NF *</label>
                <input
                  type="text"
                  id="invoice"
                  name="invoice"
                  value={formData.invoice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dataCriacao">Data da Criação</label>
                <input
                  type="date"
                  id="dataCriacao"
                  name="dataCriacao"
                  value={formData.dataCriacao}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="idCompra">ID Compra</label>
                <input
                  type="text"
                  id="idCompra"
                  name="idCompra"
                  value={formData.idCompra}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="motivo">Motivo da Compra</label>
                <select
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleInputChange}
                >
                  <option value="">Selecione o motivo</option>
                  <option value="reposição">Reposição</option>
                  <option value="novidade">Novidade</option>
                  <option value="garantia">Garantia</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="leadTime">Lead Time</label>
                <input
                  type="date"
                  id="leadTime"
                  name="leadTime"
                  value={formData.leadTime}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Dólar Hoje (API Banco Central)</label>
                <input
                  type="text"
                  value={`R$ ${dolarHoje.toFixed(4)}`}
                  readOnly
                  className="readonly-input"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && pedidoToDelete && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <div className="delete-icon">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h2>Confirmar Exclusão</h2>
            </div>
            
            <div className="delete-modal-body">
              <p>Tem certeza que deseja excluir o pedido:</p>
              <div className="pedido-info">
                <strong>Invoice: {pedidoToDelete.invoice}</strong>
                <span>ID Compra: {pedidoToDelete.idCompra}</span>
              </div>
              <p className="warning-text">Esta ação não pode ser desfeita.</p>
            </div>
            
            <div className="delete-modal-actions">
              <button type="button" className="btn-cancel" onClick={cancelDelete}>
                Cancelar
              </button>
              <button type="button" className="btn-delete" onClick={confirmDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;