const database = require("../database");
const USERS_TABLE = "users";

class UserController {
  async index(request, response) {
    try {
      const data = await database.select("*").table(USERS_TABLE);
      if (data.length === 0) {
        response
          .status(404)
          .json({ success: false, message: "Nenhum usuário encontrado." });
      } else {
        response.status(200).json({ success: true, users: data });
      }
    } catch (error) {
      console.error("Erro ao obter lista de usuários:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível obter a lista de usuários.",
        });
    }
  }

  async store(request, response) {
    const { name, email, credential, phone, password, is_owner } = request.body;

    try {
      await database
        .insert({ name, email, credential, phone, password, is_owner })
        .table(USERS_TABLE);
      response
        .status(200)
        .json({ success: true, message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível cadastrar o usuário.",
        });
    }
  }

  async show(request, response) {
    const id = request.params.id;

    try {
      const user = await database
        .select("*")
        .table(USERS_TABLE)
        .where({ id })
        .first();

      if (user) {
        response.status(200).json({ success: true, user });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Usuário não encontrado." });
      }
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      response
        .status(500)
        .json({ success: false, message: "Não foi possível obter o usuário." });
    }
  }

  async update(request, response) {
    const id = request.params.id;
    const { name, email, credential, phone, password, is_owner } = request.body;
    const updateData = { name, email, credential, phone, password, is_owner };

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

    try {
      await database(USERS_TABLE).where({ id }).update(updateData);
      response
        .status(200)
        .json({ success: true, message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível atualizar o usuário.",
        });
    }
  }

  async destroy(request, response) {
    const id = request.params.id;

    try {
      await database(USERS_TABLE).where({ id }).del();
      response
        .status(200)
        .json({ success: true, message: "Usuário excluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível excluir o usuário.",
        });
    }
  }
}

module.exports = new UserController();
