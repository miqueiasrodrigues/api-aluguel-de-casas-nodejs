const database = require("../database");
const TABLE_NAME = "available_days";

class AvailableDayController {
  async index(request, response) {
    try {
      const data = await database.select("*").table(TABLE_NAME);
      if (data.length === 0) {
        response
          .status(404)
          .json({
            success: false,
            message: "Nenhuma data disponível para aluguel encontrada.",
          });
      } else {
        response
          .status(200)
          .json({ success: true, availableRentalDates: data });
      }
    } catch (error) {
      console.error("Erro ao obter datas disponíveis para aluguel:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível obter as datas disponíveis para aluguel.",
        });
    }
  }

  async store(request, response) {
    const {
      house_id,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      is_all,
      status,
    } = request.body;

    try {
      const houseExists = await database("houses")
        .where({ id: house_id })
        .first();

      if (!houseExists) {
        return response
          .status(404)
          .json({ success: false, message: "Casa não encontrada." });
      }

      await database(TABLE_NAME).insert({
        house_id,
        start_date,
        end_date,
        start_time,
        end_time,
        price,
        is_all,
        status,
      });

      response
        .status(200)
        .json({
          success: true,
          message: "Datas disponíveis para aluguel adicionadas com sucesso!",
        });
    } catch (error) {
      response
        .status(500)
        .json({
          success: false,
          message:
            "Não foi possível adicionar as datas disponíveis para aluguel.",
        });
    }
  }

  async show(request, response) {
    const id = request.params.id;

    try {
      const availableRentalDate = await database(TABLE_NAME)
        .where({ id })
        .first();

      if (availableRentalDate) {
        response.status(200).json({ success: true, availableRentalDate });
      } else {
        response
          .status(404)
          .json({
            success: false,
            message: "Data disponível para aluguel não encontrada.",
          });
      }
    } catch (error) {
      console.error("Erro ao obter data disponível para aluguel:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível obter a data disponível para aluguel.",
        });
    }
  }

  async update(request, response) {
    const id = request.params.id;
    const {
      house_id,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      is_all,
      status,
    } = request.body;
    const updateData = {
      house_id,
      start_date,
      end_date,
      start_time,
      end_time,
      price,
      is_all,
      status,
    };

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
      await database(TABLE_NAME).where({ id }).update(updateData);
      response
        .status(200)
        .json({
          success: true,
          message: "Data disponível para aluguel atualizada com sucesso!",
        });
    } catch (error) {
      console.error("Erro ao atualizar data disponível para aluguel:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível atualizar a data disponível para aluguel.",
        });
    }
  }

  async destroy(request, response) {
    const id = request.params.id;

    try {
      await database(TABLE_NAME).where({ id }).del();

      response
        .status(200)
        .json({
          success: true,
          message: "Data disponível para aluguel excluída com sucesso!",
        });
    } catch (error) {
      console.error("Erro ao excluir data disponível para aluguel:", error);
      response
        .status(500)
        .json({
          success: false,
          message: "Não foi possível excluir a data disponível para aluguel.",
        });
    }
  }
}

module.exports = new AvailableDayController();
