const database = require("../database");
const HOUSE_IMAGES_TABLE = "house_images";

class HouseImagesController {
  async index(request, response) {
    try {
      const data = await database.select("*").table(HOUSE_IMAGES_TABLE);
      if (data.length === 0) {
        response
          .status(404)
          .json({
            success: false,
            message: "Nenhuma imagem encontrada para a casa especificada.",
          });
      } else {
        response.status(200).json({ success: true, houseImages: data });
      }
    } catch (error) {
      console.error("Erro ao obter imagens da casa:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível obter as imagens da casa.",
        });
    }
  }

  async store(request, response) {
    const { house_id, image_url } = request.body;

    try {
      const houseExists = await database("houses")
        .where({ id: house_id })
        .first();

      if (!houseExists) {
        return response
          .status(404)
          .json({ success: false, message: "Casa não encontrada." });
      }

      await database(HOUSE_IMAGES_TABLE).insert({
        house_id: house_id,
        image_url: image_url,
      });

      response
        .status(200)
        .json({ success: true, message: "Imagem adicionada com sucesso!" });
    } catch (error) {
      console.error("Erro ao adicionar imagem da casa:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível adicionar a imagem da casa.",
        });
    }
  }

  async show(request, response) {
    const id = request.params.id;

    try {
      const houseImage = await database(HOUSE_IMAGES_TABLE)
        .where({ id: id })
        .first();

      if (houseImage) {
        response.status(200).json({ success: true, houseImage });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Imagem da casa não encontrada." });
      }
    } catch (error) {
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível obter a imagem da casa.",
        });
    }
  }

  async update(request, response) {
    const id = request.params.id;
    const { house_id, image_url } = request.body;
    const updateData = { house_id, image_url };

    try {
      const houseExists = await database("houses")
        .where({ id: house_id })
        .first();

      if (!houseExists) {
        return response
          .status(404)
          .json({ success: false, message: "Casa não encontrada." });
      }

      if (
        request.method === "PUT" &&
        Object.values(updateData).some((param) => param === undefined)
      ) {
        return response
          .status(400)
          .json({
            success: false,
            message:
              "Todos os parâmetros são obrigatórios para atualização com o método PUT.",
          });
      }

      if (request.method === "PATCH") {
        Object.keys(updateData).forEach(
          (key) => updateData[key] === undefined && delete updateData[key]
        );
      }
      await database(HOUSE_IMAGES_TABLE).where({ id }).update(updateData);
      response
        .status(200)
        .json({
          success: true,
          message: "Imagem da casa atualizada com sucesso!",
        });
    } catch (error) {
      console.error("Erro ao atualizar imagem da casa:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível atualizar a imagem da casa.",
        });
    }
  }

  async destroy(request, response) {
    const id = request.params.id;

    try {
      await database(HOUSE_IMAGES_TABLE).where({ id }).del();
      response
        .status(200)
        .json({
          success: true,
          message: "Imagem da casa excluída com sucesso!",
        });
    } catch (error) {
      console.error("Erro ao excluir imagem da casa:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível excluir a imagem da casa.",
        });
    }
  }
}

module.exports = new HouseImagesController();
