const database = require("../database");
const HOUSES_TABLE = "houses";

class HousesController {
  async index(request, response) {
    try {
      const data = await database.select("*").table(HOUSES_TABLE);
      if (data.length === 0) {
        response
          .status(404)
          .json({ success: false, message: "Nenhuma casa encontrada." });
      } else {
        response.status(200).json({ success: true, houses: data });
      }
    } catch (error) {
      console.error("Erro ao obter lista de casas:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível obter a lista de casas.",
        });
    }
  }

  async store(request, response) {
    const {
      user_id,
      description,
      street,
      neighborhood,
      number,
      complement,
      cep,
      city,
      state,
      bathrooms_count,
      suite,
      garage,
      area,
    } = request.body;

    try {
      const userExists = await database("users").where({ id: user_id }).first();

      if (!userExists) {
        return response
          .status(404)
          .json({ success: false, message: "Usuário não encontrada." });
      }

      await database
        .insert({
          user_id,
          description,
          street,
          neighborhood,
          number,
          complement,
          cep,
          city,
          state,
          bathrooms_count,
          suite,
          garage,
          area,
        })
        .table(HOUSES_TABLE);
      response
        .status(200)
        .json({ success: true, message: "Casa cadastrada com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar casa:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível cadastrar a casa.",
        });
    }
  }

  async show(request, response) {
    const id = request.params.id;

    try {
      const house = await database
        .select("*")
        .table(HOUSES_TABLE)
        .where({ id })
        .first();

      if (house) {
        response.status(200).json({ success: true, house });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Casa não encontrada." });
      }
    } catch (error) {
      console.error("Erro ao obter casa:", error);
      response
        .status(500)
        .json({ success: false, message: "Não foi possível obter a casa." });
    }
  }

  async update(request, response) {
    const id = request.params.id;
    const {
      user_id,
      description,
      street,
      neighborhood,
      number,
      complement,
      cep,
      city,
      state,
      bathrooms_count,
      suite,
      garage,
      area,
    } = request.body;

    const updateData = {
      user_id,
      description,
      street,
      neighborhood,
      number,
      complement,
      cep,
      city,
      state,
      bathrooms_count,
      suite,
      garage,
      area,
    };

    try {
      const userExists = await database("users").where({ id: user_id }).first();

      if (!userExists) {
        return response
          .status(404)
          .json({ success: false, message: "Usuário não encontrada." });
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

      await database(HOUSES_TABLE).where({ id }).update(updateData);
      response
        .status(200)
        .json({ success: true, message: "Casa atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar casa:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível atualizar a casa.",
        });
    }
  }

  async destroy(request, response) {
    const id = request.params.id;

    try {
      await database(HOUSES_TABLE).where({ id }).del();
      response
        .status(200)
        .json({ success: true, message: "Casa excluída com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir casa:", error);
      response
        .status(500)
        .json({ success: false, message: "Não foi possível excluir a casa." });
    }
  }
}

module.exports = new HousesController();
