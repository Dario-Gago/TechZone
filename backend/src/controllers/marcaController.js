import * as marcaModel from '../models/Marca.js'

export const getAllMarcasController = async (req, res) => {
  try {
    const marcas = await marcaModel.getAllMarcas()
    res.json(marcas)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const getMarcaByIdController = async (req, res) => {
  try {
    const { id } = req.params
    const marca = await marcaModel.getMarcaById(id)

    if (!marca) {
      return res.status(404).json({
        error: 'Marca no encontrada',
        message: 'La marca solicitada no existe'
      })
    }

    res.json(marca)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const createMarcaController = async (req, res) => {
  try {
    const { nombre } = req.body

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({
        error: 'Campo requerido',
        message: 'El nombre de la marca es obligatorio'
      })
    }

    const marca = await marcaModel.createMarca(nombre.trim())
    res.status(201).json(marca)
  } catch (error) {
    res.status(400).json({
      error: 'Error al crear marca',
      message: error.message
    })
  }
}

export const updateMarcaController = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre } = req.body

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({
        error: 'Campo requerido',
        message: 'El nombre de la marca es obligatorio'
      })
    }

    const marca = await marcaModel.updateMarca(id, nombre.trim())

    if (!marca) {
      return res.status(404).json({
        error: 'Marca no encontrada',
        message: 'No existe una marca con el ID proporcionado'
      })
    }

    res.json({
      message: 'Marca actualizada correctamente',
      marca
    })
  } catch (error) {
    res.status(400).json({
      error: 'Error al actualizar marca',
      message: error.message
    })
  }
}

export const deleteMarcaController = async (req, res) => {
  try {
    const { id } = req.params
    const marca = await marcaModel.deleteMarca(id)

    if (!marca) {
      return res.status(404).json({
        error: 'Marca no encontrada',
        message: 'No existe una marca con el ID proporcionado'
      })
    }

    res.json({
      message: 'Marca eliminada correctamente',
      deletedMarca: marca
    })
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar marca',
      message: error.message
    })
  }
}
