import * as categoriaModel from '../models/Categoria.js'

export const getAllCategoriasController = async (req, res) => {
  try {
    const categorias = await categoriaModel.getAllCategorias()
    res.json(categorias)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const getCategoriaByIdController = async (req, res) => {
  try {
    const { id } = req.params
    const categoria = await categoriaModel.getCategoriaById(id)

    if (!categoria) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: 'La categoría solicitada no existe'
      })
    }

    res.json(categoria)
  } catch (error) {
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message
    })
  }
}

export const createCategoriaController = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({
        error: 'Campo requerido',
        message: 'El nombre de la categoría es obligatorio'
      })
    }

    const categoria = await categoriaModel.createCategoria(nombre.trim(), descripcion)
    res.status(201).json(categoria)
  } catch (error) {
    res.status(400).json({
      error: 'Error al crear categoría',
      message: error.message
    })
  }
}

export const updateCategoriaController = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, activo = true } = req.body

    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({
        error: 'Campo requerido',
        message: 'El nombre de la categoría es obligatorio'
      })
    }

    const categoria = await categoriaModel.updateCategoria(id, nombre.trim(), activo)

    if (!categoria) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: 'No existe una categoría con el ID proporcionado'
      })
    }

    res.json({
      message: 'Categoría actualizada correctamente',
      categoria
    })
  } catch (error) {
    res.status(400).json({
      error: 'Error al actualizar categoría',
      message: error.message
    })
  }
}

export const deleteCategoriaController = async (req, res) => {
  try {
    const { id } = req.params
    const categoria = await categoriaModel.deleteCategoria(id)

    if (!categoria) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: 'No existe una categoría con el ID proporcionado'
      })
    }

    res.json({
      message: 'Categoría desactivada correctamente',
      deletedCategoria: categoria
    })
  } catch (error) {
    res.status(500).json({
      error: 'Error al eliminar categoría',
      message: error.message
    })
  }
}

export const assignCategoriaToProductController = async (req, res) => {
  try {
    const { productId, categoryId } = req.body

    if (!productId || !categoryId) {
      return res.status(400).json({
        error: 'Campos requeridos',
        message: 'Se requieren productId y categoryId'
      })
    }

    const success = await categoriaModel.assignCategoriaToProduct(productId, categoryId)

    if (success) {
      res.json({ message: 'Categoría asignada al producto correctamente' })
    } else {
      res.status(400).json({ message: 'La categoría ya estaba asignada al producto' })
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error al asignar categoría',
      message: error.message
    })
  }
}

export const removeCategoriaFromProductController = async (req, res) => {
  try {
    const { productId, categoryId } = req.params

    const success = await categoriaModel.removeCategoriaFromProduct(productId, categoryId)

    if (success) {
      res.json({ message: 'Categoría removida del producto correctamente' })
    } else {
      res.status(404).json({ message: 'La categoría no estaba asignada al producto' })
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error al remover categoría',
      message: error.message
    })
  }
}

export const getCategoriasOfProductController = async (req, res) => {
  try {
    const { productId } = req.params
    const categorias = await categoriaModel.getCategoriasOfProduct(productId)
    res.json(categorias)
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener categorías del producto',
      message: error.message
    })
  }
}
