import Discipline from '../models/Discipline.js';

export async function createDiscipline(req, res) {
  try {
    const { name, code, description } = req.body;
    const professorId = req.user.id;
    
    if (!name || !code) {
      return res.status(400).json({ error: 'Nome e código são obrigatórios' });
    }
    
    // Verificar se código já existe
    const existingDiscipline = await Discipline.findOne({ code });
    if (existingDiscipline) {
      return res.status(400).json({ error: 'Código de disciplina já existe' });
    }
    
    const discipline = new Discipline({
      name,
      code,
      description,
      professorId
    });
    
    await discipline.save();
    
    res.status(201).json({
      message: 'Disciplina criada com sucesso',
      discipline
    });
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
    res.status(500).json({ error: 'Erro ao criar disciplina' });
  }
}

export async function getDisciplinesByProfessor(req, res) {
  try {
    const professorId = req.user.id;
    
    const disciplines = await Discipline.find({ professorId });
    
    res.json(disciplines);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
}

export async function getAllDisciplines(req, res) {
  try {
    const disciplines = await Discipline.find()
      .populate('professorId', 'name email');
    
    res.json(disciplines);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplinas' });
  }
}

export async function getDisciplineById(req, res) {
  try {
    const { id } = req.params;
    
    const discipline = await Discipline.findById(id)
      .populate('professorId', 'name email');
    
    if (!discipline) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    
    res.json(discipline);
  } catch (error) {
    console.error('Erro ao buscar disciplina:', error);
    res.status(500).json({ error: 'Erro ao buscar disciplina' });
  }
}

export async function updateDiscipline(req, res) {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    
    const discipline = await Discipline.findById(id);
    
    if (!discipline) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    
    if (discipline.professorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    if (name) discipline.name = name;
    if (code) discipline.code = code;
    if (description) discipline.description = description;
    
    await discipline.save();
    
    res.json({
      message: 'Disciplina atualizada com sucesso',
      discipline
    });
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error);
    res.status(500).json({ error: 'Erro ao atualizar disciplina' });
  }
}

export async function deleteDiscipline(req, res) {
  try {
    const { id } = req.params;
    
    const discipline = await Discipline.findById(id);
    
    if (!discipline) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    
    if (discipline.professorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    await Discipline.findByIdAndDelete(id);
    
    res.json({ message: 'Disciplina deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar disciplina:', error);
    res.status(500).json({ error: 'Erro ao deletar disciplina' });
  }
}
